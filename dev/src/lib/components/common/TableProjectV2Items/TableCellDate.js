import * as React from 'react';

import { DateTime } from "luxon";

import TableCell from '@mui/material/TableCell';

export default function TableCellDate (props) {
    const date = props.date;
    const status = props.status;

    return (
        <TableCell>
          {contents(date, status)}
        </TableCell>
    );
}

function contents (date, status) {
    if ('Done'===status)
        return date;

    const d = DateTime.fromISO(date);

    if (!d.isValid)
        return (
            <>
              <span style={{color:'#ec6d71'}}>?</span>
              {date &&
               (<span style={{color:'#ccc'}}>{date}</span>)}
            </>
        );

    const now = DateTime.now();
    const d_limit = d.plus({ days: 1 });

    if (now >= d_limit)
        return (
            <span style={{color: '#ec6d71', fontWeight: 'bold'}}>
              {date}
            </span>
        );

    return date;
}
