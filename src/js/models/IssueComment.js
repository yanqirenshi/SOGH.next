import GraphQLNode from './GraphQLNode.js';

export default class IssueComment extends GraphQLNode {
    // constructor (data) {
    //     super(data);
    // }
    body () {
        return this._core.body || null;
    }
    bodyHTML () {
        return this._core.bodyHTML || null;
    }
    url () {
        return this._core.url || null;
    }
    publishedAt () {
        return this._core.publishedAt || null;
    }
    // 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)。
    author () {
        return this.relation(this._core.author);
    }
    // 人。編集していないときは null。
    editor () {
        return this.relation(this._core.editor);
    }
    pullRequest () {
        return this.relation(this._core.pullRequest);
    }
}
