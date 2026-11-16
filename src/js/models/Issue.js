import GraphQLNode from './GraphQLNode.js';

export default class Issue extends GraphQLNode {
    constructor (data) {
        super(data);

        this._owner = null;
        this._date_next_action = null;
        this._due_date = null;
        this._points = { plan: null, result: null, results: null };

        if (arguments.length===1)
            this.parseBody(data);

        this.regex = {
            point: {
                plan:    /.*[@|$][P|p]oint\.[P|p]lan:*\s+(\d+).*/,
                result:  /.*[@|$][P|p]oint\.[R|r]esult:*\s+(\d+).*/,
                plans:   /\$[P|p]oint.[P|p]lan:*\s+(\S+)\s+(\d+-\d+-\d+)\s+(\d+)/g,
                results: /\$Point.[R|r]esult:*\s+(\S+)\s+(\d+-\d+-\d+)\s+(\d+)/g,
            },
            date_due:    /.*[@|$]Date\.Due:*\s+(\d+-\d+-\d+).*/,
            due_date:    /.*[@|$]Due\.Date:*\s+(\d+-\d+-\d+).*/,
            next_action: /.*[@|$]Date\.Next:*\s+(\d+-\d+-\d+).*/,
            owner:       /.*\$[O|o]wner:*\s+(\S+).*/,
        };
    }
    core (v) {
        if (arguments.length===1) {
            super.core(v);

            // 再取得などで core が差し替わったら、本文の注釈 ($Point など) を解析し直す。
            if (this._core)
                this.parseBody(this._core);
        }

        return super.core();
    }
    // 日時が同じときも、中身を比べて、違えば重ねる項目。(GraphQLNode の merge(node) を見る)
    // Issue をプロジェクトに足す・外すときや、Item のフィールドの値を変えたとき、
    // Issue の updatedAt は動かないが、projectItems は変わるため。(yanqirenshi/SOGH.next#51)
    sameTimeKeys () {
        return ['projectItems'];
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
    milestone () {
        return this.relation(this._core.milestone);
    }
    // User の配列。
    assignees () {
        return this.relations(this._core.assignees);
    }
    labels () {
        return this.relations(this._core.labels);
    }
    // IssueComment の配列。(件数の上限で切れたときは、取れた分だけ)
    comments () {
        return this.relations(this._core.comments);
    }
    /* ****************************************************************
     *  Owner
     * **************************************************************** */
    // 本文の $Owner の値 (文字列)。無いときは null。
    // (0.5.0 で owner() から名前を変えた。GitHub の Issue には owner が無いので、owner() は無くした。yanqirenshi/SOGH.next#85)
    bodyOwner () {
        return this._owner || null;
    }
    getOwnerFromBody (body) {
        const owner = /.*\$[O|o]wner:*\s+(\S+).*/.exec(body);
        return owner ? owner[1] : null;
    }
    /* ****************************************************************
     *  Auther
     * **************************************************************** */
    // 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)。
    author () {
        return this.relation(this._core.author);
    }
    /* **************************************************************** *
     * Timestamps
     * **************************************************************** */
    closedAt () {
        return this._core.closedAt || null;
    }
    /* **************************************************************** *
     *  Project
     * **************************************************************** */
    // 最初の ProjectV2Item の ProjectV2。(projectV2() と同じ)
    project () {
        return this.projectV2();
    }
    /* **************************************************************** *
     *  Repository
     * **************************************************************** */
    repository () {
        return this.relation(this._core.repository);
    }
    /* **************************************************************** *
     *  Points
     * **************************************************************** */
    points () {
        return this._points || null;
    }
    pointPlansTotal () {
        const points = this.points();

        return points.plan || 0;
    }
    pointResultTotal () {
        const points = this.points();

        if (!points.results)
            return points.result || 0;

        return points.results.total;
    }
    getPointResultsFromBody (body) {
        const rs = /\$Point.[R|r]esult:*\s+(\S+)\s+(\d+-\d+-\d+)\s+(([1-9]\d*|0)(\.\d+)?)/g;
        const regex = new RegExp(rs);

        const result = [...body.matchAll(regex)];

        if (result.length===0)
            return null;

        return result.reduce((ht, d)=>{
            const parson = d[1];
            const date = d[2];
            const point = d[3] *1;

            ht.total += point;
            ht.details.push({parson: parson, date: date, point: point});

            return ht;
        }, { total: 0, details: [] });
    }
    getPointPlansFromBody (body) {
        const rs = /\$[P|p]oint.[P|p]lan:*\s+(\S+)\s+(\d+-\d+-\d+)\s+(([1-9]\d*|0)(\.\d+)?)/g;
        const regex = new RegExp(rs);

        const result = [...body.matchAll(regex)];

        if (result.length===0)
            return null;

        return result.reduce((ht, d)=>{
            const parson = d[1];
            const date = d[2];
            const point = d[3] *1;

            ht.total += point;
            ht.details.push({parson: parson, date: date, point: point});

            return ht;
        }, { total: 0, details: [] });
    }
    getPointFromBody (body) {
        const plan = /.*[@|$][P|p]oint\.[P|p]lan:*\s+(([1-9]\d*|0)(\.\d+)?).*/.exec(body);
        const result = /.*[@|$][P|p]oint\.[R|r]esult:*\s+(([1-9]\d*|0)(\.\d+)?).*/.exec(body);
        const results = this.getPointResultsFromBody(body);

        return {
            plan:   plan ? plan[1] * 1 : null,
            result: result ? result[1] * 1 : null,
            results : results,
        };
    }
    /* **************************************************************** *
     *  Body
     * **************************************************************** */
    body (v) {
        const core = this.core();

        if (arguments.length===0)
            return core.body || null;

        core.body = v || '';

        // 本文が変わったので注釈 ($Point など) を解析し直す。
        this.parseBody(core);

        return core.body;
    }
    bodyHTML () {
        const core = this.core();

        return core.bodyHTML;
    }
    /* **************************************************************** *
     *  Field Values
     * **************************************************************** */
    // 最初の ProjectV2Item の JSON。(モデルは projectV2Item() で引く)
    // projectItems を取得していないときは、null。
    fieldItem () {
        const project_items = this.core().projectItems;

        if (!project_items || !project_items.edges || !project_items.edges[0])
            return null;

        return project_items.edges[0].node;
    }
    // fieldValues を直接読むので、返す値は JSON のまま。(yanqirenshi/SOGH.next#29)
    // Item が無いとき・Item に fieldValues が無いとき・名前の合う値が無いときは、null。(yanqirenshi/SOGH.next#59)
    fieldValueContents (name) {
        const item = this.fieldItem();

        if (!item)
            return null;

        const fieldItem = fieldValuesOf(item).find(n=> n && n.field && name===n.field.name);

        if (!fieldItem)
            return null;

        const getValue = (field_item)=> {
            const type = field_item.field.dataType;

            switch (type) {
            case 'ASSIGNEES':     return { users:      field_item.users };
            case 'REPOSITORY':    return { repository: field_item.repository };
            case 'LABELS':        return { labels:     field_item.labels };
            case 'TITLE':         return { text:       field_item.text };
            case 'SINGLE_SELECT': return { optionId:   field_item.optionId };
            case 'DATE':          return { date:       field_item.date };
            default:
                throw new Error('Not Supported yet. dataType=' + type);
            }
        };

        return {
            project: item.project,
            item:    item,
            field_item:   fieldItem,
            value: getValue(fieldItem),
        };
    }
    // 最初の Item の fieldValues の nodes。(JSON のまま)
    // projectItems を取得していないとき (issue_by_id・issues_by_viewer など)・プロジェクトに入っていないとき・
    // Item に fieldValues が無いときは、空の配列。(yanqirenshi/SOGH.next#59)
    fieldValues () {
        return fieldValuesOf(this.fieldItem());
    }
    // 名前が name のフィールドの値。(JSON のまま) 無いときは null。
    // field の無い値 (null の node など) が混ざっていても、読み飛ばす。
    getFieldValueByName (name) {
        if (!name)
            return null;

        const field_value = this.fieldValues().find(fv=> {
            return fv && fv.field && fv.field.name === name;
        });

        return field_value || null;
    };
    /* **************************************************************** *
     *  Dates
     * **************************************************************** */
    dueDate (v) {
        const field_value = this.getFieldValueByName('Due.Date');

        return field_value ? field_value.date : null;
    }
    nextActionDate (v) {
        const field_value = this.getFieldValueByName('NextAction.Date');

        return field_value ? field_value.date : null;
    }
    getDueDateFromBody (body) {
        const a = /.*[@|$]Date\.Due:*\s+(\d+-\d+-\d+).*/.exec(body);

        if (a) return a[1];

        const b = /.*[@|$]Due\.Date:*\s+(\d+-\d+-\d+).*/.exec(body);

        if (b) return b[1];

        return null;
    };
    getNextActionFromBody (body) {
        const next_action = /.*[@|$]Date\.Next:*\s+(\d+-\d+-\d+).*/.exec(body);
        return next_action ? next_action[1] : null;;
    }
    /* **************************************************************** *
     * 本文の注釈
     * **************************************************************** */
    // 本文の注釈 ($Point・$Date.Due・$Date.Next・$Owner) を読み出して持つ。
    // (0.5.0 で addAnotetionValueNew(issue) から名前を変えた。yanqirenshi/SOGH.next#91)
    parseBody (issue) {
        // body を取得していないノード (ProjectV2Item の content など) もあるので空文字で扱う。
        const body = issue.body || '';

        this._points = this.getPointFromBody(body);
        this._due_date = this.getDueDateFromBody(body);
        this._date_next_action = this.getNextActionFromBody(body);
        this._owner = this.getOwnerFromBody(body);

        return issue;
    }
    /* ****************************************************************
     * ProjectV2
     * **************************************************************** */
    // ProjectV2Item の配列。
    projectV2Items () {
        return this.relations(this.core().projectItems);
    }
    projectV2Item () {
        return this.projectV2Items()[0] || null;
    }
    // ProjectV2 の配列。(ProjectV2Item の project)
    projectsV2 () {
        return this.projectV2Items()
            .map(item=> item.project())
            .filter(project=> project!==null);
    }
    projectV2 () {
        return this.projectsV2()[0] || null;
    }
    /* ****************************************************************
     * Milestone
     * **************************************************************** */
    milestoneId () {
        const m = this.milestone();
        return m ? m.id() : null;
    }
}

// ProjectV2Item の JSON から、fieldValues の nodes を取り出す。
// Item が無いとき・fieldValues が無いとき・nodes が配列でないときは、空の配列。(yanqirenshi/SOGH.next#59)
function fieldValuesOf (item) {
    if (!item || !item.fieldValues || !Array.isArray(item.fieldValues.nodes))
        return [];

    return item.fieldValues.nodes;
}
