import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import S from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import Link from './common/Link.js';

export default function ProjectV2Item (props) {
    const item = props.item;

    if (!item)
        return null;

    const type = item.contentTypename();

    const project = item.project();

    const due_date = item.dueDate();
    const next_action_date = item.nextActionDate();
    const points_plan = item.planPointsSummary();
    const points_result = item.resultPointsSummary();

    return (
        <Box sx={{pt:3}}>
          <Box>
            <S>
              <Link href={item.projectPath()}
                    style={{marginRight: 6}}>
                {project.title}
              </Link>

              (<Link href={project.url}>{project.number}</Link>)</S>
            <S variant="h4" sx={{mt:1}}>
              {item.title()}
            </S>
          </Box>

          <Box sx={{display:'flex', mt: 4}}>
            <Box sx={{display:'flex', alignItems: 'center', mr:3}}>
              <S sx={{mr:1}}>
                Next Action Date:
              </S>

              <TextField required
                         type="date"
                         defaultValue={next_action_date || ''}
                         size="small"/>
            </Box>

            <Box sx={{display:'flex', alignItems: 'center', mr:3}}>
              <S sx={{mr:1}}>
                Due Date:
              </S>

              <TextField required
                         type="date"
                         defaultValue={due_date || ''}
                         size="small"/>
            </Box>
          </Box>

          <Box sx={{display:'flex', mt: 1}}>
            <Box sx={{display:'flex', alignItems: 'center', mr:3}}>
              <S sx={{mr:1}}>
                Point(Plan):
              </S>

              <S>{points_plan}</S>
            </Box>

            <Box sx={{display:'flex', alignItems: 'center'}}>
              <S sx={{mr:1}}>
                Point(Results):
              </S>

              <S>{points_result.total}</S>
            </Box>
          </Box>

        </Box>
    );
}
