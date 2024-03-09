import React from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function CreateComment (props) {
    return (
        <Box>

          <Box sx={{mb:3}}>
            <Tabs/>
          </Box>

          <Box sx={{display:'flex'}}>
            <Parsons/>

            <TextField type="date"
                       sx={{ml:2}}
                       size="small"
                       label="Next Action Date"
                       defaultValue=""/>
          </Box>

          <Box sx={{display:'flex', mt:2}}>
            <Box sx={{width:'50%'}}>
              <TextField label="Markdown"
                         multiline
                         rows={6}
                         value=""
                         onChange={()=>null}
                         sx={{background:'#fff'}}
                         fullWidth />
            </Box>

            <Box sx={{width:'50%'}}>
            </Box>
          </Box>

          <Box sx={{mt:1}}>
            <Button variant="contained">Commit</Button>
          </Box>
        </Box>
    );
}

function Parsons () {
    return (
        <FormControl size="small">
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={10}
                  label="Age"
                  onChange={()=>null}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
    );
}

function Tabs () {
    return (
        <MuiTabs value={'plane'}
              onChange={()=>null}>
          <Tab value="plane" label="Plane"/>
          <Tab value="request" label="Request"/>
          <Tab value="finish today" label="Finish Today"/>
        </MuiTabs>
    );
}
