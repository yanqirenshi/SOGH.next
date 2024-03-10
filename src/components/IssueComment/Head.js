import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import { DateTime } from 'luxon';

import Link from '../common/Link.js';
import UserName from '../common/UserNameBlock.js';

export default function Head (props) {
    const comment = props.comment;

    const author = comment.author();
    const dt = DateTime.fromJSDate(new Date(comment.publishedAt()));

    return (
        <Box sx={{
            mb:0.5, pl:0.5,
            display:'flex',
        }}>

          <S sx={{mr:2}}>
            <Link href={comment.url()}>
              {dt.toFormat('yyyy-MM-dd EEE HH:mm:ss')}
            </Link>
          </S>

          <UserName user={author} hide_label={true}/>

        </Box>
    );
}
