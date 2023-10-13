import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Paper from '@mui/material/Paper';

export default function ReadmeAttributes (props) {
    const project = props.project;

    return (
        <Box sx={{display:'flex', flexWrap: 'wrap'}}>

          <Paper sx={{ width: 111, m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>Maneger</S>
              <S>{project.priority()}</S>
          </Paper>

          <Paper sx={{ width: 111, m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>Type</S>
              <S>{project.type()}</S>
          </Paper>

          <Paper sx={{ width: 111, m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>Release</S>
              <S>{project.release()}</S>
          </Paper>

          <Paper sx={{ width: 222, m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>Plan</S>
              <S>{`${project.plan().start} - ${project.plan().start}`}</S>
          </Paper>

          <Paper sx={{ width: 222, m: 0.5, pt: 0.5, pb: 0.5, pl: 2, pr: 2 }}>
              <S>Result</S>
              <S>{`${project.result().start} - ${project.result().start}`}</S>
          </Paper>

        </Box>
    );
}
