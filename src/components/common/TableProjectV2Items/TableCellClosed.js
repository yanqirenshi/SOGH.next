import * as React from 'react';

import { DateTime } from "luxon";

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

// </TableCell>

export default function TableCellClosed (props) {
    const item = props.item;

    if ('ISSUE'!==item.core().type)
        return (
            <TableCell>
            </TableCell>
        );

    const issue = item.core().content;

    const d = DateTime.fromISO(issue.closedAt);

    if (!d.isValid)
        return (
            <TableCell>
            </TableCell>
        );

    return (
        <TableCell title={issue.closedAt}>
          {d.toFormat('yyyy-dd-mm')}
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
