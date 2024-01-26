import React from 'react';

import Cell from '@mui/material/TableCell';

export default function HeadCell (props) {
    const rowSpan = props.rowSpan || 1;
    const colSpan = props.colSpan || 1;
    const children = props.children;
    return (
        <Cell rowSpan={rowSpan}
              colSpan={colSpan}
              sx={{
                  pt: 0.1,
                  pb: 0.1,
                  pl: 0.2,
                  pr: 0.2,
                  textAlign: 'center',
              }}>
          {children}
        </Cell>
    );
}
