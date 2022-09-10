import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

export default (props)=> {
    const data = props.data;

    return (
        <div>
          {list(data)}
        </div>
    );
}

function list (data) {
    return (
        <Box sx={{width: 'auto'}}
             role="presentation">
          <List>
            {data.map((d,i)=> {
                return (
                    <ListItem key={d.label} disablePadding>
                      <ListItemButton>
                        {/* <ListItemIcon> */}
                        {/*   {i % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                        {/* </ListItemIcon> */}

                        <ListItemText primary={d.label} />
                      </ListItemButton>
                    </ListItem>
                );
            })}
          </List>
        </Box>
    );
}
