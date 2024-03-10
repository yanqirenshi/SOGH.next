import * as React from 'react';

import { DateTime } from "luxon";

import TableCell from '@mui/material/TableCell';

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
