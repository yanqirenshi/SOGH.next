import React from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

import Link from './Link.js';

export default function UserNameBox (props) {
    const user = props.user;
    const is_hide_label = props.hide_label;

    return (
        <Box style={{display:'flex', alignItems: 'center'}}>
          <Box sx={{marginRight:0.5}} title={user.name || user.login}>
            <Link href={user.url}>
              <Avatar sx={{width:24,height:24}}
                      alt={user.avatarUrl}
                      src={user.avatarUrl}/>
            </Link>
          </Box>

          {is_hide_label!==true &&
           <Box>
             {user.name || user.login}
           </Box>}
        </Box>
    );
}
