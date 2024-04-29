import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Editor from '../Editor.js';

export default function TabFinishToday (props) {
    const data = props.value;
    const onChange = props.onChange;
    const onClick = props.onClick;

    return (
        <Box>
          <Box sx={{display:'flex'}}>
            <TextField type="date"
                       size="small"
                       label="Next Action Date"
                       value={data.next_action_date}
                       defaultValue=""/>
          </Box>

          <Box sx={{mt:2}}>
            <Editor data={data} onChange={onChange}/>
          </Box>

          <Box sx={{mt:1}}>
            <Button variant="contained"
                    onClick={onClick}>
              {data.editor.button_label}
            </Button>
          </Box>
        </Box>
    );
}
