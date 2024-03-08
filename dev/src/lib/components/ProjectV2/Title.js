import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';

import Link from '../common/Link.js';

export default function Title (props) {
    const project = props.project;

    return (
        <Box style={{display:'flex', flexDirection: 'column', justifyContent:'center'}}>
          <Box style={{display:'flex', justifyContent:'center'}}>
            <S variant="h3" sx={{mr:6}}>
              {project.type()}
            </S>

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
            <Chip label={project.creator().login}
                  sx={{m:1}}/>

            <Chip label={project.release()}
                  sx={{m:1}}/>

            <Chip label={project.public() ? "public" : "private"}
                  sx={{m:1}}/>
          </Box>

          <S>{project.shortDescription()}</S>
        </Box>
    );
}
