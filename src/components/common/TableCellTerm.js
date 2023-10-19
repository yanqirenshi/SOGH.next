import React from 'react';

import { DateTime } from 'luxon';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

const style = {
    whiteSpace: 'nowrap',
};

export default function TableCellTerm (props) {
    const term = props.term;

    return (
        <TableCell style={style}>
          <S>{fmt(term.start)}</S>
          <S>{fmt(term.end)}</S>
        </TableCell>
    );
}

function fmt (v) {
    if (!v)
        return null;

    const dt = DateTime.fromISO(v);

    if (!dt.isValid)
        return null;

    return dt.toFormat('yyyy-LL-dd');
}
