import React from 'react';

import TableCell from '@mui/material/TableCell';

import * as val from '../../../common/value/index.js';
import { reviewersOf } from '../../../common/reviewer.js';

// row は、Item のモデル。レビュアーは、モデルから読む。(型ごとの違いを、メソッドで吸収するため)
export default function Reviewers (props) {
    const row = props.row;

    const reviewers = reviewersOf(row);

    return (
        <TableCell>
          {reviewers.map(d=> <p key={d.id()}><val.Reviewer data={d}/></p>)}
        </TableCell>
    );
}
