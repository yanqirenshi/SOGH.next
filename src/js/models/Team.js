import GraphQLNode from './GraphQLNode.js';

// Organization の Team。
// ProjectV2Item の reviewers として来る。
// login() は、無い。(Team には、login が無い)

export default class Team extends GraphQLNode {
    slug () {
        return this._core.slug || null;
    }
    // reviewers のクエリでは、別名 teamName で取り、Pool に入れる前に name に戻す。(Pooler の node2team)
    name () {
        return this._core.name || null;
    }
    url () {
        return this._core.url || null;
    }
    // アイコンが無いチームでは、null。
    avatarUrl () {
        return this._core.avatarUrl || null;
    }
}
