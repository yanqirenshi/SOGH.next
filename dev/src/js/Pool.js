export default class Pool {
    constructor () {
        this.id = (d)=> d ? d.id() : null;
    }
    list2Pool (list) {
        const reducer = (ht,d)=> {
            ht[this.id(d)] = d;
            return ht;
        };

        return {
            ht: list.reduce(reducer,{}),
            list: list,
        };
    }
    addPool (data, pool) {
        const id = this.id(data);

        if (pool.ht[id])
            return;

        pool.ht[id] = data;
        pool.list.push(data);
    }
}
