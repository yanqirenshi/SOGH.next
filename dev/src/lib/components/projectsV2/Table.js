import React from 'react';

import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Cell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import S from '@mui/material/Typography';

import LinkSogh from '../common/LinkSogh.js';
import Description from '../common/Description.js';
import CellLinkGithub from '../common/TableCellLinkGithub.js';
import CellTimestamps from '../common/TableCellTimestamps.js';
import CellTermPlanResult from '../common/TableCellTermPlanResult.js';

export default function Table (props) {
    const data = props.data;
    const sogh = props.sogh;
    const actions = props.actions;

    return (
        <TableContainer component={Paper}>
          <MTable aria-label="simple table" size="small">

            <TableHead>
              <TableRow>
                <Cell>Number</Cell>
                <Cell>Type</Cell>
                <Cell>Title</Cell>
                {/* <Cell>Public</Cell> */}
                <Cell>Priority</Cell>
                <Cell>Owner</Cell>
                <Cell>Release</Cell>
                <Cell>Plan/Result</Cell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((project) => {
                  const obj = project;

                  return (
                      <TableRow key={project.id()}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CellLinkGithub data={obj}/>

                        <Cell sx={{wordBreak: 'keep-all'}}>
                          {obj.type()}
                        </Cell>

                        <Cell>
                          <S sx={{
                              color: 'rgba(0, 0, 0, 0.87)',
                              textDecorationStyle: 'dotted',
                              textDecorationColor: '#ddd',
                              cursor: 'pointer',
                          }}
                             onClick={()=> actions.title.click(project.id())}>
                            {obj.title()}
                          </S>
                          <Description value={obj.shortDescription()}/>
                        </Cell>

                        {/* <Cell> */}
                        {/*   {obj.public() ? '○' : '--'} */}
                        {/* </Cell> */}

                        <Cell>
                          {obj.priority()}
                        </Cell>

                        <Cell sx={{wordBreak: 'keep-all'}}>
                          {obj.maneger()}
                        </Cell>

                        <Cell sx={{wordBreak: 'keep-all'}}>
                          {obj.release()}
                        </Cell>

                        <CellTermPlanResult plan={obj.plan()}
                                            result={obj.result()}/>

                        {/* <CellTimestamps create={obj.createdAt()} */}
                        {/*                 update={obj.updatedAt()}/> */}
                      </TableRow>
                  );
              })}
            </TableBody>

          </MTable>
        </TableContainer>
    );
}
