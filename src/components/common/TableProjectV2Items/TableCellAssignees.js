import * as React from 'react';

import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';

export default function TableCellAssignees (props) {
    const item = props.item;

    return (
        <TableCell>
          {item.assignees().map(ass=> {
              return (
                  <Avatar key={ass.id}
                          alt={ass.name || ass.login}
                          src={ass.avatarUrl}
                          sx={{ width: 24, height: 24, display: 'inline-block', ml:0.5, mr:0.5 }}/>
              );
          })}
        </TableCell>
    );
}
