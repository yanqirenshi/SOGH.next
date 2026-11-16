import React from 'react';

import Box from '@mui/material/Box';
import Cell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import TableTasks from './TableTasks.js';

export default function TableBodyRowTasks (props) {
    const project = props.project;
    const columns = props.columns;

    // Pool にある、この ProjectV2 の Item。(中身に入っている Item と、別に取った Item。yanqirenshi/SOGH.next#102)
    const items = project.itemsInPool();

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <Cell colSpan={columns.length} sx={{background: 'rgba(234, 228, 208, 0.3)'}}>
            <Box sx={{p:1}}>
              <TableTasks items={items}/>
            </Box>
          </Cell>
        </TableRow>
    );
}
