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
    // Repository。無いときは null。
    // (いまは、どのクエリも PullRequest の repository を取っていない)
    repository () {
        return this.relation(this._core.repository);
    }
    // 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)。無いときは null。
    // (いまは、どのクエリも PullRequest の author を取っていない)
    author () {
        return this.relation(this._core.author);
    }
    // User の配列。core に assignees が無いときは、空の配列。
    // (いまは、どのクエリも PullRequest の assignees を取っていない)
    assignees () {
        return this.relations(this._core.assignees);
    }
}
