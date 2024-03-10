import React from 'react';

import Button from '@mui/material/Button';

export default function OperatorEdit (props) {
    const mode = props.mode;
    const onChange = props.onChange;
    const onClick = props.onClick;

    if ('edit'===mode)
        return (
            <>
              <Button variant="outlined" size="small"
                      sx={{mr:3}}
                      onClick={()=> onChange('view')}>
                Cancel
              </Button>

              <Button variant="contained" size="small" color="error"
                      onClick={()=> onClick('commit')}>
                Commit
              </Button>
            </>
        );

    return (
        <Button variant="text" size="small"
                onClick={()=> onChange('edit')}>
          Edit
        </Button>
    );
}
