import React from 'react';

import Box from '@mui/material/Box';
import MuiTabs from '@mui/material/Tabs';
import MuiTab from '@mui/material/Tab';

export default function Tabs (props) {
    const tabs = props.data;
    const onChange = props.onChange;

    const change = (e, value)=> {
        const new_tabs = {...tabs};
        new_tabs.selected = value;
        onChange(new_tabs);
    };

    return (
        <Box>
          <MuiTabs value={tabs.selected}
                   onChange={change}
                   aria-label="disabled tabs example">
            {tabs.list.map((tab)=> {
                return (
                    <MuiTab key={tab.code}
                            value={tab.code}
                            label={tab.label}/>
                );
            })}
          </MuiTabs>
        </Box>
    );
}
