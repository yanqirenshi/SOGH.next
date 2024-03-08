import * as React from 'react';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

import Link from '../Link.js';

export default function TableCellTitleIssue (props) {
    const item = props.item;

    const repository = item.repository();
    const issue = item.core().content;

    return (
        <TableCell>
          <S>
            {issue.number &&
             <>
               <span>{issue.title}</span>
               <span style={{marginLeft:8}}>
                 (
                 <Link href={issue.url}>
                   {issue.number}
                 </Link>
                 )
               </span>
             </>}
          </S>
          <S variant="caption">
            {repository.name}
          </S>
        </TableCell>
    );
}
