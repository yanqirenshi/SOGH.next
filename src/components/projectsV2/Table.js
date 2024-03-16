import React from 'react';

import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Cell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TableBodyRow from './TableBodyRow.js';
import TableBodyRowTasks from './TableBodyRowTasks.js';
import HeadCell from './HeadCell.js';

export default function Table (props) {
    const data = props.data;
    const actions = props.actions;
    const columns = props.columns;

    const [open_tasks_projects, setOpenTasksProjects] = React.useState({});

    const onChangeOpenTaskProject = (id)=> {
        const new_state = {...open_tasks_projects};
        if (new_state[id]===true)
            new_state[id] = false;
        else
            new_state[id] = true;

        setOpenTasksProjects(new_state);
    };

    const header_rows = makeHeaderRows(columns);

    return (
        <TableContainer component={Paper}>
          <MTable aria-label="simple table" size="small">

            <TableHead>
              {header_rows.map((row,i)=> {
                  return (
                      <TableRow>
                        {row.map(d=> {
                            return (
                                <HeadCell rowSpan={d.row_span}
                                          colSpan={d.col_span}>
                                  {d.label}
                                </HeadCell>
                            );
                        })}
                      </TableRow>
                  );
              })}
            </TableHead>

            <TableBody>
              {data.map((project) => {
                  const project_id = project.id();
                  const is_open = open_tasks_projects[project_id];

                  return (
                      <>
                        <TableBodyRow key={project_id}
                                      project={project}
                                      columns={columns}
                                      actions={actions}
                                      opened={is_open}
                                      onChange={onChangeOpenTaskProject}/>
                        {is_open &&
                         <TableBodyRowTasks project={project}
                                            columns={columns}/>}
                      </>
                  );
              })}
            </TableBody>

          </MTable>
        </TableContainer>
    );
}

function makeHeaderRows (columns) {
    const tmp = columns.reduce((out, column)=> {
        const group = column.group || null;

        if (group) {
            out.is_double_row = true;
            if (!out.group) {
                out.group = { __type: 'group', label: group, list: [column]};
            } else {
                if (group===out.group.label) {
                    out.group.list.push(column);
                } else {
                    out.list.push(out.group);
                    out.group = { __type: 'group', label: group, list: [column]};
                }
            }

        } else {
            if (!out.group) {
                out.list.push(column);
            } else {
                out.list.push(out.group);
                out.group = null;

                out.list.push(column);
            }
        }

        return out;
    }, {
        group: null,
        is_double_row: false,
        list: [],
    });

    if (!tmp.is_double_row)
        return tmp.list;
    console.log(tmp.list);
    return tmp.list.reduce((out, data)=> {
        if ('group'===data.__type) {
            out[0].push({ label: data.label, row_span: 1, col_span: data.list.length});

            for (const d of data.list)
                out[1].push({ label: d.label, row_span: 1, col_span: 1});
        } else {
            out[0].push({ label: data.label, row_span: 2, col_span: 1});
        }

        return out;
    }, [[],[]]);
}
