import React from 'react';
import Box from '@mui/material/Box';

import Table from './projects_v2/Table.js';

export default function ProjectsV2 (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <Box sx={{pt:2, pb: 22}}>
          <Table data={data} sogh={sogh}/>
        </Box>
    );
}
