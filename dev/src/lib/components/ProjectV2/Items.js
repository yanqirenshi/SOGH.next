import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import TableProjectV2Items from '../common/TableProjectV2Items.js';

export default function Items (props) {
    const items = props.items;
    const project = props.project;

    return (
        <Box sx={{pb:22}}>
          <TableProjectV2Items items={items} project={project}/>
        </Box>
    );
}
