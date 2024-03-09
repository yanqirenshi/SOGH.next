import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import {DateTime} from 'luxon';

import Link from './common/Link.js';
import Comment from './common/Comment.js';
import UserName from './common/UserNameBlock.js';
import Label from './common/Label.js';

import Title from './Issue/Title.js';
import SubTitle from './Issue/SubTitle.js';

export default function Issue (props) {
    const issue = props.data;

    return (
        <Box>
          <Title issue={issue}/>

          <SubTitle issue={issue}/>

          <Box sx={{mt:3}}>
            <Comment body={issue.body}
                     bodyHtml={issue.bodyHTML()}/>
          </Box>

        </Box>
    );
}
