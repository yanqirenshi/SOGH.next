import React from 'react';

import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TableCellDateTime from '../common/TableCellDateTime.js';
import TableCellLinkGithub from '../common/TableCellLinkGithub.js';
import TableCellLinkSogh from '../common/TableCellLinkSogh.js';
import TableCellProjectNextItemContent from '../common/TableCellProjectNextItemContent.js';

export default function Table (props) {
    const data = props.data;
    const sogh = props.sogh;

    if (!data) return null;

    const fields = data.fields;
    const items = data.items;

    return (
        <TableContainer component={Paper}>
          <MTable sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {fields.map(field=> {
                    return <TableCell key={field.id}>{field.name}</TableCell>;
                })}

                {/* <TableCell>title</TableCell> */}
                <TableCell>type</TableCell>

                <TableCell>isArchived</TableCell>
                <TableCell>Create</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((id) => {
                  const obj = sogh.projectNextItem(id);
                  const href = sogh.href(obj,'project-next-item', {id: obj.id()});

                  return (
                      <TableRow key={id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                        {fields.map(field=> {
                            const value = obj.fieldValues().find(d=>d.field.id===field.id);
                            return (
                                <TableCell key={field.id}>
                                  {value && value.text}
                                  {/* {field.id} */}
                                </TableCell>
                            );
                        })}

                        <TableCell>{obj.type()}</TableCell>

                        <TableCell>{obj.isArchived()}</TableCell>
                        <TableCellDateTime data={obj.createdAt()}/>
                        <TableCellDateTime data={obj.updatedAt()}/>
                      </TableRow>
                  );
              })}
            </TableBody>
          </MTable>
        </TableContainer>
    );
}
