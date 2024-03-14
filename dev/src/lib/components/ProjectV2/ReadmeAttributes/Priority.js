import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ReplayIcon from '@mui/icons-material/Replay';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Priority (props) {
    const project = props.project;
    const value = props.value;
    const onChange = props.onChange;
    const actions = props.actions;

    const priority = value || getPriority(project);

    const change = (event) => onChange(event.target.value);

    const clear = ()=> onChange(null);
    const save = ()=> actions.priority.change(project, value);
    return (
        <Box sx={{display:'flex', flexDirection: 'column'}}>
          <Box sx={{display:'flex', alignItems:'center'}}>
            <S sx={{mr:1}}>Priority</S>

            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth size="small">
                <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={priority}
                        onChange={change}>
                  {Object.values(priorities).map(item=> {
                      return (
                          <MenuItem value={item.code}>
                            {item.label} ({item.code})
                          </MenuItem>
                      );
                  })}
                </Select>
              </FormControl>
            </Box>
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

const priorities = {
    's': { code: 's', label: '緊急', },
    'h': { code: 'h', label: '高',},
    'n': { code: 'n', label: '普通',},
    'l': { code: 'l', label: '低',},
    '?': { code: '?', label: '謎',},
};

function getPriority (project) {
    const val = project.priority();
    const item = priorities[val];

    return item ? val : '?';
}
