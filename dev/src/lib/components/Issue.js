import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Comment from './common/Comment.js';

import Title from './Issue/Title.js';
import SubTitle from './Issue/SubTitle.js';
import CreateComment from './CreateComment.js';

export default function Issue (props) {
    const issue = props.data;

    const [is_view_description, setIsViewDescription] = React.useState(true);

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

          <Card sx={{
              mt:6, pb:2,
          }}>
            <CreateComment/>
          </Card>

        </Box>
    );
}
