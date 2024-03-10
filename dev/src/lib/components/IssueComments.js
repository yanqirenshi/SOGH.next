import React from 'react';
import moment from 'moment';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import IssueComment from './IssueComment.js';

export default function IssueComments (props) {
    const comments = props.comments || [];
    const actions = props.actions;

    let comment_before = null;
    return (
        <Box sx={{mt:6}}>
          {comments.map(comment=> {
              const distance = Distance(comment, comment_before);

              comment_before = comment;

              return (
                  <Box key={comment.id()}>
                    {distance}
                    <IssueComment key={comment.id()}
                                  comment={comment}
                                  actions={actions}/>
                  </Box>
              );
          })}
        </Box>
    );
}

function Distance (current, before) {
    if (!before)
        return null;

    const d_current = moment(current.createdAt());
    const d_before = moment(before.createdAt());

    const distance = Math.ceil(d_before.diff(d_current) / 1000,0);

    const distance_day = Math.floor(distance / (60 * 60 * 24));
    const distance_remainder = distance % (60 * 60 * 24);
    const distance_h = Math.ceil(distance_remainder / (60 * 60));

    return (
        <Box sx={{mt: 2, mb:3, pl: 11}}>
          <S variant="h5" sx={{color:'#ddd', display:'flex', alignItems: 'center'}}>
            <ArrowUpwardIcon sx={{mr:2, color:'#aaa'}}/>

            {distance_day > 0 &&
             <span style={{marginRight:6}}>
               {distance_day}日
             </span>}
            {distance_h > 0 &&
             <span>
               {distance_h}時間
             </span>}
          </S>
        </Box>
    );
}
