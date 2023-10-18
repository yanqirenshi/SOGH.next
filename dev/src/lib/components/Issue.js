import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import {DateTime} from 'luxon';

import Link from './common/Link.js';
import Comment from './common/Comment.js';
import UserName from './common/UserNameBlock.js';
import Label from './common/Label.js';

export default function Issue (props) {
    const issue = props.data;
    const comments = props.comments || [];

    // TODO: これは表示する必要はないかも。。。
    const milestone = issue.milestone();

    return (
        <Box>
          <Box sx={{mt: 3}}>
            <S variant="h5">
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

          <Box sx={{mt:1, display: 'flex'}}>
            <Box sx={{m:1}}>
              <S>
                <span>{milestone.title}</span>
                <span style={{marginLeft:11}}>
                  (
                  <Link href={milestone.url}>
                    {milestone.number}
                  </Link>
                  )
                </span>
              </S>
            </Box>

            <Box sx={{m:1}}>
              {issue.assignees().map(assignee=> {
                  return (
                      <Box key={assignee.id}>
                        <Link href={milestone.url}>
                          <img width="17px" height="17px"
                               src={assignee.avatarUrl}/>
                        </Link>
                        <span>{assignee.name || assignee.login}</span>
                      </Box>
                  );
              })}
            </Box>

            <Box sx={{m:1}}>
              {issue.labels().map(label=> <Label value={label}/>)}
            </Box>
          </Box>

          <Box sx={{mt:3}}>
            <Comment body={issue.body}
                     bodyHtml={issue.bodyHTML()}/>
          </Box>

          <Box sx={{mt:3}}>
            {comments.map(comment=> {
                const author = comment.author();
                const dt = DateTime.fromJSDate(new Date(comment.publishedAt()));

                return (
                    <Box key={comment.id()}
                         sx={{display:'flex'}}>

                      <Box sx={{pt:2, pl:3, pr:3, display:'flex', flexDirection: 'column'}}>
                        <S>{dt.toFormat('yyyy-MM-dd EEE')}</S>
                        <S>{dt.toFormat('HH:mm:ss')}</S>
                      </Box>

                      <Box sx={{flexGrow: 1, pb: 6}}>
                        <Box sx={{mb:0.5, pl:0.5}}>
                          <UserName user={author}/>
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
        </Box>
    );
}
