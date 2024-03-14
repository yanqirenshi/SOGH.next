import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ReplayIcon from '@mui/icons-material/Replay';

import TextField from '@mui/material/TextField';

export default function Term (props) {
    const project = props.project;
    const type = props.type;
    const value = props.value;
    const onChange = props.onChange;
    const actions = props.actions;

    const term = value || getTerm(project, type);

    if (!term) return null;

    const start = term.start || '';
    const end   = term.end   || '';

    const change = (type, v)=> {
        if ('start'===type) {
            onChange({ start: v, end: end});
        } else {
            onChange({ start: start, end: v});
        }
    };

    const clear = ()=> onChange(null);
    const save = ()=> actions[type].change(project, value);

    return (
        <Box sx={{display:'flex', flexDirection: 'column'}}>
          <Box sx={{display:'flex', alignItems:'center'}}>
            <S sx={{mr:1}}>{type==='plan' ? 'Plan' : 'Result'}</S>

            <TextField variant="outlined"
                       type="date"
                       size="small"
                       sx={{width:144}}
                       value={start}
                       onChange={(e)=> change('start', e.target.value)}/>

            <S sx={{ml:1,mr:1}}>-</S>

            <TextField variant="outlined"
                       type="date"
                       size="small"
                       sx={{width:144}}
                       value={end}
                       onChange={(e)=> change('end', e.target.value)}/>
          </Box>

          {value &&
           <Box sx={{display:'flex', justifyContent: 'flex-end', mt:1, width: '100%'}}>
             <Button size="small" variant="outlined" sx={{mr:2}}
                     title="元の値に戻す"
                     onClick={clear}>
               <ReplayIcon/>
             </Button>

             <Button size="small" variant="contained"
                     title="保存する"
                     onClick={save}>
               <SaveAltIcon/>
             </Button>
           </Box>}
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
