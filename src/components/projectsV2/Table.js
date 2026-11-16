import React from 'react';

import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import TableBodyRow from './TableBodyRow.js';
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

        // 開いたときだけ、外に知らせる。(Item の取得は、利用側がする。yanqirenshi/SOGH.next#102)
        if (new_state[id]===true)
            notifyTasksOpen(actions, id);
    };

    const header_rows = makeHeaderRows(columns);

    return (
        <TableContainer component={Paper}>
          <MTable aria-label="simple table" size="small">

            <TableHead>
              {header_rows.map((row,i)=> {
                  return (
                      <TableRow key={i}>
                        {row.map((d,i)=> {
                            return (
                                <HeadCell key={d.label+'_'+i}
                                          rowSpan={d.row_span}
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
                  const is_opened = open_tasks_projects[project_id];

                  return (
                      <TableBodyRow key={project_id}
                                    project={project}
                                    columns={columns}
                                    actions={actions}
                                    opened={is_opened}
                                    onChange={onChangeOpenTaskProject}/>
                  );
              })}
            </TableBody>

          </MTable>
        </TableContainer>
    );
}

// actions.tasks.open(project_id) を呼ぶ。(渡されていないときは、何もしない)
function notifyTasksOpen (actions, project_id) {
    const tasks = actions ? actions.tasks : null;

    if (tasks && typeof tasks.open === 'function')
        tasks.open(project_id);
}

// 見出しの行の配列を返す。([行, …]。行は [{ label, row_span, col_span }, …])
//   - グループ (group) の付いた列があるときは、2 行。(1 行目: グループと、グループの無い列。2 行目: グループの中の列)
//   - グループの付いた列が無いときは、1 行。(yanqirenshi/SOGH.next#105)
//   - 列が 0 個のときは、行も 0 個。
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

    // 最後の列がグループの中にあるときは、そのグループが残っているので、足す。(yanqirenshi/SOGH.next#105)
    if (tmp.group)
        tmp.list.push(tmp.group);

    if (tmp.list.length===0)
        return [];

    // グループの付いた列が無いときは、行を 1 つ返す。(前は、列の配列をそのまま返していて、表が落ちた。yanqirenshi/SOGH.next#105)
    if (!tmp.is_double_row)
        return [tmp.list.map(column=> ({ label: column.label, row_span: 1, col_span: 1 }))];

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
