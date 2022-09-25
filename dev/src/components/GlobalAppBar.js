import React from 'react';
import { useDispatch } from 'react-redux';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import Hamburger from './global_app_bar/Hamburger.js';
import Title from './global_app_bar/Title.js';

import sogh from '../sogh.js';

import { open } from '../slices/modals.js';

export default function GlobalAppBar (props) {
    const data = props.data;
    const mode = props.mode;

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
              <Hamburger />

              <Title mode={mode} data={data}/>

              {user && (
                  <Avatar alt={user.login()} src={user.avatarUrl()} />
              )}
            </Toolbar>
          </AppBar>
        </Box>
    );
}
