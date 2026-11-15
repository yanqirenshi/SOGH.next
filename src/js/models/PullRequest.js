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
    // User の配列。core に assignees が無いときは、空の配列。
    // (いまは、どのクエリも PullRequest の assignees を取っていない)
    assignees () {
        return this.relations(this._core.assignees);
    }
}
