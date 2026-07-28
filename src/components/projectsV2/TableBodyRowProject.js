import React from 'react';
import moment from 'moment';

import TableRow from '@mui/material/TableRow';
import Cell from '@mui/material/TableCell';

export default function TableBodyRowProject (props) {
    const project = props.project;
    const columns = props.columns;
    const now = props.now;
    const actions = props.actions;
    const is_opened = props.opened;
    const onChange = props.onChange;

    const {start, end} = str2moments(project.plan());

    const is_in_term = now.isSameOrAfter(start) && now.isBefore(end);
    const is_passed  = now.isAfter(end);

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          {columns.map(column=> {
              return (
                  <Cell key={column.code}
                        sx={column.sx}>
                    {column.val(column, project, actions, is_opened, onChange)}
                  </Cell>
              );
          })}
        </TableRow>
    );
}

function str2moments (term) {
    const start = str2moment(term.start);
    const end   = str2moment(term.end);

    if ((!start || !end) ||
        !end.isSameOrAfter(start))
        return { start: null, end: null };

    return { start: start, end: end.add(1, 'd') };
}

function str2moment (str) {
    if (!str || str.trim().length===0)
        return null;

    const m = moment(str);

    if (!m.isValid())
        return null;

    return m;
}
