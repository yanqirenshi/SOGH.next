import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Priority (props) {
    const project = props.project;

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const priority = getPriority(project);

    return (
        <Box sx={{display:'flex', alignItems:'center'}}>
          <S sx={{mr:1}}>Priority</S>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={priority}
                onChange={handleChange}
              >
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
