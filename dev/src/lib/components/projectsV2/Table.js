import React from 'react';
import moment from 'moment';

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
                <HeadCell rowSpan="2">Number</HeadCell>
                <HeadCell rowSpan="2">Type</HeadCell>
                <HeadCell rowSpan="2">Title</HeadCell>
                {/* <HeadCell rowSpan="2">Public</HeadCell> */}
                <HeadCell rowSpan="2">Priority</HeadCell>
                <HeadCell rowSpan="2">Owner</HeadCell>
                <HeadCell rowSpan="2">Release</HeadCell>
                <HeadCell colSpan="2">Plan</HeadCell>
                <HeadCell colSpan="2">Result</HeadCell>
              </TableRow>

              <TableRow>
                <HeadCell>Start</HeadCell>
                <HeadCell>End</HeadCell>
                <HeadCell>Start</HeadCell>
                <HeadCell>End</HeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((project) => {
                  const obj = project;

                  const plan = obj.plan();
                  const result = obj.result();

                  return (
                      <TableRow key={project.id()}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CellLinkGithub data={obj}/>

                        <Cell sx={{wordBreak: 'keep-all'}}>
                          {obj.type()}
                        </Cell>

                        <Cell sx={{maxWidth: 333}}>
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

                        <Cell sx={{wordBreak: 'keep-all'}} title={plan.start}>
                          {dt(plan.start)}
                        </Cell>

                        <Cell sx={{wordBreak: 'keep-all'}} title={plan.end}>
                          {dt(plan.end)}
                        </Cell>

                        <Cell sx={{wordBreak: 'keep-all'}} title={result.start}>
                          {dt(result.start)}
                        </Cell>

                        <Cell sx={{wordBreak: 'keep-all'}} title={result.end}>
                          {dt(result.end)}
                        </Cell>

                        {/* <CellTermPlanResult plan={obj.plan()} */}
                        {/*                     result={obj.result()}/> */}

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

function dt (v) {
    if (!v)
        return '?';

    return moment(v).format('MM-DD');
}

function HeadCell (props) {
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
