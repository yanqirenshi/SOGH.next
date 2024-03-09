import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { ProjectsV2 } from '../../lib/index.js';

import { useRecoilValue, useRecoilState } from "recoil";
import { GITHUB_AUTH } from '../../recoil/GITHUB.js';
import * as atoms from '../../recoil/PAGE_SCRUM.js';

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
