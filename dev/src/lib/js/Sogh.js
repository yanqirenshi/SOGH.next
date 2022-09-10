import Loader from './Loader.js';

import * as model from './models/index.js';

import Pool from './Pool.js';

export default class Sogh extends Loader {
    constructor () {
        super();

        this._pools = {
            repository: new Pool(),
        };
    }
    pool (v) {
        return this._pools[v] || null;
    }
    node2repository (node) {
        const pool = this.pool('repository');

        return pool.ensure(node, (d)=> new model.Repository(d));
    }
    repository (v) {
        const pool = this.pool('repository');

        return pool.get(v);
    }
}
