import React from 'react';

import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function Tabs (props) {
    const tabs = props.tabs;
    const onChange = props.onChange;

    const change = (e, code)=> {
        const new_tabs = {...tabs};
        new_tabs.selected = code;
        onChange(new_tabs);
    };

    return (
        <MuiTabs sx={{}}
                 value={tabs.selected}
                 onChange={change}>

          {tabs.list.map(tab=> {
              return (
                  <Tab key={tab.code}
                       value={tab.code}
                       label={tab.label}/>
              );
          })}
        </MuiTabs>
    );
}
