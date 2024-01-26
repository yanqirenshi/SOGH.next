import React from 'react';
import moment from 'moment';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Cell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Link from '../common/Link.js';

import HeadCell from './HeadCell.js';

export default function TableTasks (props) {
    const items = props.items;

    return (
        <TableContainer component={Paper}>
          <MTable aria-label="simple table" size="small">

            <TableHead>
              <TableRow>
                <HeadCell>#</HeadCell>
                <HeadCell>title</HeadCell>
                <HeadCell>Next Action Date</HeadCell>
                <HeadCell>Due Date</HeadCell>
                <HeadCell>Assignees</HeadCell>
                <HeadCell>Labels</HeadCell>
                <HeadCell>Status</HeadCell>
                <HeadCell>Type</HeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map(item=> {
                  const type = item.contentTypename();
                  const content = item.content();

                  return (
                      <TableRow key={item.id()}>
                        <Cell>
                          {'Issue'===type &&
                           <Link href={content.url}>
                             {content.number}
                           </Link>}
                          {'DraftIssue'===type && "(null)"}
                        </Cell>

                        <Cell>{item.title()}</Cell>

                        <Cell sx={{whiteSpace: 'nowrap'}}>
                          {item.nextActionDate()}
                        </Cell>

                        <Cell sx={{whiteSpace: 'nowrap'}}>
                          {item.dueDate()}
                        </Cell>

                        <CellAssignees item={item}/>

                        <CellLabels item={item}/>

                        <Cell sx={{whiteSpace: 'nowrap'}}>
                          {item.status()}
                        </Cell>

                        <Cell sx={{whiteSpace: 'nowrap'}}>
                          {item.type()}
                        </Cell>
                      </TableRow>
                  );
              })}
            </TableBody>

          </MTable>
        </TableContainer>
    );
}

function CellLabels (props) {
    const item = props.item;

    const labels = item.labels();

    return (
        <Cell sx={{p:0}}>
          <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
          {item.labels().map(label=> {
              return (
                  <Box key={label.id}
                     sx={{
                         background: '#'+label.color,
                         fontSize: 11,
                         pt: 0.2, pb: 0.2, pl: 0.4, pr: 0.4,
                         borderRadius: 1,
                     }}>
                    {label.name}
                  </Box>
              );
          })}
          </Box>
        </Cell>
    );
}

function CellAssignees (props) {
    const item = props.item;

    return (
        <Cell>
          {item.assignees().map(ass=> {
              return (
                  <Box sx={{display:'flex', alignItems:'center'}}>
                    <Box sx={{mr:0.5}}>
                      <Avatar alt={ass.login} src={ass.avatarUrl}
                              sx={{ width: 18, height: 18 }} />
                    </Box>
                    <Box sx={{whiteSpace: 'nowrap'}}>
                      {ass.name || ass.login}
                    </Box>
                  </Box>
              );
          })}
        </Cell>
    );
}
