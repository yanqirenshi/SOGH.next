export default class Pool {
    constructor (sogh) {
        this._sogh = sogh;

        this._ht = {};
        this._list = [];
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
    ensure (node, makeInstance) {
        let obj = this.get(node.id);

        if (obj) {
            obj.core(node);
        } else {
            obj = makeInstance(node);
            this.add(obj);
        }

        obj.sogh(this._sogh);

        return obj;
    }
}
