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
    createdAt () {
        return this._core.createdAt || null;
    }
    updatedAt () {
        return this._core.updatedAt || null;
    }
    /* **************************************************************** *
     *  Merge
     * **************************************************************** */
    // GitHub 側の変更を重ねた日時。(ISO 8601 の文字列)
    // merge(node) が、手元より新しい node を重ねたときに入れる。重ねたことが無ければ null。
    reload (v) {
        if (arguments.length===1)
            this._reload = v || null;

        return this._reload;
    }
    // 同じ id の node を、いまの core に重ねる。
    // core を丸ごと差し替えずに、来た項目だけを重ねる。
    // (入れ子で取った node は項目が少ないので、差し替えると、いまある値が消えるため)
    //
    // 重ねるかどうかは、最終更新日時 (updatedAt) を、いまの core と node で比べて決める。
    //
    //   来たほうが新しい            … 来た項目を重ねる。reload に、いまの日時を入れる。  ⇒ 'newer'
    //   日時が同じ・来たほうが古い  … 手元に無い項目だけ足す。                          ⇒ 'filled' (足した) / 'kept' (何もしなかった)
    //   どちらかに updatedAt が無い … 毎回、来た項目を重ねる。reload は入れない。        ⇒ 'always'
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

        // 重ねる項目。
        const keys = Object.keys(node).filter(key=> {
            // 来ていない項目は、触らない。
            if (node[key]===undefined)
                return false;

            // 日時を比べられて、来たほうが新しくないときは、手元に無い項目だけ。
            if (comparable && !newer)
                return core[key]===undefined;

            return true;
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

        return newer ? 'newer' : 'filled';
    }
}

// 日時の文字列 (ISO 8601) を、比べられる数値にする。読めないときは null。
function timeOf (v) {
    if (!v)
        return null;

    const time = Date.parse(v);

    return Number.isNaN(time) ? null : time;
}
