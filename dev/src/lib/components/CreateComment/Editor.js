import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Editor (props) {
    return (
        <Box sx={{display:'flex'}}>
          <Box sx={{width:'50%'}}>
            <TextField label="Markdown"
                       multiline
                       rows={6}
                       value=""
                       onChange={()=>null}
                       sx={{background:'#fff'}}
                       fullWidth />
          </Box>

          <Box sx={{width:'50%'}}>
          </Box>
        </Box>
    );
}
