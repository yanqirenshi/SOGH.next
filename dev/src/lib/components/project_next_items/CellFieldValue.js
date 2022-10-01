import React from 'react';

import TableCell from '@mui/material/TableCell';

import * as cell from './cell_field_value/index.js';

export default function CellFieldValue (props) {
    const field = props.field;
    const row = props.row;

    const value = row.fieldValues().find(d=> d.field.id===field.id);

    switch (field.dataType) {
    case 'TITLE':                return <cell.Title value={value} />;
    case 'ASSIGNEES':            return <cell.Assignees value={value} />;
    case 'LABELS':               return <cell.Labels value={value} />;
    case 'MILESTONE':            return <cell.Milestone value={value} />;
    case 'REPOSITORY':           return <cell.Repository value={value} />;
    case 'LINKED_PULL_REQUESTS': return <TableCell></TableCell>;
    case 'TRACKS':               return <TableCell></TableCell>;
    case 'REVIEWERS':            return <TableCell></TableCell>;
    }

    // org fields
    switch (field.dataType) {
    case 'SINGLE_SELECT':        return <TableCell></TableCell>;
    case 'TEXT':                 return <TableCell></TableCell>;
    case 'DATE':                 return <TableCell></TableCell>;
    default:                     return <TableCell>??? ({field.dataType})</TableCell>;
    }
}
