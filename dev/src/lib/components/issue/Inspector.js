import React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const style ={
    height: '100%',
    background: '#fff',
    borderLeft: '1px solid #cccccc',
    tabs: {
        borderBottom: 1,
        borderColor: 'divider',
    },
};

export default function Inspector (props) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => setValue(newValue);

    return (
        <Box sx={style}>
          <TabContext value={value}>

            <Box sx={style.tabs}>
              <TabList onChange={handleChange}
                       aria-label="lab API tabs example" centered>
                <Tab label="Description" value="1" />
                <Tab label="Attributes" value="2" />
              </TabList>
            </Box>

            <TabPanel value="1">
            </TabPanel>

            <TabPanel value="2">
            </TabPanel>

          </TabContext>
        </Box>
    );
}
