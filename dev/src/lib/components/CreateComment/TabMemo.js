import React from 'react';

import Box from '@mui/material/Box';

import Editor from '../Editor.js';

export default function TabMemo (props) {
    const data = props.data;
    const onChange = props.onChange;

    return (
        <Box>
          <Box sx={{mt:2}}>
            <Editor data={data} onChange={onChange}/>
          </Box>
        </Box>
    );
}
