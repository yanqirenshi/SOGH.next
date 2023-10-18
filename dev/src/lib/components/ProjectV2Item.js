import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import S from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

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

          <Box sx={{display:'flex', mt: 4}}>
            <Box sx={{display:'flex', alignItems: 'center', mr:3}}>
              <S variant="h6" sx={{mr:1}}>
                Next Action Date:
              </S>

              <TextField required
                         type="date"
                         defaultValue=""
                         size="small"/>
            </Box>

            <Box sx={{display:'flex', alignItems: 'center', mr:3}}>
              <S variant="h6" sx={{mr:1}}>
                Due Date:
              </S>

              <TextField required
                         type="date"
                         defaultValue=""
                         size="small"/>
            </Box>
          </Box>

          <Box sx={{display:'flex', mt: 1}}>
            <Box sx={{display:'flex', alignItems: 'center', mr:3}}>
              <S variant="h6" sx={{mr:1}}>
                Point(Plan):
              </S>

              <S>99.99</S>
            </Box>

            <Box sx={{display:'flex', alignItems: 'center'}}>
              <S variant="h6" sx={{mr:1}}>
                Point(Results):
              </S>

              <S>99.99</S>
            </Box>
          </Box>

        </Box>
    );
}
