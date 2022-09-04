import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../slices/github.js';
import { open } from '../slices/modals.js';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import SOGH from '../sogh.js';

export default function GlobalAppBar (props) {
    const modals = useSelector(state => state.modals);
    const dispatch = useDispatch();

    const title = props.title;

    const clickConnect = ()=> dispatch(open({
        code: 'connect_github',
        data: { token: '' },
    }));

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

              {!SOGH.isConnected() && (
                  <Button color="inherit" onClick={clickConnect}>
                    Connect
                  </Button>
              )}
            </Toolbar>
          </AppBar>
        </Box>
    );
}
