import GraphQLNode from './GraphQLNode.js';

export default class ProjectNextItem extends GraphQLNode {
    // constructor (data) { super(data); }
    title () {
        return this._core.title || null;
    }
    isArchived () {
        return this._core.isArchived || null;
    }
    type () {
        return this._core.type || null;
    }
}
