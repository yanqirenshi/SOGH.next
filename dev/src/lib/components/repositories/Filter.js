import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function Filter (props) {
    const value = props.value;
    const onChange = props.onChange;

    const change = (e)=> {
        const new_value = {...value};
        new_value.keyword = e.target.value;
        onChange(new_value);
    };

    const click = ()=> {
        const new_value = {...value};
        new_value.keyword = '';
        onChange(new_value);
    };

    return (
        <Box>
          <TextField label="Search Keyword" variant="outlined" size="small"
                     value={value.keyword}
                     onChange={change}/>

          {value.keyword.length > 0 &&
           <Button variant="outlined"
                   sx={{ml:1}}
                   onClick={click}>
             Clear
           </Button>}
        </Box>
    );
}
