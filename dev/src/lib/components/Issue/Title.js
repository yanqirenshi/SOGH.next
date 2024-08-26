import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import Link from '../common/Link.js';

export default function Title (props) {
    const issue = props.issue;

    const repository = issue.repository();

    const color = issue.closedAt() ? '#aaa' : null;

    return (
        <Box sx={{mt: 3, color: color}}>

          <S variant="h3">
            <span>{issue.title()}</span>

            <span style={{marginLeft:11}}>
              (
              <Link href={issue.url()} style={color ? {color: color} : null}>
                {issue.number()}
              </Link>
              )
            </span>
          </S>

        </Box>
    );
}
