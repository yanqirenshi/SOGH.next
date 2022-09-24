import React from 'react';

import Box from '@mui/material/Box';

const style ={
    background: 'rgba(254, 244, 244, 1.0)',
    width: '100%',
    height: '100%',
};

export default function Contents (props) {
    const comments = props.comments;
    const view = props.view;

    return (
        <Box sx={style}>
          {'comments' && null}
          {'part' && null}
          {'project' && null}
          {'milestone' && null}
        </Box>
    );
}
