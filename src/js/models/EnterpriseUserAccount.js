import GraphQLNode from './GraphQLNode.js';

// 人のうち、EnterpriseUserAccount。(Enterprise に属するアカウント)
// Actor (author・creator など) として来る。

export default class EnterpriseUserAccount extends GraphQLNode {
    login () {
        return this._core.login || null;
    }
    name () {
        return this._core.name || null;
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
