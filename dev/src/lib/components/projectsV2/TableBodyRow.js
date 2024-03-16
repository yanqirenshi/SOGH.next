import React from 'react';
import moment from 'moment';

import TableRow from '@mui/material/TableRow';
import Cell from '@mui/material/TableCell';

export default function TableBodyRow (props) {
    const project = props.project;
    const columns = props.columns;
    const actions = props.actions;
    const is_opened = props.opened;
    const onChange = props.onChange;

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          {columns.map(column=> {
              return (
                  <Cell sx={column.sx}>
                    {column.val(column, project, actions, is_opened, onChange)}
                  </Cell>
              );
          })}
        </TableRow>
    );
}
