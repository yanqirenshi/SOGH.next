import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function CreateComment (props) {
    return (
        <Box>
          <Box sx={{display:'flex'}}>
            <Box sx={{width:'50%'}}>
              <TextField id="outlined-multiline-static"
                         label="Markdown"
                         multiline
                         rows={6}
                         defaultValue="Default Value"
                         sx={{background:'#fff'}}
                         fullWidth />
            </Box>

            <Box sx={{width:'50%'}}>
            </Box>
          </Box>

          <Box sx={{mt:1}}>
            <Button variant="contained">Commit</Button>
          </Box>
        </Box>
    );
}
