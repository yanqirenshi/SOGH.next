import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import Link from '../common/Link.js';

export default function Title (props) {
    const project = props.project;

    return (
        <Box style={{display:'flex', flexDirection: 'column', justifyContent:'center'}}>
          <Box style={{display:'flex', justifyContent:'center'}}>
            <S variant="h3">
              <span style={{marginRight:22}}>
                {project.title()}
              </span>

              <span>
                (
                <Link href={project.url()}>
                  {project.number()}
                </Link>
                )
              </span>
            </S>
          </Box>

          <Box sx={{display:'flex', justifyContent:'center'}}>
            <Paper sx={{m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>{project.public() ? "public" : "private"}</S>
            </Paper>

            <Paper sx={{m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>{project.creator().login}</S>
            </Paper>
          </Box>

          <S>{project.shortDescription()}</S>
        </Box>
    );
}
