import GraphQLNode from './GraphQLNode.js';
import Term from './Term.js';

export default class ProjectV2 extends GraphQLNode {
    constructor (data) {
        super(data);

        this.initReadmeAttributes();

        this.initRegexs();
        this.parseReadme();
    }
    initReadmeAttributes () {
        this._priority = '?';
        this._owner = '?';
        this._type = '?';
        this._release = '?';
        this._plan = new Term();
        this._result = new Term();
    }
    initRegexs () {
        // const value = '(\S)';
        // const date = '(\d+-\d+-\d+)';

        this._regexs = {
            priority: /.*\$[P|p]riority:\s+(\S).*/,
            owner: /.*\$[O|o]wner:\s+(\S+).*/,
            type: /.*\$[T|t]ype:\s+(\S+).*/,
            release: /.*\$[R|r]elease:\s+(\S+).*/,
            plan: /.*\$[P|p]lan:\s+(\d+-\d+-\d+)\s+(\d+-\d+-\d+).*/,
            result: /.*\$[R|r]esult:\s+(\d+-\d+-\d+)\s+(\d+-\d+-\d+).*/,
            // cost: /.*\$[C|c]ost:\s+(\S+).*/,
            // scope: /.*\$[S|s]cope:\s+(\S+).*/,
            // estimate: /.*\$[E|c]stimate:\s+(\S+).*/,
            // estimate_detail: /.*\$[E|e]stimate.Detail:\s+(\S+).*/,
            // estimate_description: /.*\$[E|e]stimate.Description:\s+(\S+).*/,
            // purchase: /.*\$[P|p]urchase:\s+(\S+).*/,
            // phase: /.*\$[P|p]hase:\s+(\S+).*/,
        };
    }
    parseReadme () {
        const regexs = this._regexs;
        const readme = this.readme();

        for (const k in regexs) {
            const regex = regexs[k];
            const ret = regex.exec(readme);

            if (!ret) continue;

            const val = ret[1];

            switch (k) {
            case 'priority': this.priority(val);          break;
            case 'owner':    this.owner(val);             break;
            case 'type':     this.type(val);              break;
            case 'release':  this.release(val);           break;
            case 'plan':     this.plan(ret[1], ret[2]);   break;
            case 'result':   this.result(ret[1], ret[2]); break;
            default: throw new Error(`Not found key. key=${k}`);
            }

        }
    }
    number () {
        return this._core.number || null;
    }
    title () {
        return this._core.title || null;
    }
    url () {
        return this._core.url || null;
    }
    fields () {
        return this._core.fields.nodes || [];
    }
    shortDescription () {
        return this._core.shortDescription;
    }
    readme () {
        return this._core.readme;
    }
    public () {
        return this._core.public;
    }
    owner (v) {
        if (arguments.length===1)
            this._owner = v;

        return this._owner;
    }
    creator () {
        return this._core.creator;
    }
    items () {
        const data = this.core().items;

        if (!data)
            return [];

        const nodes = data.edges.map(edge=> edge.node);

        return nodes;
    }
    itemsWith2ProjectV2Item () {
        const sogh = this.sogh();

        if (!sogh)
            return [];

        return this.items().map(d=> sogh.node2projectV2Item(d));
    }
    /////
    ///// README Attributes
    /////
    priority (v) {
        if (arguments.length===1)
            this._priority = v;

        return this._priority;
    }
    maneger (v) {
        if (arguments.length===1)
            this._owner = v;

        return this._owner;
    }
    type (v) {
        if (arguments.length===1)
            this._type = v;

        return this._type;
    }
    release (v) {
        if (arguments.length===1)
            this._release = v;

        return this._release;
    }
    plan (start, end) {
        if (arguments.length===2)
            this._plan = new Term(start, end);

        return this._plan;
    }
    result (start, end) {
        if (arguments.length===2)
            this._result = new Term(start, end);

        return this._result;
    }
}
