import React from 'react';

import Box from '@mui/material/Box';
import MDEditor from '@uiw/react-md-editor';

import BodyHtml from '../common/BodyHtml.js';
import OperatorEdit from '../IssueComment/OperatorEdit.js';

// Issue の本文の所。更新 (Edit・Commit・Cancel) だけで、削除のボタンは無い。(yanqirenshi/SOGH.next#119)
// Commit は、actions.issue.description.update(Issue の id, 本文) を呼ぶ。
export default function FirstComment (props) {
    const issue = props.issue;
    const actions = props.actions;

    const [mode, setMode] = React.useState('view');
    const [edit_contents, setEditContents] = React.useState(issue.body() || '');

    // Edit を押したときに、いまの本文を、編集の欄に入れ直す。
    // (Issue を取り直して本文が変わったあと・書きかけて Cancel したあとでも、いまの本文が出る)
    const changeMode = (m)=> {
        if ('edit'===m)
            setEditContents(issue.body() || '');

        setMode(m);
    };

    const clickUpdate = ()=> {
        setMode('view');
        actions.issue.description.update(issue.id(), edit_contents || '');
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

          <Box sx={{mt:1}}>
            <OperatorEdit mode={mode}
                          onChange={changeMode}
                          onClick={clickUpdate}
                          actions={actions}/>
          </Box>
        </Box>
    );
}

function View (props) {
    const issue = props.issue;

    const html = issue.bodyHTML();

    return (
        <Box sx={{background:'rgba(255,255,255,0.6)',
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
