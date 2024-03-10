import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import Comment from './common/Comment.js';

import Head from './IssueComment/Head.js';
import OperatorEdit from './IssueComment/OperatorEdit.js';
import OperatorDelete from './IssueComment/OperatorDelete.js';

import MDEditor from '@uiw/react-md-editor';

export default function IssueComment (props) {
    const comment = props.comment;
    const actions = props.actions;

    const [mode, setMode] = React.useState('view');
    const [edit_contents, setEditContents] = React.useState(null);

    const changeMode = (m)=> setMode(m);

    const click = (type)=> console.log(type);

    if ('edit'===mode && null===edit_contents)
        setEditContents(comment.body());

    const clickUpdate = ()=> {
        setMode('view');
        actions.issue.comment.update(comment.id(), edit_contents);
    };
    const clickDelete = ()=> {
        setMode('view');
        actions.issue.comment.delete(comment.id());
    };

    return (
        <Box>

          <Head comment={comment}/>

          <Card>
            {'edit'!==mode &&
             <Comment bodyHtml={comment.bodyHTML()}/>}

            {'edit'===mode &&
             <MDEditor height={444}
                       value={edit_contents || ''}
                       onChange={(v)=> setEditContents(v)}/>}
          </Card>

          <Box sx={{
              display:'flex',
              justifyContent: 'space-between',
              mt:1,
          }}>

            <Box>
              <OperatorEdit mode={mode}
                            onChange={changeMode}
                            onClick={clickUpdate}
                            actions={actions}/>
            </Box>

            <Box>
              <OperatorDelete mode={mode}
                              onChange={changeMode}
                              onClick={clickDelete}
                              actions={actions}/>
            </Box>

          </Box>

        </Box>
    );
}
