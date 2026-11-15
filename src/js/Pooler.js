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
    node2projectV2Item (node) {
        const pool = this.pool('project-v2-item');

        this.matchmaker.projectV2Item(node);

        const obj = pool.ensure(node, (d)=> new model.ProjectV2Item(d));

        obj.sogh(this);

        return obj;
    }
    projectV2Item (v) {
        const pool = this.pool('project-v2-item');

        return pool.get(v);
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
    node2pullRequest (node) {
        const pool = this.pool('pull-request');

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
    node2team (node) {
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
