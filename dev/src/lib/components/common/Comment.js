import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import BodyHtml from './BodyHtml.js';

export default function Comment (props) {
    const body = props.body;
    const bodyHtml = props.bodyHtml;

    return (
        <Card>
          <Box sx={{
              background:'#fff',
              pt:0.5, pb:1, pl:2, pr:2,
          }}>
            <BodyHtml value={bodyHtml}/>
          </Box>
        </Card>
    );
}
