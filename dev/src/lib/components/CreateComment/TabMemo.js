import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Editor from '../Editor.js';

export default function TabMemo (props) {
    const data = props.value;
    const onChange = props.onChange;
    const onClick = props.onClick;

    return (
        <Box>
          <Box sx={{mt:2, mb:1}}>
            <Editor data={data} onChange={onChange}/>
          </Box>

          <Button variant="contained"
                  onClick={onClick}>
              {data.editor.button_label}
          </Button>
        </Box>
    );
}
