import GraphQLNode from './GraphQLNode.js';

// 人のうち、Bot。
// Actor (author・creator など) や、ProjectV2Item の reviewers として来る。

export default class Bot extends GraphQLNode {
    login () {
        return this._core.login || null;
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
