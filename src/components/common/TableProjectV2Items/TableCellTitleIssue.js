import * as React from 'react';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

import Link from '../Link.js';

export default function TableCellTitleIssue (props) {
    const item = props.item;
    const actions = props.actions;

    const repository = item.repository();

    // content は、Item の content を取得していないときは null (または、無い)。
    // そのときは、Title フィールドの値を出す。(リンクとクリックの動きは付けない)
    const issue = item.core().content;

    const click = ()=> {
        actions.issue.title.click(
            issue.repository.owner.login,
            issue.repository.name,
            issue.number);
    };

    return (
        <TableCell>
          <S>
            {!issue && item.title()}
            {issue && issue.number &&
             <>
               <span onClick={()=> click()}>
                 {issue.title}
               </span>
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
            {repository && repository.name()}
          </S>
        </TableCell>
    );
}
