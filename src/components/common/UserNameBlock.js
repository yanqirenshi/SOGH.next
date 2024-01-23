import React from 'react';

import Link from './Link.js';
import Box from '@mui/material/Box';

export default function UserNameBox (props) {
    const user = props.user;

    return (
        <Box style={{display:'flex', alignItems: 'center'}}>
          <Box sx={{marginRight:0.5, width:21, height:21}}>
            <Link href={user.url}
                  style={{width:21,height:21}}>
              <img src={user.avatarUrl}
                   alt={user.avatarUrl}
                   style={{width:21,height:21}}/>
            </Link>
          </Box>

          <Box>
            {user.name || user.login}
          </Box>
        </Box>
    );
}
