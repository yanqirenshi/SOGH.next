import React from 'react';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

export default function TableCellProjectV2ItemFieldValue (props) {
    const item = props.item;
    const field = props.field;

    const field_value = item.getFieldValueByName(field.name);

    // |              |                                     | creator |
    // |--------------+-------------------------------------+---------|
    // | Date         | ProjectV2ItemFieldDateValue         | o       |
    // | Iteration    | ProjectV2ItemFieldIterationValue    | o       |
    // | Number       | ProjectV2ItemFieldNumberValue       | o       |
    // | SingleSelect | ProjectV2ItemFieldSingleSelectValue | o       |
    // | Text         | ProjectV2ItemFieldTextValue         | o       |
    // |--------------+-------------------------------------+---------|
    // | Label        | ProjectV2ItemFieldLabelValue        | -       |
    // | Milestone    | ProjectV2ItemFieldMilestoneValue    | -       |
    // | PullRequest  | ProjectV2ItemFieldPullRequestValue  | -       |
    // | Repository   | ProjectV2ItemFieldRepositoryValue   | -       |
    // | Reviewer     | ProjectV2ItemFieldReviewerValue     | -       |
    // | User         | ProjectV2ItemFieldUserValue         | -       |

    return (
        <TableCell>
          {field_value ? value(field_value) : null}
        </TableCell>
    );
}

function value (field_value) {
    const typename = field_value.__typename;

    // Date
    if ('ProjectV2ItemFieldDateValue'===typename)
        return field_value.date;

    // Iteration
    if ('ProjectV2ItemFieldIterationValue'===typename)
        ;
    // Number
    if ('ProjectV2ItemFieldNumberValue'===typename)
        ;
    // SingleSelect
    if ('ProjectV2ItemFieldSingleSelectValue'===typename)
        return field_value.name;

    // Text
    if ('ProjectV2ItemFieldTextValue'===typename)
        return field_value.text;

    // Label
    if ('ProjectV2ItemFieldLabelValue'===typename)
        ;
    // Milestone
    if ('ProjectV2ItemFieldMilestoneValue'===typename)
        ;
    // PullRequest
    if ('ProjectV2ItemFieldPullRequestValue'===typename)
        ;
    // Repository
    if ('ProjectV2ItemFieldRepositoryValue'===typename)
        return field_value.repository.name;

    // Reviewer
    if ('ProjectV2ItemFieldReviewerValue'===typename)
        ;
    // User
    if ('ProjectV2ItemFieldUserValue'===typename)
        return field_value.users.nodes.map(user=> {
            return <p>{user.name || user.login}</p>;
        });

    return null;
}
