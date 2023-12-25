import GraphQLNode from './GraphQLNode.js';

export default class PullRequest extends GraphQLNode {
    url () {
        return this._core.url || null;
    }
}
