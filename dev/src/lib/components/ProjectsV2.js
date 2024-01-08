import React from 'react';
import Box from '@mui/material/Box';

import Table from './projectsV2/Table.js';

export default function ProjectsV2 (props) {
    const data = props.data;
    const sogh = props.sogh;

    const actions = props.actions || defaultActions();

    return (
        <Box sx={{pt:2, pb: 22}}>
          <Table data={data}
                 sogh={sogh}
                 actions={actions}/>
        </Box>
    );
}

function defaultActions () {
    return {
        title: {
            click: (project_id)=> project_id,
        },
    };
}
