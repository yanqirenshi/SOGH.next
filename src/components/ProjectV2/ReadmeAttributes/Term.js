import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import TextField from '@mui/material/TextField';

export default function Term (props) {
    const project = props.project;
    const type = props.type;

    const term = getTerm (project, type);

    if (!term) return null;

    return (
        <Box sx={{display:'flex', alignItems:'center'}}>
          <S sx={{mr:1}}>{type==='plan' ? 'Plan' : 'Result'}</S>

          <TextField variant="outlined"
                     type="date"
                     size="small"
                     sx={{width:144}}
                     value={term.start || ''}
                     onChange={()=>null}/>

          <S sx={{ml:1,mr:1}}>-</S>

          <TextField variant="outlined"
                     type="date"
                     size="small"
                     sx={{width:144}}
                     value={term.end || ''}
                     onChange={()=>null}/>
        </Box>
    );
}

function getTerm (project, type) {
    if (type==='plan') {
        return project.plan();
    } else if (type==='result') {
        return project.result();
    }

    return null;
}
