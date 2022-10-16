import React from 'react';

import TextField from '@mui/material/TextField';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const style = {
    width: '97.5%',
    background: '#fff',
    padding: 11,
    marginBottom: 33,
};

export default function FormComment (props) {
    const value = '';

    const onChange = ()=> null;

    return (
        <div style={style}>

          <TextField id="standard-multiline-flexible"
                     label="new Comment"
                     multiline
                     minRows={20}
                     style={{width:'100%'}}
                     value={value}
                     onChange={onChange}
                     variant="standard" />

          <div style={{marginTop:11}}>
            <Stack spacing={2} direction="row">
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
            </Stack>
          </div>

        </div>
    );
}
