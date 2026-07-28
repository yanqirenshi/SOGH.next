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
        return this.issue(id)
            || this.repository(id)
            || this.user(id)
            || this.projectV2(id)
            || this.node2projectV2(id);
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
    node2viewer (d) {
        this._viewer = d ? new model.Viewer(d) : null;

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

        // this.matchmaker.user(node);

        return pool.ensure(
            node,
            (d)=> new item_class(d),
            (obj, node)=> {
                obj.core(node);
            });
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

        // this.matchmaker.user(node);

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

        // this.matchmaker.user(node);

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

        // this.matchmaker.user(node);

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

        // this.matchmaker.user(node);

        return pool.ensure(node, (d)=> new model.PullRequest(d));
    }
    pullRequests (v) {
        return this.pool('pull-request').list();
    }
    pullRequest (v) {
        const pool = this.pool('pull-request');

        return pool.get(v);
    }
}
