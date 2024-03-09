import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import {DateTime} from 'luxon';

import Link from './common/Link.js';
import Comment from './common/Comment.js';
import UserName from './common/UserNameBlock.js';
import Label from './common/Label.js';

import Title from './Issue/Title.js';
import SubTitle from './Issue/SubTitle.js';
import CreateComment from './Issue/CreateComment.js';

export default function Issue (props) {
    const issue = props.data;

    const [is_view_description, setIsViewDescription] = React.useState(true);

    const handleFormat = (event, v) => setIsViewDescription(v);

    return (
        <Box>
          <Title issue={issue}/>

          <SubTitle issue={issue}
                    view_description={is_view_description}
                    onChange={(v)=> setIsViewDescription(v)}/>

          <Box sx={{mt:2}}>
            {is_view_description &&
             <Box sx={{mt:1}}>
               <Comment body={issue.body}
                        bodyHtml={issue.bodyHTML()}/>
             </Box>}
          </Box>

          <Box sx={{mt:6}}>
            <CreateComment/>
          </Box>

        </Box>
    );
}
