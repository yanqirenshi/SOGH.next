import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Title from './Issue/Title.js';
import SubTitle from './Issue/SubTitle.js';
import Operators from './Issue/Operators.js';

import FirstComment from './Issue/FirstComment.js';

import CreateComment from './CreateComment.js';

export default function Issue (props) {
    const issue = props.data;
    const actions = props.actions;

    const [is_view_description, setIsViewDescription] = React.useState(true);

    const clickCreate = (data)=> {
        actions.issue.comment.create(issue.id(), data);
    };

    return (
        <Box>
          <Title issue={issue}/>

          <SubTitle issue={issue}
                    view_description={is_view_description}
                    onChange={(v)=> setIsViewDescription(v)}
                    actions={actions}/>

          <Operators issue={issue}
                     view_description={is_view_description}
                     onChange={(v)=> setIsViewDescription(v)}
                     actions={actions}/>

          {is_view_description &&
           <Box sx={{mt:2}}>
             <FirstComment issue={issue}/>
           </Box>}

          <Card sx={{
              mt:2, pb:2,
          }}>
            <CreateComment actions={actions} onClick={clickCreate}/>
          </Card>

        </Box>
    );
}
