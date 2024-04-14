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
    const is_view_description = props.view_description;
    const is_view_add_comment = props.view_add_comment;
    const members = props.members;

    const clickCreate = (data)=>
          actions.issue.comment.create(issue.id(), data);

    const changeView = (type, v)=> {
        if ('description'===type)
            actions.issue.description.changeView(v);
        else
            actions.issue.add_comment.changeView(v);
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

          {is_view_add_comment &&
           <Card sx={{mt:1, pb:2}}>
             <CreateComment actions={actions}
                            onClick={clickCreate}
                            members={members}/>
           </Card>}

          {is_view_description &&
           <Box sx={{mt:3, mt:2}}>
             <FirstComment issue={issue}
                           actions={actions}/>
           </Box>}

        </Box>
    );
}
