import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import Link from '../common/Link.js';

export default function Title (props) {
    const issue = props.issue;

    // console.log(issue.projects());

    const repository = issue.repository();

    return (
        <Box sx={{mt: 3}}>
          <S>
            <Link href={repository.url}>
              {repository.name}
            </Link>
          </S>

          <S variant="h3">

            <span>{issue.title()}</span>

            <span style={{marginLeft:11}}>
              (
              <Link href={issue.url()}>
                {issue.number()}
              </Link>
              )
            </span>

          </S>
        </Box>
    );
}
