import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TableCellDateTime from './TableCellDateTime.js';

export default function TableProjectV2Fields (props) {
    const project = props.project;

    const rows = project.fields();

    return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table"
                 size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Create</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(field => {
                  return (
                      <TableRow key={field.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.dataType}</TableCell>

                        <TableCellDateTime value={field.createdAt}/>
                        <TableCellDateTime value={field.updatedAt}/>
                      </TableRow>
                  );
              })}
            </TableBody>
          </Table>
        </TableContainer>
    );
}
