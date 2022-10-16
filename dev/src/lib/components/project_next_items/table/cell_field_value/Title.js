import React from 'react';

import TableCell from '@mui/material/TableCell';

export default function Title (props) {
    const value = props.value;

    return (
        <TableCell>
          {value.text}
        </TableCell>
    );
}
