import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import * as atoms from '../recoil/PAGE_SCRUM_PROJECT.js';

import Loading from '../panels/Loading.js';
import Frame from '../assemblies/frames/Frame.js';

import { ProjectV2Contents, ProjectV2Details } from '../lib/index.js';

import sogh from '../manegers/sogh.js';

export default function ScrumProject (props) {
    return (
        <Suspense fallback={<Loading/>}>
          <Project/>
        </Suspense>
    );
}

function Project () {
    const [priority, setPriority] = React.useState(null);
    const [plan, setPlan] = React.useState(null);
    const [result, setResult] = React.useState(null);

    const {login, number} = useParams();
    const nav = useNavigate();

    const authed = useRecoilValue(GITHUB_AUTH);
    const project = useRecoilValue(atoms.PROJECTV2({
        authed: authed ,
        login: login,
        number: number,
    }));
    const project_items = useRecoilValue(atoms.PROJECTV2_ITEMS({
        authed: authed ,
        login: login,
        number: number,
    }));

    const actions = {
        item: {
            title: {
                click: ()=> {
                },
            },
        },
        issue: {
            title: {
                click: (owner, repo, issue_num)=> {
                    const path = `/scrum/users/${owner}/repositories/${repo}/issues/${issue_num}`;
                    nav(path);
                },
            },
        },
        priority: {
            change: (project_id, v)=> console.log(['priority', project_id, v])
        },
        plan: {
            change: (project_id, start, end)=> console.log(['plan', project_id, start, end])
        },
        result: {
            change: (project_id, start, end)=> console.log(['result', project_id, start, end])
        }
    };

    const change = (type,v)=> {
        if ('priority'===type) setPriority(v);
        if ('plan'===type)     setPlan(v);
        if ('result'===type)   setResult(v);
    };

    return (
        <Frame>
          <Box sx={{width:'100%', height:'100%', overflow: 'auto'}}>
            <ProjectV2Contents project={sogh.projectV2(project)}/>

            <ProjectV2Details project={sogh.projectV2(project)}
                              items={project_items.map(id=> sogh.projectV2Item(id))}
                              actions={actions}/>
          </Box>
        </Frame>
    );
}
