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
    ensure (node, makeInstance, updater) {
        let obj = this.get(node.id);

        if (obj) {
            updater ? updater(obj, node) : obj.core(node);
        } else {
            obj = makeInstance(node);

            this.add(obj);
        }

        obj.sogh(this._sogh);

        return obj;
    }
}
