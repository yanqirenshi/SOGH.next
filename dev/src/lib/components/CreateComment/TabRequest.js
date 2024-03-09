import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Parsons from './Parsons.js';
import Editor from './Editor.js';

export default function TabRequest (props) {
    const data = props.data;

    // console.log(data.parson);

    return (
        <Box>
          <Box sx={{display:'flex'}}>
            <Parsons/>

            <TextField type="date"
                       sx={{ml:2}}
                       size="small"
                       label="Next Action Date"
                       value={data.next_action_date}
                       onChange={()=> null}/>
          </Box>

          <Box sx={{mt:2}}>
            <Editor/>
          </Box>
        </Box>
    );
}
