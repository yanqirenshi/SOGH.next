import React from 'react';

import Box from '@mui/material/Box';
import MDEditor from '@uiw/react-md-editor';

import BodyHtml from '../common/BodyHtml.js';
import OperatorEdit from '../IssueComment/OperatorEdit.js';
import OperatorDelete from '../IssueComment/OperatorDelete.js';

export default function FirstComment (props) {
    const issue = props.issue;
    const actions = props.actions;

    const [mode, setMode] = React.useState('view');
    const [edit_contents, setEditContents] = React.useState(issue.body());

    const changeMode = (m)=> setMode(m);

    const clickUpdate = ()=> {
        setMode('view');
        actions.issue.comment.update(issue.id(), edit_contents);
    };
    const clickDelete = ()=> {
        setMode('view');
        actions.issue.comment.delete(issue.id());
    };

    return (
        <Box>
          {'edit'!==mode &&
           <View issue={issue}/>}

          {'edit'===mode &&
           <Box sx={{background:'rgba(255,255,255,0.3)',
                     borderRadius: 2}}>
             <MDEditor height={444}
                       value={edit_contents || ''}
                       onChange={(v)=> setEditContents(v)}/>
           </Box>}

          <Box sx={{display:'flex',
                    justifyContent: 'space-between',
                    mt:1}}>

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

function View (props) {
    const issue = props.issue;

    const html = issue.bodyHTML();

    return (
        <Box sx={{background:'rgba(255,255,255,0.3)',
                  pt:0.5, pb:1, pl:2, pr:2,
                  borderRadius: 2}}>
          {html.trim().length > 0 &&
           <BodyHtml value={html}/>}

          {html.trim().length===0 &&
           <Box sx={{p:2, color:'#aaa'}}>
             Issue の First Comment は空です。
           </Box>}
        </Box>
    );
}
