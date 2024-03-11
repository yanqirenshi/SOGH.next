import React from 'react';
import moment from 'moment';

import Cell from '@mui/material/TableCell';

export default function TableCellPlan (props) {
    const project = props.project;
    const now = props.now;

    const plan = project.plan();

    const start = dt(plan.start);
    const end   = dt(plan.end);

    if (!start || !end)
        return (
            <>
              <Cell sx={{whiteSpace: 'nowrap', color:'#ec6d71'}} title={plan.start}>
                ?
              </Cell>

              <Cell sx={{whiteSpace: 'nowrap', color:'#ec6d71'}} title={plan.end}>
                ?
              </Cell>
            </>
        );

    const is_in_term = now.isSameOrAfter(start) && now.isSameOrBefore(end);
    const is_passed = now.isAfter(end);

    const sx = {
        whiteSpace: 'nowrap',
        fontWeight: is_in_term || is_passed ? 'bold' : null,
        color: is_passed ? '#ec6d71' : null,
    };

    return (
        <>
          <Cell sx={sx} title={plan.start}>
            {start.format('MM-DD')}
          </Cell>

          <Cell sx={sx} title={plan.end}>
            {end.format('MM-DD')}
          </Cell>
        </>
    );
}

function dt (v) {
    if (!v) return null;

    const d = moment(v);

    if (!d.isValid())
        return null;

    return d;
}
