import GraphQLNode from './GraphQLNode.js';
import Term from './Term.js';

const priorities = {
    's': { code: 's', label: '緊急', label_short: '緊', },
    'h': { code: 'h', label: '高い', label_short: '高', },
    'n': { code: 'n', label: '普通', label_short: '普', },
    'l': { code: 'l', label: '低い', label_short: '低', },
    '?': { code: '?', label: 'なぞ', label_short: '謎', },
};

export default class ProjectV2 extends GraphQLNode {
    constructor (data) {
        super(data);

        this.initReadmeAttributes();

        this.initRegexs();
        this.parseReadme();

        this._priorities = priorities;
    }
    initReadmeAttributes () {
        this._priority = '?';
        this._owner = '?';
        this._type = '?';
        this._release = '?';
        this._plan = new Term();
        this._result = new Term();
        this._action = '';
        this._backlog = '';

        // TODO:
        this._systems = [];
        this._customer  = '';
        this._agency  = '';
        this._scenario = '';
        this._progress = '';
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
            result: [
                /.*\$[R|r]esult:\s+(\d+-\d+-\d+)\s+(\d+-\d+-\d+).*/,
                /.*\$[R|r]esult:\s+(\d+-\d+-\d+).*/,
            ],
            action: /.*\$[A|a]ction:\s+(\S+).*/,
            backlog: /.*\$[B|b]acklog:\s+(\S+).*/,
            // cost: /.*\$[C|c]ost:\s+(\S+).*/,
            // scope: /.*\$[S|s]cope:\s+(\S+).*/,
            // estimate: /.*\$[E|c]stimate:\s+(\S+).*/,
            // estimate_detail: /.*\$[E|e]stimate.Detail:\s+(\S+).*/,
            // estimate_description: /.*\$[E|e]stimate.Description:\s+(\S+).*/,
            // purchase: /.*\$[P|p]urchase:\s+(\S+).*/,
            // phase: /.*\$[P|p]hase:\s+(\S+).*/,
            customer: /.*\$[C|c]ustomer:\s+(\S+).*/,
            agency: /.*\$[A|a]gency:\s+(\S+).*/,
            systems: /.*\$[S|s]ystems:\s+(\S+).*/,
            scenario: /.*\$[S|s]cenario:\s+(\S+).*/,
            progress: /.*\$[P|p]rogress:\s+(\d+).*/,
        };
    }
    parseReadmeItem (readme, regex) {
        const ret = regex.exec(readme);

        return ret ? ret[1] : null;
    }
    parseReadmeItemPlan (readme, regex) {
        const ret = regex.exec(readme);

        if (!ret)
            return;

        this.plan(ret[1], ret[2]);
    }
    parseReadmeItemResult (readme, regexs) {
        for (const regex of regexs) {
            const ret = regex.exec(readme);

            if (!ret) continue;

            return this.result(ret[1], ret[2]);
        }

        return this.result(null, null);
    }
    parseReadme () {
        const regexs = this._regexs;
        const readme = this.readme();

        for (const k in regexs) {

            const regex = regexs[k];

            if (!regex) continue;

            switch (k) {
            case 'priority': this.priority(this.parseReadmeItem(readme, regex)); break;
            case 'owner':    this.owner(this.parseReadmeItem(readme, regex));    break;
            case 'type':     this.type(this.parseReadmeItem(readme, regex));     break;
            case 'release':  this.release(this.parseReadmeItem(readme, regex));  break;
            case 'plan':     this.parseReadmeItemPlan (readme, regex);           break;
            case 'result':   this.parseReadmeItemResult(readme, regex);          break;
            case 'action':   this.action(this.parseReadmeItem(readme, regex));   break;
            case 'backlog':  this.backlog(this.parseReadmeItem(readme, regex));  break;

            case 'customer': this.customer(this.parseReadmeItem(readme, regex)); break;
            case 'agency':   this.agency(this.parseReadmeItem(readme, regex));   break;
            case 'systems':  this.systems(this.parseReadmeItem(readme, regex));  break;
            case 'scenario': this.scenario(this.parseReadmeItem(readme, regex)); break;
            case 'progress': this.progress(this.parseReadmeItem(readme, regex)); break;

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
    priorityData () {
        const v = this.priority();

        const table = this._priorities;

        return table[v] || {
            code: v,
            label: 'なぞ',
            label_short: '謎',
        };
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
    action (v) {
        if (arguments.length===1)
            this._action = v;

        return this._action;
    }
    backlog (v) {
        if (arguments.length===1)
            this._backlog = v;

        return this._backlog;
    }
    systems (v) {
        if (arguments.length===1)
            this._systems = v;

        return this._systems;
    }
    agency (v) {
        if (arguments.length===1)
            this._agency = v;

        return this._agency;
    }
    customer (v) {
        if (arguments.length===1)
            this._customer = v;

        return this._customer;
    }
    scenario (v) {
        if (arguments.length===1)
            this._scenario = v;

        return this._scenario;
    }
    progress (v) {
        if (arguments.length===1)
            this._progress = v;

        return this._progress;
    }
}
