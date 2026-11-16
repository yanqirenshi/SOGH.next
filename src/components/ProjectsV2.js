import React from 'react';
import Box from '@mui/material/Box';

import Table from './projectsV2/Table.js';

import Cell from '@mui/material/TableCell';
import S from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Link from './common/Link.js';

export default function ProjectsV2 (props) {
    const data = props.data;
    const sogh = props.sogh;
    const columns = props.columns || COLUMNS;

    // 渡された actions に無い関数は、既定の関数を使う。(一部だけ渡しても落ちない。yanqirenshi/SOGH.next#102)
    const actions = mergeActions(defaultActions(), props.actions);

    return (
        <Box sx={{pt:2, pb: 22}}>
          <Table data={data}
                 sogh={sogh}
                 actions={actions}
                 columns={columns}/>
        </Box>
    );
}

// 期間 (Term) の start か end を返す。期間でないもの (null など) のときは null。
function termDate (term, part) {
    if (!term || typeof term !== 'object')
        return null;

    return term[part] || null;
}

function defaultActions () {
    return {
        title: {
            click: (project_id)=> project_id,
        },
        // Task の列の「開く」で、行が開いたとき。(閉じたときは呼ばない。Item の取得は、利用側がする。yanqirenshi/SOGH.next#102)
        tasks: {
            open: (project_id)=> project_id,
        },
    };
}

// 既定の actions に、渡された actions を重ねる。(yanqirenshi/SOGH.next#102)
//   - 既定にある組 (title・tasks) は、関数ごとに重ねる。渡された関数はそのまま使い、無い関数 (関数でないものも) は既定を使う。
//   - 既定に無い名前 (組も、組の中の名前も) は、そのまま通す。
//   - actions が無い (undefined・null) ときは、既定だけ。
function mergeActions (defaults, given) {
    if (!given || typeof given !== 'object')
        return defaults;

    const out = { ...given };

    for (const [name, group] of Object.entries(defaults)) {
        const given_group = given[name];

        if (!given_group || typeof given_group !== 'object') {
            out[name] = group;
            continue;
        }

        const merged = { ...given_group };

        for (const [fn_name, fn] of Object.entries(group))
            if (typeof given_group[fn_name] !== 'function')
                merged[fn_name] = fn;

        out[name] = merged;
    }

    return out;
}

const COLUMNS = [
    {
        code: 'type',
        label: 'Type',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            return (
                project.type()
            );
        },
    },
    {
        code: 'number',
        label: '#',
        sx: null,
        val: (column, project, actions)=> {
            return (
                <Link href={project.url()}>
                  {project.number()}
                </Link>
            );
        },
    },
    {
        code: 'title',
        label: 'Title',
        sx: null,
        val: (column, project, actions)=> {
            return (
                <S sx={{
                    color: 'rgba(0, 0, 0, 0.87)',
                    textDecorationStyle: 'dotted',
                    textDecorationColor: '#ddd',
                    cursor: 'pointer',
                }}
                   onClick={()=> actions.title.click(project.id())}>
                  {project.title()}
                </S>
            );
        },
    },
    {
        code: 'Public',
        label: '',
        sx: null,
        val: (column, project, actions)=> {
            return (
                project.public() ? '○' : '--'
            );
        },
    },
    {
        code: 'priority',
        label: 'Priority',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            const priority = project.priorityData();

            return (
                <span title={priority.label}>
                  {`${priority.label_short} (${priority.code})`}
                </span>
            );
        },
    },
    {
        code: 'readmeOwner',
        label: 'Owner',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            return (
                project.readmeOwner()
            );
        },
    },
    {
        code: 'release',
        label: 'Release',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            return (
                project.release()
            );
        },
    },
    {
        code: 'plan.start',
        group: 'Plan',
        label: 'Start',
        sx: null,
        val: (column, project, actions)=> {
            // README の $Plan の日付 (文字列) をそのまま出す。書いていないときは null (空)。(yanqirenshi/SOGH.next#94)
            return termDate(project.plan(), 'start');
        },
    },
    {
        code: 'plan.end',
        group: 'Plan',
        label: 'End',
        sx: null,
        val: (column, project, actions)=> {
            // README の $Plan の日付 (文字列) をそのまま出す。書いていないときは null (空)。(yanqirenshi/SOGH.next#94)
            return termDate(project.plan(), 'end');
        },
    },
    {
        code: 'result.start',
        group: 'Result',
        label: 'Start',
        sx: null,
        val: (column, project, actions)=> {
            // README の $Result の日付 (文字列) をそのまま出す。書いていないときは null (空)。(yanqirenshi/SOGH.next#94)
            return termDate(project.result(), 'start');
        },
    },
    {
        code: 'result.end',
        group: 'Result',
        label: 'End',
        sx: null,
        val: (column, project, actions)=> {
            // README の $Result の日付 (文字列) をそのまま出す。書いていないときは null (空)。(yanqirenshi/SOGH.next#94)
            return termDate(project.result(), 'end');
        },
    },
    {
        code: 'progress',
        label: 'Progress',
        sx: null,
        val: (column, project, actions)=> {
            return project.progress();
        },
    },
    {
        code: 'action',
        label: 'Action',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            return (
                project.action()
            );
        },
    },
    {
        code: 'dependencies.backlog',
        group: 'Dependencies',
        label: 'Backlog',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            return (
                project.backlog()
            );
        },
    },
    {
        code: 'task',
        label: 'Task',
        sx: {p:0.1},
        val: (column, project, actions, is_opened, onChange)=> {
            return (
                <Button variant="text"
                        sx={{p:0.2}}
                        onClick={()=> onChange(project.id())}>
                  {is_opened  && "閉じる"}
                  {!is_opened && "開く"}
                </Button>
            );
        },
    },
];
