import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Editor from '../Editor.js';

export default function TabFinishToday (props) {
    const data = props.data;
    const onChange = props.onChange;

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
        </Box>
    );
}
