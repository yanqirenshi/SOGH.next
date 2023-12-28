import GraphQLNode from './GraphQLNode.js';

export default class PullRequest extends GraphQLNode {
    title () {
        return this._core.title || null;
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
    repository () {
        return this._core.repository || null;
    }
    author () {
        return this._core.author || null;
    }
    assignees () {
        const edges = this._core.assignees.edges;
        return edges.map(e=>e.node);
    }
}
