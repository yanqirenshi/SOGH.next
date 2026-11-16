import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Operators (props) {
    const issue = props.issue;
    const item = props.item || null;
    const is_view_description = props.view_description;
    const is_view_add_comment = props.view_add_comment;
    const onChange = props.onChange;
    const actions = props.actions;

    // 日付を読む所と、書き換えるときに利用側へ渡す値。Item を渡されたときは、その Item から読む。(yanqirenshi/SOGH.next#114)
    const source = item || issue;

    const changeNextActionDate = (e)=> {
        const field = source.fieldValueContents('NextAction.Date');

        // 書き換えに要る情報が作れないとき (Item が無い・その日付の値が無い) は、利用側の関数を呼ばない。
        if (!field)
            return;

        actions.issue.next_action_date.change(
            e.target.value,
            field.project,
            field.item,
            field.field_item,
            field.value,
        );
    };

    const changeDueDate = (e)=> {
        const field = source.fieldValueContents('Due.Date');

        if (!field)
            return;

        actions.issue.due_date.change(
            e.target.value,
            field.project,
            field.item,
            field.field_item,
            field.value,
        );
    };

    const clickRefresh = ()=> {
        actions.issue.refresh(
            issue.id(),
            issue.repository().owner().login(),
            issue.repository().name(),
            issue.number(),
        );
    };

    return (
        <Box sx={{mt:0.5}}>

          <Box sx={{display: 'flex'}}>

            <Box sx={{m:1, mr:2}}>
              <Button variant="outlined"
                      onClick={clickRefresh} >
                <RefreshIcon/>
              </Button>
            </Box>

            <Box sx={{m:1}}>
              <Button variant={is_view_add_comment ? "outlined" : "contained"}
                      onClick={()=> onChange('add_comment', !is_view_add_comment)}>
                add Comment
              </Button>

              <Button sx={{ml:1}}
                      variant={is_view_description ? "outlined" : "contained"}
                      onClick={()=> onChange('description', !is_view_description)}>
                Description
              </Button>
            </Box>

            <Box sx={{m:1}}>
              <TextField size="small"
                         sx={{
                             "& .MuiOutlinedInput-root": {
                                 height: '36.34px',
                             }
                         }}
                         type="date"
                         label="Next Action Date"
                         variant="outlined"
                         slotProps={{
                             inputLabel: { shrink: true },
                         }}
                         value={source.nextActionDate() || ''}
                         onChange={changeNextActionDate} />
            </Box>

            <Box sx={{m:1}}>
              <TextField size="small"
                         sx={{
                             "& .MuiOutlinedInput-root": {
                                 height: '36.34px',
                             }
                         }}
                         type="date"
                         label="Due Date"
                         variant="outlined"
                         slotProps={{
                             inputLabel: { shrink: true },
                         }}
                         value={source.dueDate() || ''}
                         onChange={changeDueDate} />
            </Box>

            {issue.closedAt() &&
             <Box sx={{m:1}}>
               <Button sx={{ml:1}}
                       color="error"
                       variant={is_view_description ? "outlined" : "contained"}
                       onClick={()=> actions.issue.reopen(issue.id())}>
                 Re Open
               </Button>
             </Box>}

          </Box>

        </Box>
    );
}
