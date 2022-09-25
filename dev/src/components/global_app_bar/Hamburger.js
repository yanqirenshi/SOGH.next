import React from 'react';

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Hamburger (props) {
    return (
        <IconButton size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
    );
}
