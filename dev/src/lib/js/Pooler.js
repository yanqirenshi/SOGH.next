import Loader from './Loader.js';

import * as model from './models/index.js';

import Pool from './Pool.js';
import Matchmaker from './Matchmaker.js';

export default class Pooler extends Loader {
    constructor () {
        super();

        this.matchmaker = new Matchmaker(this);

        this._pools = [
            'repository',
            'user',
            'project-next',
            'project-next-item',
            'issue',
            'issue-comment',
        ].reduce((ht, key)=> {
            ht[key] = new Pool();
            return ht;
        }, {});

    }
    pool (v) {
        return this._pools[v] || null;
    }
    get (id) {
        return this.repository(id)
            || this.user(id)
            || this.projectNext(id)
            || this.node2projectNextItem(id);
    }
    /* **************************************************************** *
     *  Repository                                                      *
     * **************************************************************** */
    node2repository (node) {
        const pool = this.pool('repository');

        this.matchmaker.repository(node);

        return pool.ensure(node, (d)=> new model.Repository(d));
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
     *  ProjectNext                                                     *
     * **************************************************************** */
    node2projectNext (node) {
        const pool = this.pool('project-next');

        // this.matchmaker.user(node);

        return pool.ensure(node, (d)=> new model.ProjectNext(d));
    }
    projectNext (v) {
        const pool = this.pool('project-next');

        return pool.get(v);
    }
    /* **************************************************************** *
     *  ProjectNext Item                                                *
     * **************************************************************** */
    node2projectNextItem (node) {
        const pool = this.pool('project-next-item');

        // this.matchmaker.user(node);

        return pool.ensure(node, (d)=> new model.ProjectNextItem(d));
    }
    projectNextItem (v) {
        const pool = this.pool('project-next-item');

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
}
