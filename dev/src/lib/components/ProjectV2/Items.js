import React from 'react';

import Box from '@mui/material/Box';

import TableProjectV2Items from '../common/TableProjectV2Items.js';

export default function Items (props) {
    const items = props.items;

    return (
        <Box sx={{pb:22}}>
          <TableProjectV2Items items={items}/>
        </Box>
    );
}
