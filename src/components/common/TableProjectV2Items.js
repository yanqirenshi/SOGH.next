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
import UserName from './UserName.js';
import Link from './Link.js';

export default function TableProjectV2Items (props) {
    const items = props.items;

    return (
        <TableContainer component={Paper}>
          <Table aria-label="simple table"
                 size="small">
            <TableHead>
              <TableRow>
                {/* <TableCell>Status</TableCell> */}

                <TableCell>Title</TableCell>

                {/* <TableCell>Type</TableCell> */}

                <TableCell>Plan</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => {
                  const repository = item.repository();
                  const issue = item.core().content;

                  return (
                      <TableRow key={item.id()}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                        {/* <TableCell>{item.status()}</TableCell> */}

                        <TableCell>
                            <S variant="h6">
                              <Link href={item.path()}>
                                {item.title()}
                              </Link>
                            </S>
                          <S>
                            <span>{repository ? repository.name : null}</span>
                            {issue.number &&
                             <>
                               <span>{issue.title}</span>
                               <span>
                                 (
                                 <Link href={issue.url}>
                                   {issue.number}
                                 </Link>
                                 )
                               </span>
                             </>}
                          </S>
                          <S>
                            Create: <UserName user={item.creator()}/>
                            <span>{item.archived() ? 'archived' : ''}</span>
                          </S>
                        </TableCell>

                        <TableCellTerm term={{
                            start: null,
                            end: null,
                        }}/>

                        {/* <TableCell>{item.type()}</TableCell> */}

                        <CellTimestamps create={item.createdAt()}
                                        update={item.updatedAt()}/>
                      </TableRow>
                  );
              })}
            </TableBody>
          </Table>
        </TableContainer>
    );
}
