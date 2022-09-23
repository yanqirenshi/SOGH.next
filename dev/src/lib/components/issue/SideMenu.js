import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const style ={
    height: 'auto',
};

export default function SideMenu (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <Box style={style}>
          {Menu('Comments')}
          {Menu('PART')}
          {Menu('Project')}
          {Menu('Milestone')}
        </Box>
    );
}

function Menu (label) {
    const style = {
        margin: 8,
        padding: 11,
    };

    return (
        <Paper elevation={3} style={style}>
          {label}
        </Paper>
    );
}
