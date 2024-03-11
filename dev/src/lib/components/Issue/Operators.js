import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Operators (props) {
    const issue = props.issue;
    const is_view_description = props.view_description;
    const is_view_add_comment = props.view_add_comment;
    const onChange = props.onChange;
    const actions = props.actions;

    const changeNextActionDate = (e)=> {
        actions.issue.next_action_date.change(
            issue.id(),
            e.target.value,
            issue.repository().owner.login,
            issue.repository().name,
            issue.number(),
        );
    };

    const changeDueDate = (e)=> {
        actions.issue.due_date.change(
            issue.id(),
            e.target.value,
            issue.repository().owner.login,
            issue.repository().name,
            issue.number(),
        );
    };

    const clickRefresh = ()=> {
        actions.issue.refresh(
            issue.id,
            issue.repository().owner.login,
            issue.repository().name,
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
              <Button sx={{mr:1}}
                      variant={is_view_description ? "outlined" : "contained"}
                      onClick={()=> onChange('description', !is_view_description)}>
                Description
              </Button>

              <Button variant={is_view_add_comment ? "outlined" : "contained"}
                      onClick={()=> onChange('add_comment', !is_view_add_comment)}>
                add Comment
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
                         label="Due Date"
                         variant="outlined"
                         InputLabelProps={{
                             shrink: true,
                         }}
                         value={issue.nextActionDate()}
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
                         InputLabelProps={{
                             shrink: true,
                         }}
                         value={issue.dueDate()}
                         onChange={changeDueDate} />
            </Box>

          </Box>

        </Box>
    );
}
