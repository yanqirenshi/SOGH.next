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

    return (
        <TableContainer component={Paper}>
          <MTable aria-label="simple table" size="small">

            <TableHead>
              <TableRow>
                <Cell colSpan="3">Project</Cell>
                <Cell colSpan="5">Readme Attributes</Cell>
                <Cell rowSpan="2">Create<br/>Update</Cell>
              </TableRow>

              <TableRow>
                <Cell>Number</Cell>
                <Cell>Title</Cell>
                <Cell>Public</Cell>
                <Cell>Priority</Cell>
                <Cell>Owner</Cell>
                <Cell>Type</Cell>
                <Cell>Release</Cell>
                <Cell>Terms</Cell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((id) => {
                  const obj = sogh.projectV2(id);

                  return (
                      <TableRow key={id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <CellLinkGithub data={obj}/>

                        <Cell>
                          <S>
                            <LinkSogh to="project-v2" data={{id: obj.id()}} sogh={sogh}>
                              {obj.title()}
                            </LinkSogh>
                          </S>
                          <Description value={obj.shortDescription()}/>
                        </Cell>

                        <Cell>
                          {obj.public() ? '○' : '--'}
                        </Cell>

                        <Cell>
                          {obj.priority()}
                        </Cell>

                        <Cell>
                          {obj.owner()}
                        </Cell>

                        <Cell>
                          {obj.type()}
                        </Cell>

                        <Cell>
                          {obj.release()}
                        </Cell>

                        <CellTermPlanResult plan={obj.plan()}
                                            result={obj.result()}/>

                        <CellTimestamps create={obj.createdAt()}
                                        update={obj.updatedAt()}/>
                      </TableRow>
                  );
              })}
            </TableBody>

          </MTable>
        </TableContainer>
    );
}
