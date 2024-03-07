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
import Button from '@mui/material/Button';

import LinkSogh from '../common/LinkSogh.js';
import Description from '../common/Description.js';
import CellLinkGithub from '../common/TableCellLinkGithub.js';
import CellTimestamps from '../common/TableCellTimestamps.js';
import CellTermPlanResult from '../common/TableCellTermPlanResult.js';
import TableBodyRow from './TableBodyRow.js';
import TableBodyRowTasks from './TableBodyRowTasks.js';

export default function Table (props) {
    const data = props.data;
    const sogh = props.sogh;
    const actions = props.actions;

    const [open_tasks_projects, setOpenTasksProjects] = React.useState({});

    const onChangeOpenTaskProject = (id)=> {
        const new_state = {...open_tasks_projects};
        if (new_state[id]===true)
            new_state[id] = false;
        else
            new_state[id] = true;

        setOpenTasksProjects(new_state);
    };

    return (
        <TableContainer component={Paper}>
          <MTable aria-label="simple table" size="small">

            <TableHead>
              <TableRow>
                <HeadCell rowSpan="2">Action</HeadCell>
                <HeadCell rowSpan="2">Number</HeadCell>
                <HeadCell rowSpan="2">Type</HeadCell>
                <HeadCell rowSpan="2">Title</HeadCell>
                {/* <HeadCell rowSpan="2">Public</HeadCell> */}
                <HeadCell rowSpan="2">Priority</HeadCell>
                <HeadCell rowSpan="2">Owner</HeadCell>
                {/* <HeadCell rowSpan="2">Release</HeadCell> */}
                <HeadCell colSpan="2">Plan</HeadCell>
                <HeadCell colSpan="2">Result</HeadCell>
                <HeadCell colSpan="1">Dependencies</HeadCell>
                <HeadCell rowSpan="2">Task</HeadCell>
              </TableRow>

              <TableRow>
                <HeadCell>Start</HeadCell>
                <HeadCell>End</HeadCell>
                <HeadCell>Start</HeadCell>
                <HeadCell>End</HeadCell>
                <HeadCell>Backlog</HeadCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((project) => {
                  const project_id = project.id();
                  const is_open = open_tasks_projects[project_id];

                  return (
                      <>
                        <TableBodyRow key={project_id}
                                      project={project}
                                      actions={actions}
                                      opened={is_open}
                                      onChange={onChangeOpenTaskProject}/>
                        {is_open &&
                         <TableBodyRowTasks project={project}/>}
                      </>
                  );
              })}
            </TableBody>

          </MTable>
        </TableContainer>
    );
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
