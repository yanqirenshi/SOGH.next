import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Parsons from './Parsons.js';
import Editor from '../Editor.js';

export default function TabRequest (props) {
    const members = props.members;
    const data = props.value;
    const onChange = props.onChange;
    const onClick = props.onClick;

    return (
        <Box>
          <Box sx={{display:'flex'}}>
            <Parsons members={members}
                     value={data.to_parson}
                     onChange={(e)=> onChange(data.code, 'parson', e.target.value)}/>

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

          <Box sx={{mt:1}}>
            <Button variant="contained"
                    onClick={onClick}>
              {data.editor.button_label}
            </Button>
          </Box>
        </Box>
    );
}
