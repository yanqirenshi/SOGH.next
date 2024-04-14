import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Parsons from './Parsons.js';
import Editor from '../Editor.js';

export default function TabRequest (props) {
    const data = props.data;
    const onChange = props.onChange;
    const members = props.members;

    return (
        <Box>
          <Box sx={{display:'flex'}}>
            <Parsons type="to_parson"
                     members={members}
                     value={data.to_parson}
                     onChange={(e)=> onChange(data.code, 'to_parson', e.target.value)}/>

            <TextField type="date"
                       sx={{ml:2}}
                       size="small"
                       label="Next Action Date"
                       value={data.next_action_date}
                       onChange={(e)=> onChange(data.code, 'next_action_date', e.target.value)}/>
          </Box>

          <Box sx={{mt:2}}>
            <Editor data={data} onChange={onChange}/>
          </Box>
        </Box>
    );
}
