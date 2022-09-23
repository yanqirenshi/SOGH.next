import React from 'react';
import { useDispatch } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import Avatar from '@material-ui/core/Avatar';

import sogh from '../sogh.js';

import { open } from '../slices/modals.js';

export default function GlobalAppBar (props) {
    const title = props.title;

    const dispatch = useDispatch();

    const clickConnect = ()=> dispatch(open({
        code: 'connect_github',
        data: { token: '' },
    }));

    const user = sogh.viewer();

    return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton size="large"
                          edge="start"
                          color="inherit"
                          aria-label="menu"
                          sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {title}
              </Typography>

              {user && (
                  null
                  /* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" /> */
              )}
            </Toolbar>
          </AppBar>
        </Box>
    );
}
