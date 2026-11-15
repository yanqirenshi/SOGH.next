import GraphQLNode from './GraphQLNode.js';

// Organization の Team。
// ProjectV2Item の reviewers として来る。

export default class Team extends GraphQLNode {
    slug () {
        return this._core.slug || null;
    }
}
