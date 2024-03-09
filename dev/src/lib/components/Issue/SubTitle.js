import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import Label from '../common/Label.js';

import {DateTime} from 'luxon';

import Link from '../common/Link.js';

export default function SubTitle (props) {
    const issue = props.issue;

    // TODO: これは表示する必要はないかも。。。
    const milestone = issue.milestone();

    return (
        <Box sx={{mt:0.5, display: 'flex'}}>
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
    );
}
