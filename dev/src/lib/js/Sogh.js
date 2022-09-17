import Loader from './Loader.js';

import * as model from './models/index.js';

import Pool from './Pool.js';

export default class Sogh extends Loader {
    constructor () {
        super();

        this.matchmaker = new Matchmaker(this);

        this._pools = {
            repository: new Pool(),
            user: new Pool(),
            projectnext: new Pool(),
        };
    }
    pool (v) {
        return this._pools[v] || null;
    }
    get (id) {
        return this.repository(id)
            || this.user(id)
            || this.projectNext(id);
    }
    href (obj, to, data) {
        const x = {
            'project-next': '/projects-next/:id'
        };

        const base = x[to];
        const keys = Object.keys(data);

        return keys.reduce((str, key)=> {
            let out = str;

            if (key==='id') out = str.replaceAll(':id', obj.id());

            return out;
        }, base);
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
        const pool = this.pool('projectnext');

        this.matchmaker.user(node);

        return pool.ensure(node, (d)=> new model.ProjectNext(d));
    }
    projectNext (v) {
        const pool = this.pool('projectnext');

        return pool.get(v);
    }
}

class Matchmaker {
    constructor (sogh) {
        this.sogh = sogh;
    }
    repository (node) {
        if (node.owner)
            this.sogh.node2user(node.owner);
    }
    user (node) {
    }
}
