import GraphQLNode from './GraphQLNode.js';

export default class Organization extends GraphQLNode {
    // constructor (data) {
    //     super(data);
    // }
    name () {
        return this._core.name || null;
    }
    description () {
        return this._core.description || null;
    }
    descriptionHTML () {
        return this._core.descriptionHTML || null;
    }
    url () {
        return this._core.url || null;
    }
    avatarUrl () {
        return this._core.avatarUrl || null;
    }
}
