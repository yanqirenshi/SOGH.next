import React from 'react';

import Box from '@mui/material/Box';

import TableProjectV2Fields from '../common/TableProjectV2Fields.js';

export default function Fields (props) {
    const project = props.project;

    return (
        <Box>
          <TableProjectV2Fields project={project}/>
        </Box>
    );
}
