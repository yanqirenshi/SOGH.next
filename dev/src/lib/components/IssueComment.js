import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import { DateTime } from 'luxon';

import Link from './common/Link.js';
import Comment from './common/Comment.js';
import UserName from './common/UserNameBlock.js';
import Label from './common/Label.js';

export default function IssueComment (props) {
    const comment = props.comment;

    const author = comment.author();
    const dt = DateTime.fromJSDate(new Date(comment.publishedAt()));

    return (
        <Box>

          <Box sx={{mb:0.5, pl:0.5, display:'flex'}}>
            <UserName user={author}/>

            <S sx={{ml:3}}>
              <Link href={comment.url()}>
                {dt.toFormat('yyyy-MM-dd EEE HH:mm:ss')}
              </Link>
            </S>
          </Box>

          <Comment body={comment.body}
                   bodyHtml={comment.bodyHTML()}/>

        </Box>
    );
}
