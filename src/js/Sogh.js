import Pooler from './Pooler.js';
import { GitHubError } from './Loader.js';
import { nodesOf } from './models/GraphQLNode.js';

import * as QUERIES from './queries/index.js';

export default class Sogh extends Pooler {
    constructor () {
        super();

        this._queries = QUERIES;

        this._routes = {
            'issue':            '/scrum/users/:login/repositories/:repository/issues/:number',
            'project-v2':       '/scrum/users/:login/projects/:number',
            'project-v2-data':  '/scrum/users/:login/projects/:number',
            'project-v2-items': '/scrum/users/:login/projects/:project-number/items/:id',
        };

        this._members = [];
    }
    // クエリの文字列。(名前が code のクエリが無いときは undefined)
    query (code) {
        const definition = this.queryDefinition(code);

        return definition ? definition.query : undefined;
    }
    // クエリの定義 { query, pick }。(名前が code のクエリが無いときは null) (yanqirenshi/SOGH.next#65)
    //   query … クエリの文字列。値は、GraphQL の variables で渡す。
    //   pick  … 応答の data から、取り出す値 (node か、ページ送りする一覧) を返す関数。
    queryDefinition (code) {
        return this._queries[code] || null;
    }
    /** **************************************************************** *
     * routes
     * **************************************************************** */
    routes (v) {
        if (arguments.length>0)
            this._routes = v;

        return this._routes;
    }
    href (to, data) {
        const routes = this.routes();
        const base = routes[to];

        if ('project-v2'===to)
            return base
            .replace(':login',  data.creator().login())
            .replace(':number', data.number());

        if ('project-v2-data'===to) {
            return base
            .replace(':login',  data.owner.login)
            .replace(':number', data.number);
        }

        if ('project-v2-items'===to)
            return base
            .replace(':login',  data.projectOwnerLogin())
            .replace(':project-number', data.projectNumber())
            .replace(':id', data.id());

        const keys = Object.keys(data);

        return keys.reduce((str, key)=> {
            let out = str;

            if (key==='id') out = str.replaceAll(':id', data[key]);

            return out;
        }, base);
    }
    /** **************************************************************** *
     * Auth
     * **************************************************************** */
    connect (token, successed, failed) {
        this.token(token);

        const definition = this.queryDefinition('viewer');

        return this.fetchX(
            definition.query,
            (node) => {
                return this.node2user(definition.pick(node.data));
            },
            (results) => {
                const viewer = results.data;

                this.viewer(viewer);

                if (successed) successed(viewer);
            },
            (error) => {
                this.viewer(null);

                if (failed) failed(error);
            });
    }
    /** **************************************************************** *
     * Member
     * **************************************************************** */
    members (v) {
        if (arguments.length>0)
            this._members = v;

        return this._members;
    }
    member (code) {
        return this._members.find(m=> m.code===code) || null;
    }
    /** **************************************************************** *
     * コメントの追加・更新・削除
     * **************************************************************** */
    updateIssueComment (id, body, callbacks={}) {
        callback('start', callbacks, [id, body]);

        let out = [];

        const { query, pick } = this.queryDefinition('update_issue_comment');

        const post_data = this.postData(query, { id: id, body: body });

        fetch(this.endpoint(), post_data)
            .then(response  => this.text2json(response))
            .then(response  => {
                // GraphQL のエラーは json2response が throw して catch に回る。
                const r = this.json2response(response, d=> {
                    const issue_comment_node = pick(d.data);
                    return this.node2issueComment(issue_comment_node);
                });

                callback('successed', callbacks, [r.data.id(), id, body]);
            })
            .catch(err => {
                callback('failed', callbacks, [this.error2response(err), id, body]);
            });

        return out;
    }
    createIssueComment (id, body, callbacks={}) {
        callback('start', callbacks, [id, body]);

        let out = [];

        const { query, pick } = this.queryDefinition('create_issue_comment');

        const post_data = this.postData(query, { id: id, body: body });

        fetch(this.endpoint(), post_data)
            .then(response  => this.text2json(response))
            .then(response  => {
                // GraphQL のエラーは json2response が throw して catch に回る。
                const r = this.json2response(response, d=> {
                    const issue_comment_node = pick(d.data);
                    return this.node2issueComment(issue_comment_node);
                });

                callback('successed', callbacks, [r.data.id(), id, body]);
            })
            .catch(err => {
                callback('failed', callbacks, [this.error2response(err), id, body]);
            });

        return out;
    }
    deleteIssueComment (id, callbacks={}) {
        callback('start', callbacks, [id]);

        let out = [];

        const { query, pick } = this.queryDefinition('delete_issue_comment');

        const post_data = this.postData(query, { id: id });

        fetch(this.endpoint(), post_data)
            .then(response  => this.text2json(response))
            .then(response  => {
                // HTTP 200 でも GraphQL の errors が返ることがある。
                // json2response が throw して catch (failed) に回る。
                this.json2response(response, d=> pick(d.data));

                // GitHub から消せたので、Pool からも消す。(successed の前に。yanqirenshi/SOGH.next#69)
                this.pool('issue-comment').remove(id);

                callback('successed', callbacks, [id]);
            })
            .catch(err => {
                callback('failed', callbacks, [this.error2response(err), id]);
            });

        return out;
    }
    /** **************************************************************** *
     * 取得の部品 (yanqirenshi/SOGH.next#61・#63・#65)
     * **************************************************************** */
    // クエリを 1 回送り、クエリの pick で取り出した値を返す。
    // 失敗したとき・取り出した値が無いとき (null など) は、GitHubError を投げる。
    async fetchNode (code, variables) {
        const definition = this.queryDefinition(code);

        const data = await this.request(definition.query, variables);
        const picked = definition.pick(data);

        if (picked===null || picked===undefined)
            throw new GitHubError(`GitHub の応答に、取り出す値がありません (${code})`, { status: 200 });

        return picked;
    }
    // ページ送りする一覧を、最後のページまで取る。
    // ページごとに onPage(connection) を呼ぶ。(connection は、pick で取り出した一覧。nodes か edges と、pageInfo)
    // 2 ページめからは、変数 after に、前のページの endCursor を入れて送る。
    // 途中で失敗したときは、GitHubError を投げる。(途中まで集めた分は、返さない)
    async fetchPages (code, variables, onPage) {
        let after = null;

        for (;;) {
            const connection = await this.fetchNode(code, { ...variables, after });

            onPage(connection);

            const page_info = connection.pageInfo;

            if (!page_info || !page_info.hasNextPage)
                return;

            after = page_info.endCursor;
        }
    }
    // 一覧の node を、make でモデルにして Pool に入れ、id の配列を返す。(nodes と edges の、どちらの形でもよい)
    connection2ids (connection, make) {
        return nodesOf(connection)
            .filter(node=> node)
            .map(node=> make(node).id());
    }
    /** **************************************************************** *
     * 取得 (asyncFetch〜)
     *   成功したときは、id (または id の配列) を返す。
     *   失敗したときは、GitHubError を投げる。(yanqirenshi/SOGH.next#61)
     *   コールバックを受け取るメソッドは、失敗したとき、failed(error, ...) を呼んでから投げる。
     * **************************************************************** */
    async asyncFetchViewer () {
        const node = await this.fetchNode('viewer');

        return this.node2viewer(node);
    }
    /////
    ///// Repository
    /////
    async asyncFetchRepositoriesByViewer () {
        let out = [];

        await this.fetchPages('repositories_by_viewer', {}, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2repository(node)));
        });

        return out;
    }
    /////
    ///// Issue
    /////
    async asyncFetchIssueByID (id) {
        const node = await this.fetchNode('issue_by_id', { id });

        return this.node2issue(node).id();
    }
    async asyncFetchIssueByViewer () {
        let out = [];

        await this.fetchPages('issues_by_viewer', {}, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2issue(node)));
        });

        return out;
    }
    async asyncFetchIssueByOrgRepoIssueNumber (org_login, repo_name, issue_number) {
        const node = await this.fetchNode('issue_by_org_repo_issue_number', {
            org: org_login,
            repo: repo_name,
            number: Number(issue_number),
        });

        return this.node2issue(node).id();
    }
    /////
    ///// Issue Comments
    /////
    async asyncFetchIssueCommentsByID (id) {
        let out = [];

        await this.fetchPages('issue_comments_by_issue_id', { id }, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2issueComment(node)));
        });

        return out;
    }
    async asyncFetchIssueCommentsByOrgRepoIssueNumber (org_login, repo_name, issue_number) {
        const variables = {
            org: org_login,
            repo: repo_name,
            number: Number(issue_number),
        };

        let out = [];

        await this.fetchPages('issue_comments_by_org_repo_issue_number', variables, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2issueComment(node)));
        });

        return out;
    }
    /////
    ///// ProjectV2
    /////
    // viewer が入っていない (connect していない) ときは、[] を返す。(失敗ではない)
    async asyncFetchProjectsV2ByViewer () {
        const user = this.viewer();

        if (!user)
            return [];

        let out = [];

        await this.fetchPages('projectsv2_by_user', { login: user.login() }, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2projectV2(node)));
        });

        return out;
    }
    // callbacks: start()・fetched(このページの id の配列, それまでの id の配列)・successed(id の配列)・failed(error, それまでの id の配列)
    async asyncFetchProjectsV2ByTeam (team_id, callbacks={}) {
        return this.fetchProjectsV2OfTeam('projectsv2_by_team', team_id, callbacks);
    }
    // callbacks: asyncFetchProjectsV2ByTeam と同じ。
    async asyncFetchProjectsV2WithItemsByTeam (team_id, callbacks={}) {
        return this.fetchProjectsV2OfTeam('projectsv2_with_items_by_team', team_id, callbacks);
    }
    async fetchProjectsV2OfTeam (code, team_id, callbacks={}) {
        callback('start', callbacks);

        let out = [];

        try {
            await this.fetchPages(code, { teamId: team_id }, (connection)=> {
                const projects = this.connection2ids(connection, node=> this.node2projectV2(node));

                out = out.concat(projects);

                callback('fetched', callbacks, [projects, out]);
            });
        } catch (error) {
            callback('failed', callbacks, [error, out]);
            throw error;
        }

        callback('successed', callbacks, [out]);

        return out;
    }
    // callbacks: start()・successed(ProjectV2 の node)・failed(error, login, number)
    async asyncFetchProjectV2ByUserLoginProjectV2Number (login, number, callbacks={}) {
        callback('start', callbacks);

        let node;

        try {
            node = await this.fetchNode('projectv2_by_user_login_projectv2_number', { login, number: Number(number) });
        } catch (error) {
            callback('failed', callbacks, [error, login, number]);
            throw error;
        }

        callback('successed', callbacks, [node]);

        return this.node2projectV2(node).id();
    }
    // callbacks: start(login, number)・successed(ProjectV2 の node, login, number)・failed(error, login, number)
    async asyncFetchProjectV2ByOrgLoginProjectV2Number (login, number, callbacks={}) {
        callback('start', callbacks, [login, number]);

        let node;

        try {
            node = await this.fetchNode('projectv2_by_org_login_projectv2_number', { org: login, number: Number(number) });
        } catch (error) {
            callback('failed', callbacks, [error, login, number]);
            throw error;
        }

        callback('successed', callbacks, [node, login, number]);

        return this.node2projectV2(node).id();
    }
    /////
    ///// ProjectV2 Item
    /////
    // ProjectV2 の Item を、最後のページまで取る。(yanqirenshi/SOGH.next#64)
    async asyncFetchProjectV2ItemsByUserLoginProjectV2Number (login, number) {
        let out = [];

        await this.fetchPages('projectv2items_by_user_login_projectv2_number', { login, number: Number(number) }, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2projectV2Item(node)));
        });

        return out;
    }
    // ProjectV2 の Item を、最後のページまで取る。(yanqirenshi/SOGH.next#64)
    async asyncFetchProjectV2ItemsByOrgLoginProjectV2Number (login, number) {
        let out = [];

        await this.fetchPages('projectv2items_by_org_login_projectv2_number', { org: login, number: Number(number) }, (connection)=> {
            out = out.concat(this.connection2ids(connection, node=> this.node2projectV2Item(node)));
        });

        return out;
    }
    async asyncFetchProjectV2ItemByID (id) {
        const node = await this.fetchNode('projectv2item_by_id', { id });

        return this.node2projectV2Item(node).id();
    }
    async asyncFetchItemByID (id) {
        const node = await this.fetchNode('issue_by_id', { id });

        return this.node2issue(node).id();
    }
}

function callback (name, callbacks, params=[]) {
    const fn = callbacks[name];

    if (!fn || (typeof fn !== 'function'))
        return;

    fn(...params);
}
