import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Editor from './Editor.js';

export default function TabMemo (props) {
    return (
        <Box>
          <Box sx={{mt:2}}>
            <Editor/>
          </Box>
        </Box>
    );
}
