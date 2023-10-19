import React from 'react';

import Box from '@mui/material/Box';

import BodyHtml from './BodyHtml.js';

export default function Comment (props) {
    const body = props.body;
    const bodyHtml = props.bodyHtml;

    return (
        <Box>
          <Box sx={{
              background:'rgba(234, 228, 208, 0.3)',
              p: 0.5,
              borderRadius: 1,
          }}>
            <Box sx={{
                background:'#fff',
                pt:0.5, pb:0.5, pl:3, pr:3,
                borderRadius: 0.8,
            }}>
              <BodyHtml value={bodyHtml}/>
            </Box>
          </Box>
        </Box>
    );
}
