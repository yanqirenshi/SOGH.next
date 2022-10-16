import React from 'react';

import MTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function Tabs (props) {
    const data = props.data;
    const onChange = props.onChange;

    const selected = data.selected ? data.selected : data.list[0].code;

    const change = (e, val)=> onChange(val);

    return (
        <MTabs value={selected} onChange={change} centered>

          {data.list.map(d=> {
              return (
                  <Tab key={d.code} label={d.label} value={d.code} />
              );
          })}

        </MTabs>
    );
}
