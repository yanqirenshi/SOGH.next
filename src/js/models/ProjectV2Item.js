import GraphQLNode from './GraphQLNode.js';
import { fieldValueOf, fieldValuesOf } from './fieldValue.js';

export default class ProjectV2Item extends GraphQLNode {
    // constructor (data) { super(data); }
    // 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)。
    creator () {
        return this.relation(this._core.creator);
    }
    path () {
        return this.sogh().href('project-v2-items', this);
    }
    // fieldValues そのものはモデルにしないので、箱は JSON のまま返す。(yanqirenshi/SOGH.next#29)
    // 箱の中の関連のモデルは、assignees()・labels() などで引く。
    // fieldValues が無いとき・nodes が配列でないときは、空の配列。(Issue と同じ守り。yanqirenshi/SOGH.next#103)
    fieldValues () {
        return fieldValuesOf(this._core);
    }
    // null と、field の無いものは、飛ばす。(yanqirenshi/SOGH.next#103)
    getFieldValueByName(name) {
        const field_value = this.fieldValues().find(fv=> {
            return fv && fv.field && fv.field.name === name;
        });

        if (!field_value)
            return null;

        return field_value;
    }
    // ProjectV2。
    project () {
        return this.relation(this._core.project);
    }
    projectNumber () {
        return this._core.project.number;
    }
    projectOwnerLogin () {
        return this._core.project.owner.login;
    }
    projectPath () {
        const sogh = this.sogh();

        // href は、project の JSON (owner.login と number) を読む。
        return sogh.href('project-v2-data', this._core.project);
    }
    type () {
        return this._core.type || null;
    }
    isArchived () {
        // GitHub 標準のアーカイブ状態 (ProjectV2Item.isArchived)
        return this._core.isArchived===true;
    }
    archived () {
        // 'Archived' という名前の日付フィールド (ユーザー定義) の値。
        // GitHub 標準のアーカイブ状態は isArchived() を使う。
        const field_value = this.getFieldValueByName('Archived');
        return field_value ? field_value.date : null;
    }
    title () {
        const field_value = this.getFieldValueByName('Title');

        return field_value ? field_value.text : null;
    }
    status () {
        const field_value = this.getFieldValueByName('Status');

        return field_value ? field_value.name : null;
    }
    // User の配列。
    assignees () {
        const field_value = this.getFieldValueByName('Assignees');

        return field_value ? this.relations(field_value.users) : [];
    }
    labels () {
        const field_value = this.getFieldValueByName('Labels');

        return field_value ? this.relations(field_value.labels) : [];
    }
    // PullRequest の配列。
    linkedPullRequests () {
        const field_value = this.getFieldValueByName('Linked pull requests');

        return field_value ? this.relations(field_value.pullRequests) : [];
    }
    // User・Team・Mannequin・Bot の配列。
    reviewers () {
        const field_value = this.getFieldValueByName('Reviewers');

        return field_value ? this.relations(field_value.reviewers) : [];
    }
    repository () {
        const field_value = this.getFieldValueByName('Repository');

        return field_value ? this.relation(field_value.repository) : null;
    }
    milestone () {
        const field_value = this.getFieldValueByName('Milestone');
        return field_value ? this.relation(field_value.milestone) : null;
    }
    // Issue・PullRequest・DraftIssue のどれか。
    content () {
        return this.relation(this.core().content);
    }
    contentTypename () {
        const content = this.core().content;

        return content ? content.__typename : null;
    }
    /* ****************************************************************
     *  Plan
     * ****************************************************************/
    planStart () {
        const value = this.getFieldValueByName('Plan.Start');
        return value ? value.date : null;
    }
    planEnd () {
        const value = this.getFieldValueByName('Plan.End');
        return value ? value.date : null;
    }
    planTerm () {
        const start = this.planStart();
        const end   = this.planEnd();

        if ((!start || !end) || start>end)
            return null;

        return { start: start, end: end };
    }
    planPoints () {
        const field_value = this.getFieldValueByName('Plan.Points');
        return field_value ? field_value.text : null;
    }
    planPointsSummary () {
        const points = this.planPoints();

        let total = 0;

        if (!points)
            return total;

        const summary = points
              .split(',')
              .reduce((total, line)=> {
                  const row = line.trim().split(':');
                  if (row.length!==2)
                      return total;

                  const point = row[1] * 1;

                  total += point;

                  return total;
              }, total);

        return summary;
    }
    /* ****************************************************************
     *  Results
     * ****************************************************************/
    resultPoints () {
        const field_value = this.getFieldValueByName('Result.Points');
        return field_value ? field_value.text : null;
    }
    resultPointsSummary () {
        const points = this.resultPoints();

        const out = { total: 0, detail: {}};

        if (!points)
            return out;

        const summary = points
              .split(',')
              .reduce((out, line)=> {
                  const row = line.trim().split(':');
                  if (row.length!==3)
                      return out;

                  const parson = row[0];
                  const point = row[2] * 1;

                  out.total += point;
                  if (!out.detail[parson])
                      out.detail[parson] = 0;

                  out.detail[parson] += point;

                  return out;
              }, out);

        return summary;
    }
    /* ****************************************************************
     *  Dates
     * ****************************************************************/
    nextActionDate () {
        const field_value = this.getFieldValueByName('NextAction.Date');
        return field_value ? field_value.date : null;
    }
    dueDate () {
        const field_value = this.getFieldValueByName('Due.Date');
        return field_value ? field_value.date : null;
    }
    // 名前が name のフィールドの値を書き換えるときに、利用側へ渡す値。(JSON のまま。yanqirenshi/SOGH.next#29)
    // 形は、Issue の fieldValueContents(name) と同じ。{ project, item, field_item, value }
    //   project    … この Item の core の project (JSON)
    //   item       … この Item の core (JSON)
    //   field_item … フィールドの値 (JSON。field の id・name・dataType を持つ)
    //   value      … フィールドの種類ごとの値。(DATE なら { date }。知らない種類のときは null。yanqirenshi/SOGH.next#120)
    // 名前の合う値が無いときは、null。(Issue の画面の部品が、Item を渡されたときに読む。yanqirenshi/SOGH.next#114)
    fieldValueContents (name) {
        const field_item = this.getFieldValueByName(name);

        if (!field_item)
            return null;

        const core = this.core();

        return {
            project:    core.project,
            item:       core,
            field_item: field_item,
            value:      fieldValueOf(field_item),
        };
    }
    // before () {
    //     return [];
    // }
    // after () {
    //     return [];
    // }
}
