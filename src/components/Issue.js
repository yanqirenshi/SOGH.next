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
            {milestone &&
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
             </Box>}

            <Box sx={{m:1, display: 'flex'}}>
              {issue.assignees().map(assignee=> {
                  return (
                      <Box key={assignee.id}>
                        <Link href={assignee.url}>
                          <img width="17px" height="17px"
                               src={assignee.avatarUrl}/>
                        </Link>
                        <span>{assignee.name || assignee.login}</span>
                      </Box>
                  );
              })}
            </Box>

            <Box sx={{m:1, display: 'flex'}}>
              {issue.labels().map(label=> <Label key={label.id} value={label}/>)}
            </Box>
          </Box>

          <Box sx={{mt:3}}>
            <Comment body={issue.body}
                     bodyHtml={issue.bodyHTML()}/>
          </Box>

        </Box>
    );
}
