export default class GraphQLNode {
    constructor (data) {
        this._core = data;
        this._sogh = null;
        this._reload = null;
    }
    sogh (v) {
        if (arguments.length===1)
            this._sogh = v || null;

        return this._sogh;
    }
    core (v) {
        if (arguments.length===1)
            this._core = v || null;

        return this._core;
    }
    id () {
        return this._core.id || null;
    }
    // 型の名前。(core の __typename。例: "User"・"Bot"・"Issue")
    // 型が複数ある関連 (issue.author()・item.content() など) が返したモデルを、見分けるのに使う。
    // core に __typename が無いときは null。(クラスの名前からは、推し量らない)
    typename () {
        return this._core.__typename || null;
    }
    createdAt () {
        return this._core.createdAt || null;
    }
    updatedAt () {
        return this._core.updatedAt || null;
    }
    /* **************************************************************** *
     *  関連
     * **************************************************************** */
    // core に入れ子で残っている関連の JSON から、Pool にあるモデルを引く。
    // (入れ子の node は、Matchmaker が先に Pool に入れている)
    // JSON が無いとき・id が無いとき・Pool に無いときは、null。
    relation (node) {
        if (!node || !node.id)
            return null;

        const sogh = this.sogh();

        if (!sogh)
            return null;

        return sogh.get(node.id);
    }
    // 複数の関連。{ nodes: [...] } と { edges: [{ node }] } の、どちらの形でもよい。
    // Pool に無いものは、外す。
    relations (connection) {
        return nodesOf(connection)
            .map(node=> this.relation(node))
            .filter(obj=> obj!==null);
    }
    /* **************************************************************** *
     *  Merge
     * **************************************************************** */
    // 「同じ日時の node が来たら、重ねてよい」という印。(ISO 8601 の文字列。印が無ければ null)
    // 次の 2 つのときに、そのときの日時を入れる。
    //   1. merge(node) が、手元より新しい node を重ねたとき。(GitHub 側の変更を重ねた)
    //   2. 入れ子で来た node で、初めてモデルを作ったとき。(Pool の ensure が入れる)
    // どちらも、手元の core が、項目の少ない node からできているかもしれない場合。
    // (yanqirenshi/SOGH.next#34)
    reload (v) {
        if (arguments.length===1)
            this._reload = v || null;

        return this._reload;
    }
    // 日時が同じときも、中身を比べて、違えば重ねる項目の名前。(モデルごとに、上書きして指定する)
    // 関連が変わっても、親の updatedAt が動かない項目のため。(yanqirenshi/SOGH.next#51)
    // いまは、Issue の projectItems だけ。(Issue をプロジェクトに足す・外すとき、Issue の updatedAt が動かない)
    sameTimeKeys () {
        return [];
    }
    // 同じ id の node を、いまの core に重ねる。
    // core を丸ごと差し替えずに、来た項目だけを重ねる。
    // (入れ子で取った node は項目が少ないので、差し替えると、いまある値が消えるため)
    //
    // 重ねるかどうかは、最終更新日時 (updatedAt) を、いまの core と node で比べて決める。
    //
    //   来たほうが新しい              … 来た項目を重ねる。reload に、いまの日時を入れる。  ⇒ 'newer'
    //   日時が同じで、reload がある   … 来た項目を重ねる。reload は変えない。              ⇒ 'same'
    //   日時が同じで、reload が無い   … 手元に無い項目だけ足す。                          ⇒ 'filled' (足した) / 'kept' (何もしなかった)
    //                                    ただし sameTimeKeys() の項目は、中身が違えば重ねる。 ⇒ 'refreshed'
    //   来たほうが古い                … 手元に無い項目だけ足す。                          ⇒ 'filled' (足した) / 'kept' (何もしなかった)
    //   どちらかに updatedAt が無い   … 毎回、来た項目を重ねる。reload は入れない。        ⇒ 'always'
    //
    // sameTimeKeys() の項目 (Issue の projectItems) は、関連が変わっても、親の updatedAt が動かない。
    // そのため、日時が同じでも、来た値と手元の値の中身 (JSON) を比べて、違えば、来た値で重ねる。(yanqirenshi/SOGH.next#51)
    // 中身が同じときは、重ねない。(変更の無い取り直しで、core を作り直さないため)
    // 'refreshed' は、手元にある項目を、日時が同じなのに上書きしたことを表す。('filled' は、手元に無い項目を足しただけ)
    //
    // 「日時が同じで、reload がある」ときに重ねるのは、手元の core が、項目の少ない node で
    // 先に updatedAt だけ進んでいるかもしれないため。(yanqirenshi/SOGH.next#34)
    // たとえば、Item の content として来た Issue (本文が無い) が、先に updatedAt を進めたあとで、
    // 同じ日時の、本文つきの Issue が来る場合。
    //
    // 重ねる単位は、一番上の項目。(title・assignees など。入れ子の中身までは重ねない)
    // 来た値が null の項目は、null で重ねる。来ていない項目 (undefined) は、触らない。
    //
    // core を変えるときは、core(v) を通す。(Issue・ProjectV2 が、core(v) で注釈を読み取り直すため)
    merge (node) {
        if (!node)
            return 'kept';

        const core = this._core;

        // 手元に core が無いときは、比べるものが無いので、そのまま入れる。
        if (!core) {
            this.core(node);

            return 'always';
        }

        const held = timeOf(core.updatedAt);
        const came = timeOf(node.updatedAt);

        const comparable = held!==null && came!==null;
        const newer = comparable && came > held;
        // 日時が同じで、reload が入っている。
        const same = comparable && came === held && this._reload!==null;

        // 来た項目を、そのまま重ねてよいか。
        const overlay = !comparable || newer || same;

        // 日時が同じ (reload は無い)。sameTimeKeys() の項目だけ、中身を比べる。
        const same_time = comparable && came === held && !same;
        const same_time_keys = same_time ? this.sameTimeKeys() : [];

        // 日時が同じなのに、中身が違うので重ねる項目。
        const refreshed = [];

        // 重ねる項目。
        const keys = Object.keys(node).filter(key=> {
            // 来ていない項目は、触らない。
            if (node[key]===undefined)
                return false;

            if (overlay)
                return true;

            // 重ねてよくないときは、手元に無い項目だけ。
            if (core[key]===undefined)
                return true;

            // ただし、日時が同じときの sameTimeKeys() の項目は、中身が違えば重ねる。
            if (same_time_keys.includes(key) && stableJson(core[key])!==stableJson(node[key])) {
                refreshed.push(key);
                return true;
            }

            return false;
        });

        if (keys.length===0)
            return 'kept';

        const merged = { ...core };

        for (const key of keys)
            merged[key] = node[key];

        this.core(merged);

        if (newer)
            this._reload = new Date().toISOString();

        if (!comparable) return 'always';
        if (newer) return 'newer';
        if (same) return 'same';

        return refreshed.length > 0 ? 'refreshed' : 'filled';
    }
}

// 関連の JSON から、node の配列を取り出す。
// { nodes: [...] } と { edges: [{ node }] } の、どちらの形でもよい。
export function nodesOf (connection) {
    if (!connection)
        return [];

    if (Array.isArray(connection))
        return connection;

    if (Array.isArray(connection.nodes))
        return connection.nodes;

    if (Array.isArray(connection.edges))
        return connection.edges.map(edge=> edge ? edge.node : null);

    return [];
}

// 中身を比べるための JSON の文字列。(オブジェクトの項目の順番は、そろえる)
// 同じ中身なら、項目を取った順番が違っても (クエリが違っても)、同じ文字列になる。
function stableJson (value) {
    return JSON.stringify(value, (key, v)=> {
        if (!v || typeof v!=='object' || Array.isArray(v))
            return v;

        return Object.keys(v).sort().reduce((out, k)=> {
            out[k] = v[k];
            return out;
        }, {});
    });
}

// 日時の文字列 (ISO 8601) を、比べられる数値にする。読めないときは null。
function timeOf (v) {
    if (!v)
        return null;

    const time = Date.parse(v);

    return Number.isNaN(time) ? null : time;
}
