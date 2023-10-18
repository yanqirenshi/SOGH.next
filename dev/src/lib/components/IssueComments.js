import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import {DateTime} from 'luxon';

import Link from './common/Link.js';
import Comment from './common/Comment.js';
import UserName from './common/UserNameBlock.js';
import Label from './common/Label.js';

export default function IssueComments (props) {
    const comments = props.comments || [];

    return (
        <Box sx={{mt:3}}>
          {comments.map(comment=> {
              const author = comment.author();
              const dt = DateTime.fromJSDate(new Date(comment.publishedAt()));

              return (
                  <Box key={comment.id()}
                       sx={{display:'flex'}}>

                    <Box sx={{flexGrow: 1, pb: 6}}>
                      <Box sx={{mb:0.5, pl:0.5, display:'flex'}}>
                        <UserName user={author}/>
                        <S sx={{ml:3}}>
                          {dt.toFormat('yyyy-MM-dd EEE HH:mm:ss')}
                        </S>
                      </Box>

                      <Box>
                        <Comment body={comment.body}
                                 bodyHtml={comment.bodyHTML()}/>
                      </Box>
                    </Box>

                  </Box>
              );
          })}
        </Box>
    );
}
