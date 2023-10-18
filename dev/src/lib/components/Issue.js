import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import Link from './common/Link.js';

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
              {issue.labels().map(label=> {
                  return (
                      <Box key={label.id}
                           sx={{
                               display: 'inline-block',
                               background:'#'+label.color,
                           }}>
                        <Link href={milestone.url}>
                          {label.name}
                        </Link>
                      </Box>
                  );
              })}
            </Box>
          </Box>

          <Box sx={{mt:3}}>
            <div dangerouslySetInnerHTML={{
                __html: issue.bodyHTML()
            }}/>
          </Box>

          <Box sx={{mt:3}}>
            issue comments
          </Box>
        </Box>
    );
}
