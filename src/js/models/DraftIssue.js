import GraphQLNode from './GraphQLNode.js';

// ProjectV2 の中だけにある、下書きの Issue。
// ProjectV2Item の content として来る。

export default class DraftIssue extends GraphQLNode {
    title () {
        return this._core.title || null;
    }
}
