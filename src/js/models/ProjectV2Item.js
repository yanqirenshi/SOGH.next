import GraphQLNode from './GraphQLNode.js';

export default class ProjectV2Item extends GraphQLNode {
    // constructor (data) { super(data); }
    creator () {
        return this._core.creator || null;
    }
    path () {
        return this.sogh().href('project-v2-items', this);
    }
    fieldValues () {
        return this._core.fieldValues.nodes || [];
    }
    getFieldValueByName(name) {
        const field_value = this.fieldValues().find(fv=> {
            return fv.field.name === name;
        });

        if (!field_value)
            return null;

        return field_value;
    }
    project () {
        return this._core.project;
    }
    projectNumber () {
        return this._core.project.number;
    }
    projectOwnerLogin () {
        return this._core.project.owner.login;
    }
    projectPath () {
        const project = this.project();
        const sogh = this.sogh();

        return sogh.href('project-v2-data', project);
    }
    type () {
        return this._core.type || null;
    }
    archived () {
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
    assignees () {
        const field_value = this.getFieldValueByName('Assignees');

        return field_value ? field_value.users.nodes : [];
    }
    labels () {
        const field_value = this.getFieldValueByName('Labels');

        return field_value ? field_value.date : [];
    }
    linkedPullRequests () {
        const field_value = this.getFieldValueByName('Linked pull requests');

        return field_value ? field_value.date : null;
    }
    reviewers () {
        const field_value = this.getFieldValueByName('Reviewers');

        return field_value ? field_value.date : null;
    }
    repository () {
        const field_value = this.getFieldValueByName('Repository');

        return field_value ? field_value.repository : null;
    }
    milestone () {
        const field_value = this.getFieldValueByName('Milestone');
        return field_value ? field_value.date : null;
    }
    content () {
        return this.core().content;
    }
    contentTypename () {
        return this.content().__typename;
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

                  const parson = row[0];
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
                  const date = row[1];
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
    // before () {
    //     return [];
    // }
    // after () {
    //     return [];
    // }
}
