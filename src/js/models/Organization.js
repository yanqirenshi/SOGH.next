import GraphQLNode from './GraphQLNode.js';

// 人のうち、Organization。
// Repository の owner、ProjectV2 の owner、Actor (author・creator など) として来る。

export default class Organization extends GraphQLNode {
    login () {
        return this._core.login || null;
    }
    name () {
        return this._core.name || null;
    }
    email () {
        return this._core.email || null;
    }
    url () {
        return this._core.url || null;
    }
    avatarUrl () {
        return this._core.avatarUrl || null;
    }
    resourcePath () {
        return this._core.resourcePath || null;
    }
}
