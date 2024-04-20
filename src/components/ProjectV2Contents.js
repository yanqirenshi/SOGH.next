import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Title from './ProjectV2/Title.js';

export default function ProjectV2Contents (props) {
    const project = props.project;

    if (!project)
        return null;

    return (
        <Box sx={{pt:3}}>

          <Container maxWidth="xl">
            <Title project={project}/>
          </Container>

        </Box>
    );
}
