import * as React from 'react';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import TableCellTitleIssue from './TableCellTitleIssue.js';

export default function TableCellTitle (props) {
    const item = props.item;
    const actions = props.actions;

    const content_type = item.core().type;
    const is_issue = content_type==="ISSUE";

    if (is_issue)
        return <TableCellTitleIssue item={item}
                                    actions={actions}/>;

    return (
        <TableCell>

          <S variant="h6">
            <span onClick={()=> actions.item.title.click(item.id())}>
              {item.title()}
            </span>
          </S>

          <Chip label={content_type} size="small" sx={{fontSize:11, mt:0.5}}/>
        </TableCell>
    );
}
