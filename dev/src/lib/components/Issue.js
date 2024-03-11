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

    const [is_view_description, setIsViewDescription] = React.useState(false);
    const [is_view_add_comment, setIsViewAddComment] = React.useState(false);

    const clickCreate = (data)=> {
        actions.issue.comment.create(issue.id(), data);
    };

    const changeView = (type, v)=> {
        if ('description'===type)
            setIsViewDescription(v);
        else
            setIsViewAddComment(v);
    };

    return (
        <Box>
          <Title issue={issue}/>

          <SubTitle issue={issue}
                    view_description={is_view_description}
                    onChange={changeView}
                    actions={actions}/>

          <Operators issue={issue}
                     view_description={is_view_description}
                     view_add_comment={is_view_add_comment}
                     onChange={changeView}
                     actions={actions}/>

          {is_view_description &&
           <Box sx={{mt:2}}>
             <FirstComment issue={issue}
                           actions={actions}/>
           </Box>}

          {is_view_add_comment &&
           <Card sx={{mt:3, pb:2}}>
             <CreateComment actions={actions}
                            onClick={clickCreate}/>
           </Card>}

        </Box>
    );
}
