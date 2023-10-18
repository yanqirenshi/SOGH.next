import React from 'react';

import Box from '@mui/material/Box';
import Link from './Link.js';

export default function Label (props) {
    const label = props.value;

    return (
        <Box key={label.id}
             sx={{
                 display: 'inline-block',
                 background:'#'+label.color,
                 pt: 0.1, pb: 0.1,
                 pl: 1, pr: 1,
                 borderRadius: 1,
                 ml: 0.2, mr: 0.2,
             }}>

          <Link href={label.url}>
            {label.name}
          </Link>
        </Box>
    );
}
