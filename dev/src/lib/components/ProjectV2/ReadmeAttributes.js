import React from 'react';

import Box from '@mui/material/Box';

import Priority from './ReadmeAttributes/Priority.js';
import Term from './ReadmeAttributes/Term.js';

export default function ReadmeAttributes (props) {
    const project = props.project;

    return (
        <Box sx={{display:'flex', flexWrap: 'wrap', justifyContent:'center'}}>

          <Box>
            <Priority project={project}/>
          </Box>

          <Box sx={{ml:6}}>
            <Term project={project} type="plan"/>
          </Box>

          <Box sx={{display:'flex', alignItems:'center', ml:6}}>
            <Term project={project} type="result"/>
          </Box>

        </Box>
    );
}
