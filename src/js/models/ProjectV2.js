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
    core (v) {
        if (arguments.length===1) {
            super.core(v);

            // 再取得などで core が差し替わったら、README の属性を解析し直す。
            if (this._core) {
                this.initReadmeAttributes();
                this.parseReadme();
            }
        }

        return super.core();
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
    // README の属性を読み出す。
    // README に書いていない属性は、initReadmeAttributes() の初めの値のまま残す。(null で上書きしない。yanqirenshi/SOGH.next#90)
    // plan・result は、parseReadmeItemPlan・parseReadmeItemResult が決める。(前と同じ)
    parseReadme () {
        const regexs = this._regexs;
        const readme = this.readme();

        // 書いてあったときだけ、値を入れる。
        const set = (setter, regex)=> {
            const v = this.parseReadmeItem(readme, regex);

            if (v!==null)
                setter.call(this, v);
        };

        for (const k in regexs) {

            const regex = regexs[k];

            if (!regex) continue;

            switch (k) {
            case 'priority': set(this.priority, regex);                        break;
            case 'owner':    set(this.readmeOwner, regex);                     break;
            case 'type':     set(this.type, regex);                            break;
            case 'release':  set(this.release, regex);                         break;
            case 'plan':     this.parseReadmeItemPlan (readme, regex);         break;
            case 'result':   this.parseReadmeItemResult(readme, regex);        break;
            case 'action':   set(this.action, regex);                          break;
            case 'backlog':  set(this.backlog, regex);                         break;

            case 'customer': set(this.customer, regex);                        break;
            case 'agency':   set(this.agency, regex);                          break;
            case 'systems':  set(this.systems, regex);                         break;
            case 'scenario': set(this.scenario, regex);                        break;
            case 'progress': set(this.progress, regex);                        break;

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
    // GitHub の owner のモデル。User・Organization・Issue・PullRequest のどれか。(取得していないときは null)
    // Repository の owner() と同じ意味。(0.5.0 から。それまでは README の $Owner の値を返していた。yanqirenshi/SOGH.next#71)
    owner () {
        return this.relation(this._core.owner);
    }
    // README の $Owner の値 (文字列)。README に $Owner が無いときは '?'。(0.5.0 で owner() から名前を変えた。yanqirenshi/SOGH.next#71)
    readmeOwner (v) {
        if (arguments.length===1)
            this._owner = v;

        return this._owner;
    }
    // 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)。
    creator () {
        return this.relation(this._core.creator);
    }
    // ProjectV2Item の配列。(件数の上限で切れたときは、取れた分だけ)
    items () {
        return this.relations(this.core().items);
    }
    // Pool にある、この ProjectV2 の ProjectV2Item の配列。(yanqirenshi/SOGH.next#102)
    //   1. items() (ProjectV2 の中身に入っている Item) を、その順に。
    //   2. 別に取って Pool に入った Item (core の project の id が、この ProjectV2 のもの) を、Pool に入った順に。
    // 同じ Item は、1 回だけ。取得はしない。(取得するのは、利用側)
    // sogh が入っていないとき (Pool を引けないとき) は、items() と同じ。(関連も引けないので、[])
    itemsInPool () {
        const out = this.items();

        const sogh = this.sogh();
        const pool = sogh && typeof sogh.pool === 'function' ? sogh.pool('project-v2-item') : null;

        if (!pool)
            return out;

        const ids = new Set(out.map(item=> item.id()));
        const project_id = this.id();

        for (const item of pool.list()) {
            const core = item.core();
            const project = core ? core.project : null;

            if (!project || project.id !== project_id || ids.has(item.id()))
                continue;

            ids.add(item.id());
            out.push(item);
        }

        return out;
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
