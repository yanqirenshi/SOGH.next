import { nodesOf } from './models/GraphQLNode.js';

// 入れ子で来た関連の node を、モデルにして Pool に入れる。
//
// 親の node2〜 (Pooler) が、親を Pool に入れる前に、親の型のメソッドを呼ぶ。
// 入れ子の node も node2〜 を通るので、そこからさらに中の関連が辿られる。
//
// 親の core には、入れ子の JSON をそのまま残す。
// 関連を返すメソッド (issue.assignees() など) は、JSON の id で Pool からモデルを引く。
//
// 決まり (yanqirenshi/SOGH.next#30):
//   1. 件数の上限で切れた関連は、取れた分だけをモデルにする。
//   2. 逆向きの関連 (User から、その人の Issue など) は持たない。
//   3. 一周する関連 (Issue → ProjectV2Item → ProjectV2 → owner の Issue など) は、特別に扱わない。
//      JSON は木なので、辿りは必ず終わる。
export default class Matchmaker {
    constructor (sogh) {
        this.sogh = sogh;

        // 入れ子を辿っている深さ。0 のときは、辿っていない。
        this._depth = 0;
    }
    /* **************************************************************** *
     *  入れ子
     * **************************************************************** */
    // 入れ子の node を辿っている途中かどうか。
    // Pool が、入れ子で来た node かどうかを見分けるのに使う。
    // (入れ子で来た node で、初めてモデルを作ったときに、reload を入れるため。yanqirenshi/SOGH.next#34)
    isNesting () {
        return this._depth > 0;
    }
    // fn の中で Pool に入る node を、入れ子で来たものとして扱う。
    nest (fn) {
        this._depth++;

        try {
            return fn();
        } finally {
            this._depth--;
        }
    }
    /* **************************************************************** *
     *  親の型ごと
     * **************************************************************** */
    repository (node) {
        this.model(node.owner); // User / Organization
    }
    user (node) {
    }
    issue (node) {
        const sogh = this.sogh;

        this.list(node.assignees, n=> sogh.node2user(n));
        this.model(node.author);
        this.list(node.labels, n=> sogh.node2label(n));
        this.one(node.milestone, n=> sogh.node2milestone(n));
        this.one(node.repository, n=> sogh.node2repository(n));
        this.list(node.projectItems, n=> sogh.node2projectV2Item(n));
        this.list(node.comments, n=> sogh.node2issueComment(n));
    }
    issueComment (node) {
        this.model(node.author);
        this.model(node.editor);
        this.one(node.pullRequest, n=> this.sogh.node2pullRequest(n));
    }
    // PullRequest の関連は、最初の範囲 (yanqirenshi/SOGH.next#29 の表) には入っていない。
    // PullRequest の assignees()・repository()・author() がモデルを返すので、Pool に入れる。
    // (yanqirenshi/SOGH.next#49。いまは、どのクエリも PullRequest のこれらの関連を取っていない)
    pullRequest (node) {
        const sogh = this.sogh;

        this.list(node.assignees, n=> sogh.node2user(n));
        this.one(node.repository, n=> sogh.node2repository(n));
        this.model(node.author);
    }
    projectV2 (node) {
        this.model(node.creator);
        this.model(node.owner); // User / Organization / Issue / PullRequest
        this.list(node.items, n=> this.sogh.node2projectV2Item(n));
    }
    projectV2Item (node) {
        const sogh = this.sogh;

        this.one(node.project, n=> sogh.node2projectV2(n));
        this.model(node.content); // Issue / PullRequest / DraftIssue
        this.model(node.creator);

        // fieldValues そのものはモデルにしない。中の関連だけをモデルにする。
        // (箱に付いている creator は、モデルにしない)
        for (const value of nodesOf(node.fieldValues)) {
            if (!value)
                continue;

            this.list(value.users, n=> sogh.node2user(n));
            this.list(value.labels, n=> sogh.node2label(n));
            this.one(value.milestone, n=> sogh.node2milestone(n));
            this.one(value.repository, n=> sogh.node2repository(n));
            this.list(value.pullRequests, n=> sogh.node2pullRequest(n));
            this.list(value.reviewers, n=> this.model(n)); // User / Team / Mannequin / Bot
        }
    }
    /* **************************************************************** *
     *  部品
     * **************************************************************** */
    // 型が 1 つに決まっている関連。
    one (node, node2obj) {
        if (!node || !node.id)
            return null;

        return this.nest(()=> node2obj(node));
    }
    // 型が 1 つに決まっている、複数の関連。(nodes と edges のどちらの形でもよい)
    list (connection, node2obj) {
        return nodesOf(connection)
            .map(node=> this.one(node, node2obj))
            .filter(obj=> obj!==null);
    }
    // 型が複数ありうる関連。__typename でモデルを選ぶ。
    model (node) {
        return this.nest(()=> this.sogh.node2model(node));
    }
}
