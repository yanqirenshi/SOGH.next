import React from 'react';

import { DateTime } from 'luxon';

import TableCell from '@mui/material/TableCell';

export default function TableCellDateTime (props) {
    const value = props.data;

    return (
        <TableCell>
          {fmt(value)}
        </TableCell>
    );
}

function fmt (v) {
    if (!v)
        return null;

    const dt = DateTime.fromISO(v);

    if (!dt.isValid)
        return null;

    return dt.toFormat('yyyy-LL-dd HH:mm');
}
