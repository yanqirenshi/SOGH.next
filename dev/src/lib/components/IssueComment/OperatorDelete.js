import React from 'react';

import Button from '@mui/material/Button';

export default function OperatorDelete (props) {
    const mode = props.mode;
    const onChange = props.onChange;
    const onClick = props.onClick;

    if ('delete'===mode)
        return (
            <>
              <Button variant="contained" size="small" color="error"
                      onClick={()=> onClick('delete')}
                      sx={{mr:3}}>
                Delete
              </Button>

              <Button variant="outlined" size="small"
                      onClick={()=> onChange('view')}>
                Cancel
              </Button>
            </>
        );

    return (
        <Button variant="text" size="small"
                onClick={()=> onChange('delete')}>
          Delete
        </Button>
    );
}
