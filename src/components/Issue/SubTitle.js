import React from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

import Link from '../common/Link.js';

export default function SubTitle (props) {
    const issue = props.issue;
    const actions = props.actions;

    const milestone = issue.milestone();

    const project = issue.projectV2();

    const clickProject = ()=> {
        actions.project.click(project.owner.login, project.number);
    };

    const repository = issue.repository();

    const author = issue.author();

    return (
        <Box sx={{mt:0.5}}>

          <Box sx={{
              display:'flex',
              alignItems: 'center',
          }}>

            <Box sx={{mr:2}}>
              <Link href={repository.url}>
                {repository.name}
              </Link>
            </Box>

            <Box>
              <span onClick={clickProject}>
                {project.title}
              </span>
              <span style={{marginLeft:11}}>
                (
                <Link href={project.url}>
                  {project.number}
                </Link>
                )
              </span>
            </Box>

          </Box>

          <Box sx={{display: 'flex'}}>
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

            <Box sx={{
                mt:1, mb:1,
                display: 'flex',
            }}>

              <Box sx={{display: 'flex', alignItems: 'center', mr:3}}>
                <span style={{marginRight:6}}>
                  Owners:
                </span>

                {issue.assignees().map(assignee=> {
                    return (
                        <Link key={assignee.id}
                              href={assignee.url}>
                          <Chip sx={{background:'#fff'}}
                                avatar={<Avatar alt={assignee.login}
                                   src={assignee.avatarUrl} />}
                                label={assignee.name || assignee.login}/>
                        </Link>
                    );
                })}
              </Box>

              <Box sx={{display: 'flex', alignItems: 'center'}}>
                <span style={{marginRight:6}}>
                  Create:
                </span>
                <Link href={author.url}>
                  <Avatar alt={author.login}
                          src={author.avatarUrl}
                          sx={{width:22,height:22}} />
                </Link>
              </Box>

            </Box>
          </Box>

        </Box>
    );
}
