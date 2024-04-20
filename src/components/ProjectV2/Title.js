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
            <Box>
              <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                <S sx={{mr:6}}>
                  {project.type()}
                </S>

                <S>
                  {project.id()}
                </S>
              </Box>

              <Box sx={{mt:1}}>
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
            </Box>
          </Box>

          <Box sx={{display:'flex', justifyContent:'center'}}>
            <Chip title="Created At"
                  label={project.creator().login}
                  sx={{m:1}}/>

            <Chip title="Scope"
                  label={project.public() ? "public" : "private"}
                  sx={{m:1}}/>
          </Box>

          <S>{project.shortDescription()}</S>
        </Box>
    );
}
