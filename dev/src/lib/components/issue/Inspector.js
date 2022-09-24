import React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Link from '@mui/material/Link';

import BodyHtml from '../common/BodyHtml.js';
import IssueTitle from '../common/IssueTitle.js';

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

    const issue = props.data;

    const handleChange = (event, newValue) => setValue(newValue);

    return (
        <Box sx={style}>
          <div style={{paddingLeft: 22,paddingRight: 22, paddingTop:11}}>
            <IssueTitle data={issue}/>
          </div>

          <TabContext value={value}>

            <Box sx={style.tabs}>
              <TabList onChange={handleChange}
                       aria-label="lab API tabs example" centered>
                <Tab label="Description" value="1" />
                <Tab label="Attributes" value="2" />
              </TabList>
            </Box>

            <TabPanel value="1">
              <BodyHtml data={issue.bodyHTML()}/>
            </TabPanel>

            <TabPanel value="2">
            </TabPanel>

          </TabContext>
        </Box>
    );
}
