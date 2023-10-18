import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import S from '@mui/material/Typography';

import Link from './common/Link.js';

export default function ProjectV2Item (props) {
    const item = props.item;

    if (!item)
        return null;

    const type = item.contentTypename();

    const project = item.project();

    return (
        <Box sx={{pt:3}}>
          <Box>
            <S>{project.title} (<Link href={project.url}>{project.number}</Link>)</S>
            <S variant="h4">{item.title()}</S>
          </Box>

          <Box sx={{mt: 1, display:'flex', flexWrap:'wrap'}}>
            <S>{item.planStart()}</S>
            <S>{item.planEnd()}</S>
          </Box>
        </Box>
    );
}
