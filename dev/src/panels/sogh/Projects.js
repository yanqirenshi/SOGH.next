import React from 'react';
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Cell from '@mui/material/TableCell';
import S from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { ProjectsV2 } from '../../lib/index.js';

import { useRecoilState } from "recoil";
import * as atoms from '../../recoil/PAGE_SCRUM.js';

import Link from '../../parts/LinkOutSite.js';

import sogh from '../../manegers/sogh.js';

export default function Projects () {
    const [state_fetch, setStateFetch] = useRecoilState(atoms.STATUS_FETCH_PROJECTSV2);

    const projects = sogh.projectsV2();

    React.useEffect(()=> {
        if (state_fetch===null)
            sogh.asyncFetchProjectsV2ByTeam(
                process.env.REACT_APP_GITHU_TEAM_ID,
                {
                    start:     ()=> setStateFetch('STARTED'),
                    fetched:   ()=> setStateFetch('FETCHED-' + new Date().toISOString()),
                    successed: ()=> setStateFetch('SUCCESSED'),
                    failed:    ()=> setStateFetch('FAILED'),
                },
            );
    }, []);

    return (
        <Box sx={{ p:2, overflow: 'auto', height: '100%' }}>
          <Container maxWidth="xl">
            <ProjectsV2 data={projects}
                        columns={columns}
                        sogh={sogh}
                        actions={{
                            title: {
                                click: (project_id)=> console.log(project_id),
                            },
                        }}/>
          </Container>
        </Box>
    );
}

const columns = [
    {
        code: 'number',
        label: '#',
        sx: null,
        val: (column, data)=> {
            const project = data.project;

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
        val: (column, data)=> {
            const project = data.project;
            const actions = data.actions;

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
    // {
    //     code: 'Public',
    //     label: '',
    //     sx: null,
    //     val: (column, project, actions)=> {
    //         return (
    //             project.public() ? '○' : '--'
    //         );
    //     },
    // },
    {
        code: 'priority',
        label: 'Priority',
        sx: {whiteSpace: 'nowrap'},
        val: (column, data)=> {
            const project = data.project;

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
        val: (column, data)=> {
            const project = data.project;

            return (
                project.maneger()
            );
        },
    },
    // {
    //     code: 'release',
    //     label: 'Release',
    //     sx: {whiteSpace: 'nowrap'},
    //     val: (column, project, actions)=> {
    //         return (
    //             project.release()
    //         );
    //     },
    // },
    {
        code: 'plan.start',
        group: 'Plan',
        label: 'Start',
        sx: null,
        val: (column, data)=> {
            const project = data.project;

            return (
                <span style={{
                    whiteSpace: 'nowrap',
                    fontWeight: (data.is_in_term || data.is_passed) ? 'bold' : null,
                    color: data.is_passed ? '#ec6d71' : null,
                }}>
                  {fmt(project.plan().start)}
                </span>
            );
        },
    },
    {
        code: 'plan.end',
        group: 'Plan',
        label: 'End',
        sx: null,
        val: (column, data)=> {
            const project = data.project;

            return (
                <span style={{
                    whiteSpace: 'nowrap',
                    fontWeight: (data.is_in_term || data.is_passed) ? 'bold' : null,
                    color: data.is_passed ? '#ec6d71' : null,
                }}>
                  {fmt(project.plan().end)}
                </span>
            );
        },
    },
    {
        code: 'result.start',
        group: 'Result',
        label: 'Start',
        sx: null,
        val: (column, data)=> {
            const project = data.project;

            return (
                <span style={{whiteSpace: 'nowrap'}}>
                  {fmt(project.result().start)}
                </span>
            );
        },
    },
    {
        code: 'result.end',
        group: 'Result',
        label: 'End',
        sx: null,
        val: (column, data)=> {
            const project = data.project;

            return (
                <span style={{whiteSpace: 'nowrap'}}>
                  {fmt(project.result().end)}
                </span>
            );
        },
    },
    {
        code: 'progress',
        label: 'Progress',
        sx: null,
        val: (column, data)=> {
            const project = data.project;

            return project.progress();
        },
    },
    {
        code: 'action',
        label: 'Action',
        sx: {whiteSpace: 'nowrap'},
        val: (column, data)=> {
            const project = data.project;

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
        val: (column, data)=> {
            const project = data.project;

            return (
                project.backlog()
            );
        },
    },
    {
        code: 'task',
        label: 'Task',
        sx: {p:0.1},
        val: (column, data)=> {
            const project = data.project;
            const actions = data.actions;
            const is_opened = data.is_opened;
            const onChange = data.onChange;

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

function fmt (v) {
    if (!v)
        return null;

    const dt = DateTime.fromISO(v);

    if (!dt.isValid)
        return null;

    return dt.toFormat('LL-dd');
}
