import React from 'react';

import { DateTime } from 'luxon';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

const style = {
    whiteSpace: 'nowrap',
};

export default function TableCellTermPlanResult (props) {
    const plan = props.plan;
    const result = props.result;

    return (
        <TableCell style={style}>
          <S style={{fontSize:12}}>{`${fmt(plan.start)} - ${fmt(plan.end)}`}</S>
          <S style={{fontSize:12}}>{`${fmt(result.start)} - ${fmt(result.end)}`}</S>
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
