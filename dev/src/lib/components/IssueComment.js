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
    const edit_contents = props.edit_contents;

    const comment_id = comment.id();

    const data = edit_contents[comment_id];

    const mode = data ? data.mode : 'view';

    const value = edit_contents[comment_id] ? edit_contents[comment_id].value : comment.body();

    const onChange = actions.issue.comment.change;

    const clickUpdate = ()=> actions.issue.comment.update(comment_id, edit_contents);

    const clickDelete = ()=> actions.issue.comment.delete(comment_id);

    const changeMode = (m)=>
          onChange(changeEditContentMode(edit_contents, comment_id, value));

    const change = (new_value)=>
          onChange(changeEditContentValue (edit_contents, comment_id, new_value));

    return (
        <Box>

          <Head comment={comment}/>

          <Card>
            {'edit'!==mode &&
             <Comment bodyHtml={comment.bodyHTML()}/>}

            {'edit'===mode &&
             <MDEditor height={444}
                       value={data.value}
                       onChange={change}/>}
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

function changeEditContentMode (edit_contents, comment_id, value) {
    const new_edit_contents = {...edit_contents};

    if (!new_edit_contents[comment_id])
        new_edit_contents[comment_id] = makeEditContent(comment_id, value, 'view');

    if ('view'===new_edit_contents[comment_id].mode)
        new_edit_contents[comment_id].mode = 'edit';
    else
        new_edit_contents[comment_id].mode = 'view';

    return new_edit_contents;
}

function changeEditContentValue (edit_contents, comment_id, value) {
    const new_edit_contents = {...edit_contents};

    if (!new_edit_contents[comment_id])
        new_edit_contents[comment_id] = makeEditContent(comment_id, value, 'view');
    else
        new_edit_contents[comment_id].value = value;

    return new_edit_contents;
}

function makeEditContent (comment_id, value, mode) {
    return {
        id: comment_id,
        value: value || '',
        mode: mode || 'view',
    };
}
