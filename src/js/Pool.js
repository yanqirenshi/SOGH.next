export default class Pool {
    constructor (sogh, item_class) {
        this._sogh = sogh;

        this._item_class = item_class;

        this._ht = {};
        this._list = [];
    }
    itemClass () {
        return this._item_class;
    }
    ht () {
        return this._ht;
    }
    list () {
        return this._list;
    }
    add (data) {
        const id = data.id();

        if (this._ht[id])
            return;

        this._ht[id] = data;
        this._list.push(data);
    }
    get (id) {
        return this._ht[id] || null;
    }
    // いま入れようとしている node が、入れ子で来たものかどうか。(Matchmaker が辿っている途中かどうか)
    isNesting () {
        const matchmaker = this._sogh ? this._sogh.matchmaker : null;

        return matchmaker ? matchmaker.isNesting() : false;
    }
    // node のモデルを返す。無ければ作って入れる。
    // 同じ id のモデルがあるときは、core を丸ごと差し替えずに、node を重ねる。
    // (重ね方は、GraphQLNode の merge(node) を見る)
    //
    // 入れ子で来た node で、初めてモデルを作ったときは、reload に日時を入れる。
    // (入れ子の node は項目が少ないので、同じ日時の node があとから来たら、重ねられるようにする。
    //  yanqirenshi/SOGH.next#34)
    ensure (node, makeInstance, updater) {
        let obj = this.get(node.id);

        if (obj) {
            updater ? updater(obj, node) : obj.merge(node);
        } else {
            obj = makeInstance(node);

            this.add(obj);

            if (this.isNesting())
                obj.reload(new Date().toISOString());
        }

        obj.sogh(this._sogh);

        return obj;
    }
}
