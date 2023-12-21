import React from 'react';

import { DateTime } from 'luxon';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

const style = {
    whiteSpace: 'nowrap',
};

export default function TableCellTimestamps (props) {
    const create = props.create;
    const update = props.update;

    return (
        <TableCell style={style}>
          <S sx={{fontSize:12}}>{fmt(create)}</S>
          <S sx={{fontSize:12}}>{fmt(update)}</S>
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
