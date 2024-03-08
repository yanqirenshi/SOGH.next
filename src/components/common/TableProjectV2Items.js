import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import S from '@mui/material/Typography';

import CellTimestamps from './TableCellTimestamps.js';
import TableCellTerm from './TableCellTerm.js';
// import UserName from './UserName.js';
import Link from './Link.js';

import TableCellTitle from './TableProjectV2Items/TableCellTitle.js';
import TableCellDate from './TableProjectV2Items/TableCellDate.js';
import TableCellAssignees from './TableProjectV2Items/TableCellAssignees.js';
import TableCellClosed from './TableProjectV2Items/TableCellClosed.js';

export default function TableProjectV2Items (props) {
    const items = props.items;

    return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table"
                 size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>

                <TableCell>Assignees</TableCell>

                <TableCell>Due</TableCell>
                <TableCell>NextAction</TableCell>
                <TableCell>Closed</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map(item => {
                  const repository = item.repository();
                  const issue = item.core().content;

                  const status = item.status();

                  return (
                      <TableRow key={item.id()}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                        <TableCellTitle item={item}/>

                        <TableCellAssignees item={item}/>

                        <TableCellDate date={item.dueDate()} status={status}/>

                        <TableCellDate date={item.nextActionDate()} status={status}/>

                        <TableCellClosed item={item}/>

                      </TableRow>
                  );
              })}
            </TableBody>
          </Table>
        </TableContainer>
    );
}
