import GraphQLNode from './GraphQLNode.js';

export default class PullRequest extends GraphQLNode {
    title () {
        return this._core.number || null;
    }
    number () {
        return this._core.number || null;
    }
    url () {
        return this._core.url || null;
    }
    body () {
        return this._core.body || '';
    }
    bodyHTML () {
        return this._core.bodyHTML || '';
    }
    author () {
        return this._core.number || null;
    }
    assignees () {
        const edges = this._core.assignees.edges;
        return edges.map(e=>e.node);
    }
}
