import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { DateTime } from 'luxon';

import Link from './common/Link.js';
import Comment from './common/Comment.js';
import UserName from './common/UserNameBlock.js';
import Label from './common/Label.js';

export default function IssueComment (props) {
    const comment = props.comment;

    return (
        <Box>

          <Head comment={comment}/>

          <Comment body={comment.body}
                   bodyHtml={comment.bodyHTML()}/>

          <Box sx={{
              display:'flex',
              justifyContent: 'space-between',
              mt:1,
          }}>
            <Button variant="outlined" size="small">Edit</Button>
            <Button variant="outlined" size="small">Delete</Button>
          </Box>
        </Box>
    );
}

function Head (props) {
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
