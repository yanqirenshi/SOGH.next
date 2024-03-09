import React from 'react';

import Box from '@mui/material/Box';
import Cell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import TableTasks from './TableTasks.js';

export default function TableBodyRowTasks (props) {
    const project = props.project;

    const items = project.itemsWith2ProjectV2Item();

    return (
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <Cell colSpan="12" sx={{background: 'rgba(234, 228, 208, 0.3)'}}>
            <Box sx={{p:1}}>
              <TableTasks items={items}/>
            </Box>
          </Cell>
        </TableRow>
    );
}
