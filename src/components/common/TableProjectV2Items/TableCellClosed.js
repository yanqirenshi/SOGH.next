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

    // content を取得していないとき (null、または、無い) は、空のセルを出す。
    if (!issue)
        return (
            <TableCell>
            </TableCell>
        );

    const d = DateTime.fromISO(issue.closedAt);

    if (!d.isValid)
        return (
            <TableCell>
            </TableCell>
        );

    return (
        <TableCell title={issue.closedAt}>
          {d.toFormat('yyyy-LL-dd')}
        </TableCell>
    );
}
