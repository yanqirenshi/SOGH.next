import * as React from 'react';

import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import S from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import Link from '../Link.js';

import TableCellTitleIssue from './TableCellTitleIssue.js';

export default function TableCellTitle (props) {
    const item = props.item;

    const repository = item.repository();
    const issue = item.core().content;

    const content_type = item.core().type;
    const is_issue = content_type==="ISSUE";

    if (is_issue)
        return <TableCellTitleIssue item={item}/>;

    return (
        <TableCell>

          <S variant="h6">
            <Link href={item.path()}>
              {item.title()}
            </Link>
          </S>

          <Chip label={content_type} size="small" sx={{fontSize:11, mt:0.5}}/>
        </TableCell>
    );
}