import React from 'react';

import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TableCellDateTime from '../common/TableCellDateTime.js';
import TableCellLinkGithub from '../common/TableCellLinkGithub.js';
import TableCellLinkSogh from '../common/TableCellLinkSogh.js';
import TableCellProjectNextItemContent from '../common/TableCellProjectNextItemContent.js';

import CellFieldLabel from './CellFieldLabel.js';
import CellFieldValue from './CellFieldValue.js';

export default function Table (props) {
    const [common_fields, setCommonFields] = React.useState({
        TITLE:                { num:  1, show: true },
        ASSIGNEES:            { num:  2, show: false },
        LABELS:               { num:  3, show: false },
        MILESTONE:            { num:  4, show: false },
        REPOSITORY:           { num:  5, show: false },
        LINKED_PULL_REQUESTS: { num:  7, show: false }, // TODO: 未調整
        REVIEWERS:            { num:  6, show: false }, // TODO: 未調整
        TRACKS:               { num:  8, show: false }, // TODO: 未調整
        // common fields
        TYPE:                 { num:  9, show: true },
        IS_ARCHIVED:          { num: 10, show: true },
        CREATED_AT:           { num: 11, show: false },
        UPDATED_AT:           { num: 12, show: false },
        // xxx
        DATE: {
            'Date.Due':        { num: 13, show: false },
            'Date.NextAction': { num: 14, show: false },
        },
    });

    const data = props.data;
    const sogh = props.sogh;

    if (!data) return null;

    const fields = getFields(data, common_fields);

    const items = data.items;

    return (
        <TableContainer component={Paper}>
          <MTable sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {fields.map(field=>
                    <CellFieldLabel  key={field.id} field={field}/>)}

                {common_fields.TYPE.show &&
                 <TableCell>type</TableCell>}

                {common_fields.IS_ARCHIVED.show &&
                 <TableCell>isArchived</TableCell>}

                {common_fields.CREATED_AT.show &&
                 <TableCell>Create</TableCell>}

                {common_fields.UPDATED_AT.show &&
                 <TableCell>Update</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((id) => {
                  const row = sogh.projectNextItem(id);
                  const href = sogh.href(row,'project-next-item', {id: row.id()});

                  return (
                      <TableRow key={id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                        {fields.map(field=>
                            <CellFieldValue field={field} row={row}/>)}

                        {common_fields.TYPE.show &&
                         <TableCell>{row.type()}</TableCell>}

                        {common_fields.IS_ARCHIVED.show &&
                         <TableCell>{row.isArchived()}</TableCell>}

                        {common_fields.CREATED_AT.show &&
                         <TableCellDateTime data={row.createdAt()}/>}

                        {common_fields.UPDATED_AT.show &&
                         <TableCellDateTime data={row.updatedAt()}/>}
                      </TableRow>
                  );
              })}
            </TableBody>
          </MTable>
        </TableContainer>
    );
}

function getFields (data, common_fields) {
    return data.fields.filter(d=> {
        const common_field = common_fields[d.dataType];

        console.log(d.dataType==='DATE');

        return common_field ? common_field.show : true;
    });
}
