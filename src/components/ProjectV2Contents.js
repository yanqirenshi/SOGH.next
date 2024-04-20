import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Title from './ProjectV2/Title.js';
import ReadmeAttributes from './ProjectV2/ReadmeAttributes.js';

export default function ProjectV2 (props) {
    const project = props.project;
    const actions = ensureActions(props.actions);
    const values = props.values;
    const onChange = props.onChange;

    if (!project)
        return null;

    return (
        <Box sx={{pt:3}}>

          <Container maxWidth="xl">
            <Title project={project}/>
          </Container>

          <Container maxWidth="lg">
            <Box sx={{mt:3}}>
              <ReadmeAttributes project={project}
                                actions={actions}
                                values={values}
                                onChange={onChange}/>
            </Box>
          </Container>

        </Box>
    );
}

function ensureActions (actions) {
    if (actions)
        return actions;

    return {
        item: {
            title: {
                click: (id, type)=> console.log(id),
            },
        },
        issue: {
            title: {
                click: (id, type)=> console.log(id),
            },
        },
    };
}
