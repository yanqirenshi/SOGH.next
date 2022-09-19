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

    return (
        <TableContainer component={Paper}>
          <MTable sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>title</TableCell>
                <TableCell>type</TableCell>

                <TableCell>Content</TableCell>

                <TableCell>isArchived</TableCell>
                <TableCell>Create</TableCell>
                <TableCell>Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((id) => {
                  const obj = sogh.projectNextItem(id);
                  const href = sogh.href(obj,'project-next-item', {id: obj.id()});

                  // creator: {id: 'MDQ6VXNlcjY2NjU4NzQw', login: 'iwasaki-booklista', name: '岩崎 仁是', avatarUrl: 'https://avatars.githubusercontent.com/u/66658740?u=51fd1df1ffc2f2c9bb7083b9eda6d54f69a7e782&v=4', url: 'https://github.com/iwasaki-booklista', …}
                  // fieldValues: {nodes: Array(1)}

                  return (
                      <TableRow key={id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCellLinkSogh  to="project-next-item" data={obj} sogh={sogh}>
                          {obj.title()}
                        </TableCellLinkSogh>

                        <TableCell>{obj.type()}</TableCell>

                        <TableCellProjectNextItemContent data={obj} sogh={sogh}>
                          {obj.content()}
                        </TableCellProjectNextItemContent>


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
