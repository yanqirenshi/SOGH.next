import React from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Parsons (props) {
    const members = props.members;
    const type = props.type;
    const value = props.value;
    const onChange = props.onChange;

    return (
        <FormControl size="small">

          <InputLabel id="demo-simple-select-label">Member</InputLabel>

          <Select labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value}
                  label="Member"
                  onChange={onChange}>

            {members.map(member=> {
                return (
                    <MenuItem key={member.code}
                              value={member.code}>
                      {member.name}
                    </MenuItem>
                );
            })}
          </Select>

        </FormControl>
    );
}
