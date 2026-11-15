import GraphQLNode from './GraphQLNode.js';

// 人のうち、Mannequin。(ほかのサービスから移したときに作られる、仮の人)
// Actor (author・creator など) や、ProjectV2Item の reviewers として来る。

export default class Mannequin extends GraphQLNode {
    login () {
        return this._core.login || null;
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
