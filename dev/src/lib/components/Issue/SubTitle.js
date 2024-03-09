import React from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Link from '../common/Link.js';

export default function SubTitle (props) {
    const issue = props.issue;
    const is_view_description = props.view_description;
    const onChange = props.onChange;

    const milestone = issue.milestone();

    return (
        <Box sx={{mt:0.5, display: 'flex'}}>
          <Box sx={{m:1}}>
            <Button variant={is_view_description ? "contained" : "outlined"}
                    size="small"
                    onClick={()=> onChange(!is_view_description)}>
              Description
            </Button>
          </Box>

          {milestone &&
           <Box sx={{m:1}}>
             <Chip key={milestone.id}
                   sx={{background:'#fff'}}
                   label={
                       <>
                         <span>{milestone.title}</span>
                         <span style={{marginLeft:11}}>
                           (
                           <Link href={milestone.url}>
                             {milestone.number}
                           </Link>
                           )
                         </span>
                       </>
                   }/>
           </Box>}

          <Box sx={{m:1, display: 'flex'}}>
            {issue.labels().map(label=> {
                return (
                    <Chip key={label.id}
                          sx={{
                              background:'#'+label.color,
                              ml:0.3, mr:0.3,
                          }}
                          label={label.name}/>
                );
            })}
          </Box>

          <Box sx={{m:1, display: 'flex'}}>
            {issue.assignees().map(assignee=> {
                return (
                    <Link href={assignee.url}>
                      <Chip key={assignee.id}
                            sx={{background:'#fff'}}
                            avatar={<Avatar alt={assignee.login}
                                            src={assignee.avatarUrl} />}
                            label={assignee.name || assignee.login}/>
                    </Link>
                );
            })}
          </Box>
        </Box>
    );
}
