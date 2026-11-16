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

    // edit_contents・actions は、渡されていなくても落ちない。(edit_contents が無いときは、空として扱う。yanqirenshi/SOGH.next#124)
    const edit_contents = props.edit_contents || {};

    const onChange = commentAction(actions, 'change');
    const onUpdate = commentAction(actions, 'update');
    const onDelete = commentAction(actions, 'delete');

    // 利用側の関数が無いときは、その関数が要るボタンを出さない。(何も無いときは、読むだけ)
    //   Edit (と、編集中の Cancel・Commit)   … change と update
    //   Delete (と、確かめの Delete・Cancel) … change と delete
    const can_edit   = !!(onChange && onUpdate);
    const can_delete = !!(onChange && onDelete);

    const comment_id = comment.id();

    const data = edit_contents[comment_id];

    const mode = modeOf(data, can_edit, can_delete);

    const value = edit_contents[comment_id] ? edit_contents[comment_id].value : comment.body();

    // update と delete は、actions.issue.comment の持ち物として呼ぶ。(関数の中の this が、actions.issue.comment になるように)
    // (ボタンは、can_edit・can_delete のときだけ出るので、ここでは actions.issue.comment がある)
    const clickUpdate = ()=> commentActionsOf(actions).update(comment_id, value);

    const clickDelete = ()=> commentActionsOf(actions).delete(comment_id);

    // Edit を押したとき (mode を edit にするとき) は、いまのコメントの本文で、中身を作り直す。
    // (書きかけて Cancel したあとや、コメントを取り直して本文が変わったあとに、古い中身が出ないように。yanqirenshi/SOGH.next#123)
    const changeMode = (new_mode)=>
          onChange('edit'===new_mode
                   ? startEditContent(edit_contents, comment_id, comment.body())
                   : changeEditContentMode(edit_contents, comment_id, new_mode, value));

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

          {(can_edit || can_delete) &&
           <Box sx={{
               display:'flex',
               justifyContent: 'space-between',
               mt:1,
           }}>

             <Box>
               {can_edit &&
                <OperatorEdit mode={mode}
                              onChange={changeMode}
                              onClick={clickUpdate}
                              actions={actions}/>}
             </Box>

             <Box>
               {can_delete &&
                <OperatorDelete mode={mode}
                                onChange={changeMode}
                                onClick={clickDelete}
                                actions={actions}/>}
             </Box>

           </Box>}

        </Box>
    );
}

// actions.issue.comment の、名前が name の関数。
// actions・actions.issue・actions.issue.comment のどの段が無くても、関数でないもの (null など) が入っていても、null。(yanqirenshi/SOGH.next#124)
function commentAction (actions, name) {
    const comment_actions = commentActionsOf(actions);

    if (!comment_actions)
        return null;

    const fn = comment_actions[name];

    return typeof fn === 'function' ? fn : null;
}

// actions.issue.comment。どの段が無くても、落ちずに null か undefined。
function commentActionsOf (actions) {
    return actions && actions.issue && actions.issue.comment;
}

// 表示の mode。(view・edit・delete)
// edit_contents の mode が edit・delete でも、そのボタンが出せない (関数が無い) ときは、view にする。(編集の欄や、確かめのボタンだけが出ないように)
function modeOf (data, can_edit, can_delete) {
    const mode = data ? data.mode : 'view';

    if ('edit'===mode && !can_edit)
        return 'view';

    if ('delete'===mode && !can_delete)
        return 'view';

    return mode;
}

function changeEditContentMode (edit_contents, comment_id, mode, value) {
    const new_edit_contents = cp(edit_contents);

    if (!new_edit_contents[comment_id])
        new_edit_contents[comment_id] = makeEditContent(comment_id, value, mode);
    else
        new_edit_contents[comment_id].mode = mode;

    return new_edit_contents;
}

// 編集を始めるときの edit_contents。(写しを作り、このコメントの中身だけを、本文 body で作り直す。ほかのコメントの中身は、そのまま)
// 本文が null のときは、空の文字。(makeEditContent が '' にする。yanqirenshi/SOGH.next#123)
function startEditContent (edit_contents, comment_id, body) {
    const new_edit_contents = cp(edit_contents);

    new_edit_contents[comment_id] = makeEditContent(comment_id, body, 'edit');

    return new_edit_contents;
}

function changeEditContentValue (edit_contents, comment_id, value) {
    const new_edit_contents = cp(edit_contents);

    if (!new_edit_contents[comment_id])
        new_edit_contents[comment_id] = makeEditContent(comment_id, value, 'view');
    else
        new_edit_contents[comment_id].value = value;

    return new_edit_contents;
}

function cp (v) {
    return JSON.parse(JSON.stringify(v));
}

function makeEditContent (comment_id, value, mode) {
    return {
        id: comment_id,
        value: value || '',
        mode: mode || 'view',
    };
}
