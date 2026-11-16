import Loader from './Loader.js';

import * as model from './models/index.js';

import Pool from './Pool.js';
import Matchmaker from './Matchmaker.js';

export default class Pooler extends Loader {
    constructor () {
        super();

        this.matchmaker = new Matchmaker(this);

        this._pools = [
            ['repository',      model.Repository],
            ['user',            model.User],
            ['project-v2',      model.ProjectV2],
            ['project-v2-item', model.ProjectV2Item],
            ['issue',           model.Issue],
            ['issue-comment',   model.IssueComment],
            ['pull-request',    model.PullRequest],
            ['organization',    model.Organization],
            ['bot',             model.Bot],
            ['mannequin',       model.Mannequin],
            ['enterprise-user-account', model.EnterpriseUserAccount],
            ['draft-issue',     model.DraftIssue],
            ['team',            model.Team],
            ['label',           model.Label],
            ['milestone',       model.Milestone],
        ].reduce((ht, data)=> {
            const key = data[0];

            ht[key] = new Pool(this, data[1]);

            return ht;
        }, {});

    }
    pool (v) {
        return this._pools[v] || null;
    }
    get (id) {
        // GitHub の node id は種類をまたいで一意なので、全 pool から探す。
        for (const pool of Object.values(this._pools)) {
            const obj = pool.get(id);

            if (obj) return obj;
        }

        return null;
    }
    /* **************************************************************** *
     *                                                                  *
     * **************************************************************** */
    getPoolAndItemClass (code) {
        const pool = this.pool(code);

        return {
            pool: pool,
            item_class: pool.itemClass(),
        };
    }
    /* **************************************************************** *
     *  Viewer                                                          *
     * **************************************************************** */
    // viewer は User にそろえて、user の Pool に入れる。(yanqirenshi/SOGH.next#29)
    node2viewer (d) {
        this._viewer = d ? this.node2user(d) : null;

        return this._viewer;
    }
    /* **************************************************************** *
     *  Repository                                                      *
     * **************************************************************** */
    node2repository (node) {
        const pool = this.pool('repository');

        this.matchmaker.repository(node);

        return pool.ensure(node, (d)=> new model.Repository(d));
    }
    repositories (v) {
        return this.pool('repository').list();
    }
    repository (v) {
        const pool = this.pool('repository');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  User                                                            *
     * **************************************************************** */
    node2user (node) {
        const pool = this.pool('user');

        this.matchmaker.user(node);

        return pool.ensure(node, (d)=> new model.User(d));
    }
    user (v) {
        const pool = this.pool('user');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  ProjectV2                                                     *
     * **************************************************************** */
    node2projectV2 (node) {
        const {pool, item_class} = this.getPoolAndItemClass('project-v2');

        this.matchmaker.projectV2(node);

        return pool.ensure(node, (d)=> new item_class(d));
    }
    projectsV2 (v) {
        return this.pool('project-v2').list();
    }
    projectV2 (v) {
        const pool = this.pool('project-v2');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  ProjectNext Item                                                *
     * **************************************************************** */
    // content の PullRequest は、state を別名 pullRequestState で取っている。(yanqirenshi/SOGH.next#68)
    // Pool に入れる前に、state の名前に戻す。(Item の core に残る content も、取り方で変わらないように)
    // fieldValues の reviewers の Team は、name・avatarUrl を別名で取っている。(yanqirenshi/SOGH.next#39)
    // こちらも、Pool に入れる前に、name・avatarUrl の名前に戻す。
    node2projectV2Item (node) {
        const pool = this.pool('project-v2-item');

        node = restoreContentPullRequestState(node);
        node = restoreFieldValuesTeamAlias(node);

        this.matchmaker.projectV2Item(node);

        const obj = pool.ensure(node, (d)=> new model.ProjectV2Item(d));

        obj.sogh(this);

        return obj;
    }
    projectV2Item (v) {
        const pool = this.pool('project-v2-item');

        return pool.get(v);
    }
    // Pool にある ProjectV2Item のうち、ProjectV2 (project_id) のものを、Pool に入った順に返す。
    // 「その ProjectV2 の Item」は、Item の core の project の id で見る。(project の無い Item は入らない)
    // ProjectV2 の itemsInPool() と、removeProjectV2ItemsExcept() が使う。(選ぶ所を 1 か所にする。yanqirenshi/SOGH.next#108)
    projectV2ItemsOf (project_id) {
        if (!project_id)
            return [];

        return this.pool('project-v2-item').list().filter(item=> {
            const core = item.core();
            const project = core ? core.project : null;

            return !!project && project.id===project_id;
        });
    }
    // ProjectV2 (project_id) の Item のうち、ids に無いものを、Pool から消す。消した Item の id の配列を返す。
    // 消すのは ProjectV2Item のモデルだけ。中身 (Issue・PullRequest・DraftIssue) は、Pool に残す。
    // project_id が無いときは、何も消さない。(yanqirenshi/SOGH.next#108)
    removeProjectV2ItemsExcept (project_id, ids) {
        if (!project_id)
            return [];

        const keep = new Set(ids);
        const pool = this.pool('project-v2-item');

        return this.projectV2ItemsOf(project_id)
            .filter(item=> !keep.has(item.id()))
            .map(item=> {
                pool.remove(item.id());

                return item.id();
            });
    }
    /* **************************************************************** *
     *  Issue                                                           *
     * **************************************************************** */
    node2issue (node) {
        const pool = this.pool('issue');

        this.matchmaker.issue(node);

        return pool.ensure(node, (d)=> new model.Issue(d));
    }
    issues (v) {
        return this.pool('issue').list();
    }
    issue (v) {
        const pool = this.pool('issue');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  Issue Comment                                                   *
     * **************************************************************** */
    node2issueComment (node) {
        const pool = this.pool('issue-comment');

        this.matchmaker.issueComment(node);

        return pool.ensure(node, (d)=> new model.IssueComment(d));
    }
    issueComment (v) {
        const pool = this.pool('issue-comment');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  Issue                                                           *
     * **************************************************************** */
    // ProjectV2Item の content として来た PullRequest は、state を別名 pullRequestState で取っている。
    // (Issue の state と型が違い、同じ場所で取れないため。yanqirenshi/SOGH.next#68)
    // Pool に入れる前に、state の名前に戻す。(PullRequest の core が、取り方で変わらないように)
    node2pullRequest (node) {
        const pool = this.pool('pull-request');

        node = restorePullRequestState(node);

        this.matchmaker.pullRequest(node);

        return pool.ensure(node, (d)=> new model.PullRequest(d));
    }
    pullRequests (v) {
        return this.pool('pull-request').list();
    }
    pullRequest (v) {
        const pool = this.pool('pull-request');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  Organization・Bot・Mannequin・EnterpriseUserAccount (人)         *
     * **************************************************************** */
    node2organization (node) {
        return this.pool('organization').ensure(node, (d)=> new model.Organization(d));
    }
    organization (v) {
        return this.pool('organization').get(v);
    }
    node2bot (node) {
        return this.pool('bot').ensure(node, (d)=> new model.Bot(d));
    }
    bot (v) {
        return this.pool('bot').get(v);
    }
    node2mannequin (node) {
        return this.pool('mannequin').ensure(node, (d)=> new model.Mannequin(d));
    }
    mannequin (v) {
        return this.pool('mannequin').get(v);
    }
    node2enterpriseUserAccount (node) {
        return this.pool('enterprise-user-account').ensure(node, (d)=> new model.EnterpriseUserAccount(d));
    }
    enterpriseUserAccount (v) {
        return this.pool('enterprise-user-account').get(v);
    }
    /* **************************************************************** *
     *  DraftIssue                                                      *
     * **************************************************************** */
    node2draftIssue (node) {
        return this.pool('draft-issue').ensure(node, (d)=> new model.DraftIssue(d));
    }
    draftIssue (v) {
        return this.pool('draft-issue').get(v);
    }
    /* **************************************************************** *
     *  Team                                                            *
     * **************************************************************** */
    // reviewers の Team は、name と avatarUrl を、別名 teamName・teamAvatarUrl で取っている。
    // (User などと型が違い、同じ場所で取れないため。yanqirenshi/SOGH.next#39)
    // Pool に入れる前に、name・avatarUrl の名前に戻す。
    node2team (node) {
        node = restoreTeamAlias(node);

        return this.pool('team').ensure(node, (d)=> new model.Team(d));
    }
    team (v) {
        return this.pool('team').get(v);
    }
    /* **************************************************************** *
     *  Label                                                           *
     * **************************************************************** */
    node2label (node) {
        return this.pool('label').ensure(node, (d)=> new model.Label(d));
    }
    label (v) {
        return this.pool('label').get(v);
    }
    /* **************************************************************** *
     *  Milestone                                                       *
     * **************************************************************** */
    node2milestone (node) {
        return this.pool('milestone').ensure(node, (d)=> new model.Milestone(d));
    }
    milestone (v) {
        return this.pool('milestone').get(v);
    }
    /* **************************************************************** *
     *  __typename で選ぶ                                               *
     * **************************************************************** */
    // 型が複数ありうる関連 (人・ProjectV2 の owner・ProjectV2Item の content・reviewers) の node を、
    // __typename に合うモデルにして、Pool に入れる。
    // node が無いとき・id が無いとき・知らない型のときは、null を返す。
    node2model (node) {
        if (!node || !node.id)
            return null;

        const name = NODE2MODEL[node.__typename];

        if (!name)
            return null;

        return this[name](node);
    }
}

// __typename と、モデルを作るメソッドの名前。
const NODE2MODEL = {
    User:                  'node2user',
    Organization:          'node2organization',
    Bot:                   'node2bot',
    Mannequin:             'node2mannequin',
    EnterpriseUserAccount: 'node2enterpriseUserAccount',
    Team:                  'node2team',
    Repository:            'node2repository',
    Issue:                 'node2issue',
    IssueComment:          'node2issueComment',
    PullRequest:           'node2pullRequest',
    DraftIssue:            'node2draftIssue',
    ProjectV2:             'node2projectV2',
    ProjectV2Item:         'node2projectV2Item',
    Label:                 'node2label',
    Milestone:             'node2milestone',
};

// 別名 pullRequestState で取った state を、state に戻した node を返す。(元の node は変えない)
// 別名が無いときは、そのまま返す。
function restorePullRequestState (node) {
    if (!node || node.pullRequestState===undefined)
        return node;

    const { pullRequestState, ...rest } = node;

    return { ...rest, state: pullRequestState };
}

// ProjectV2Item の node の content を、state に戻した node を返す。(元の node は変えない)
// content に別名が無いときは、そのまま返す。
function restoreContentPullRequestState (node) {
    if (!node || !node.content || node.content.pullRequestState===undefined)
        return node;

    return { ...node, content: restorePullRequestState(node.content) };
}

// 別名 teamName・teamAvatarUrl で取った値を、name・avatarUrl に戻した node を返す。(元の node は変えない)
// 別名が無いときは、そのまま返す。
function restoreTeamAlias (node) {
    if (!node || (node.teamName===undefined && node.teamAvatarUrl===undefined))
        return node;

    const { teamName, teamAvatarUrl, ...rest } = node;

    if (teamName!==undefined)
        rest.name = teamName;

    if (teamAvatarUrl!==undefined)
        rest.avatarUrl = teamAvatarUrl;

    return rest;
}

// ProjectV2Item の node の fieldValues の中の、reviewers の Team を、name・avatarUrl に戻した node を返す。(元の node は変えない)
// 戻すものが無いときは、そのまま返す。(fieldValues が無い・nodes が配列でない・null が混ざる、も落ちない)
function restoreFieldValuesTeamAlias (node) {
    if (!node || !node.fieldValues || !Array.isArray(node.fieldValues.nodes))
        return node;

    let changed = false;

    const nodes = node.fieldValues.nodes.map(value=> {
        if (!value || !value.reviewers || !Array.isArray(value.reviewers.nodes))
            return value;

        const reviewers = value.reviewers.nodes.map(restoreTeamAlias);

        if (reviewers.every((d, i)=> d===value.reviewers.nodes[i]))
            return value;

        changed = true;

        return { ...value, reviewers: { ...value.reviewers, nodes: reviewers } };
    });

    if (!changed)
        return node;

    return { ...node, fieldValues: { ...node.fieldValues, nodes: nodes } };
}
