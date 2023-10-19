import React from 'react';

import TableCell from '@mui/material/TableCell';
import S from '@mui/material/Typography';

import LinkSogh from '../common/LinkSogh.js';

export default function TableCellLinkSogh (props) {
    const obj = props.data;
    const sogh = props.sogh;
    const to = props.to;
    const children = props.children;

    const href = sogh.href(to, { id: obj.id() });

    return (
        <TableCell>
          <S>
            <LinkSogh to={to} data={{id: obj.id()}} sogh={sogh}>
              {children}
            </LinkSogh>
          </S>
        </TableCell>
    );
}
