import React from 'react';

import Box from '@mui/material/Box';

import BodyHtml from '../common/BodyHtml.js';


export default function FirstComment (props) {
    const issue = props.issue;

    return (
        <Box>
          <Box sx={{
              background:'rgba(255,255,255,0.3)',
              pt:0.5, pb:1, pl:2, pr:2,
              borderRadius: 2,
          }}>
            <BodyHtml value={issue.bodyHTML()}/>
          </Box>
        </Box>
    );
}
