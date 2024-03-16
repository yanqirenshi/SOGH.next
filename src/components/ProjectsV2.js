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

    const actions = props.actions || defaultActions();

    return (
        <Box sx={{pt:2, pb: 22}}>
          <Table data={data}
                 sogh={sogh}
                 actions={actions}
                 columns={columns}/>
        </Box>
    );
}

function defaultActions () {
    return {
        title: {
            click: (project_id)=> project_id,
        },
    };
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
        code: 'owner',
        label: 'Owner',
        sx: {whiteSpace: 'nowrap'},
        val: (column, project, actions)=> {
            return (
                project.maneger()
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
            return null;
        },
    },
    {
        code: 'plan.end',
        group: 'Plan',
        label: 'End',
        sx: null,
        val: (column, project, actions)=> {
            return null;
        },
    },
    {
        code: 'result.start',
        group: 'Result',
        label: 'Start',
        sx: null,
        val: (column, project, actions)=> {
            return null;
        },
    },
    {
        code: 'result.end',
        group: 'Result',
        label: 'End',
        sx: null,
        val: (column, project, actions)=> {
            return null;
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
