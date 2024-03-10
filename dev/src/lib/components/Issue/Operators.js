import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Operators (props) {
    const issue = props.issue;
    const is_view_description = props.view_description;
    const onChange = props.onChange;
    const actions = props.actions;

    const changeNextActionDate = (e)=> {
        actions.issue.next_action_date.change(
            issue.id(),
            e.target.value,
        );
    };

    const changeDueDate = (e)=> {
        actions.issue.due_date.change(
            issue.id(),
            e.target.value,
        );
    };

    return (
        <Box sx={{mt:0.5}}>

          <Box sx={{display: 'flex'}}>

            <Box sx={{m:1}}>
              <Button variant={is_view_description ? "contained" : "outlined"}
                      onClick={()=> onChange(!is_view_description)}>
                Description
              </Button>
            </Box>

            <Box sx={{m:1}}>
              <TextField size="small"
                         type="date"
                         label="Due Date"
                         variant="outlined"
                         InputLabelProps={{ shrink: true }}
                         value={issue.nextActionDate()}
                         onChange={changeNextActionDate} />
            </Box>

            <Box sx={{m:1}}>
              <TextField size="small"
                         type="date"
                         label="Due Date"
                         variant="outlined"
                         InputLabelProps={{ shrink: true }}
                         value={issue.dueDate()}
                         onChange={changeDueDate} />
            </Box>

          </Box>

        </Box>
    );
}
