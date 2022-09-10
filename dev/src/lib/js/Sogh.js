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
        };
    }
    pool (v) {
        return this._pools[v] || null;
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
