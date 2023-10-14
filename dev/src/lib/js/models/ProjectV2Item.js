import GraphQLNode from './GraphQLNode.js';

export default class ProjectV2Item extends GraphQLNode {
    // constructor (data) { super(data); }
    creator () {
        return this._core.creator || null;
    }
    path () {
        console.log(this.sogh());
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

        return field_value ? field_value.date : [];
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
    planStart () {
        const field_value = this.getFieldValueByName('Plan.Start');
        return field_value ? field_value.date : null;
    }
    planEnd () {
        const field_value = this.getFieldValueByName('Plan.End');
        return field_value ? field_value.date : null;
    }
    // dueDate () {
    //     return null;
    // }
    // nextActionDate () {
    //     return null;
    // }
    // plans () {
    //     return {};
    // }
    // resutls () {
    //     return {};
    // }
    // before () {
    //     return [];
    // }
    // after () {
    //     return [];
    // }
}
