import React from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

import Link from './Link.js';

export default function UserNameBox (props) {
    // 人のモデル (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)。
    const user = props.user;
    const is_hide_label = props.hide_label;

    if (!user)
        return null;

    // Bot と Mannequin には name() が無い。
    const name = (user.name && user.name()) || user.login();

    return (
        <Box style={{display:'flex', alignItems: 'center'}}>
          <Box sx={{marginRight:0.5}} title={name}>
            <Link href={user.url()}>
              <Avatar sx={{width:24,height:24}}
                      alt={user.avatarUrl()}
                      src={user.avatarUrl()}/>
            </Link>
          </Box>

          {is_hide_label!==true &&
           <Box>
             {name}
           </Box>}
        </Box>
    );
}
