export default class GraphQLNode {
    constructor (data) {
        this._core = data;
        this._sogh = null;
    }
    sogh (v) {
        if (arguments.length===1)
            this._sogh = v || null;

        return this._sogh;
    }
    core () {
        return this._core;
    }
    id () {
        return this._core.id || null;
    }
    createdAt () {
        return this._core.createdAt || null;
    }
    updatedAt () {
        return this._core.updatedAt || null;
    }
}
