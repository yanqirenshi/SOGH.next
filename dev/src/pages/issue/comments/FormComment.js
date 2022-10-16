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
    const [text, setText] = React.useState('');

    return (
        <div style={style}>

          <TextField id="standard-multiline-flexible"
                     label="new Comment"
                     multiline
                     minRows={20}
                     style={{width:'100%'}}
                     value={text}
                     onChange={(e)=> setText(e.target.value)}
                     variant="standard" />

          <div style={{marginTop:11}}>
            <Stack spacing={2} direction="row">
              <Button variant="outlined">
                Clear
              </Button>

              <Button variant="contained">
                Create
              </Button>
            </Stack>
          </div>

        </div>
    );
}
