import React from 'react';
import moment from 'moment';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Tabs from './CreateComment/Tabs.js';
import TabFinishToday from './CreateComment/TabFinishToday.js';
import TabRequest from './CreateComment/TabRequest.js';
import TabMemo from './CreateComment/TabMemo.js';

export default function CreateComment (props) {
    const [tabs, setTabs] = React.useState(defaultTabsData());

    const onChange = (code, target, contents)=> {
        const new_tabs = JSON.parse(JSON.stringify(tabs));
        const tab = new_tabs.list.find(tab=> tab.code===code);

        if ('contents'===target)
            tab.contents = contents;

        setTabs(new_tabs);
    };

    return (
        <Box>

          <Box sx={{mb:2, pl:2, background:'#f8f8f8'}}>
            <Tabs tabs={tabs} onChange={v=>setTabs(v)}/>
          </Box>

          <Box sx={{pl:2, pr:2}}>
            {'finish today'===tabs.selected &&
             <TabFinishToday data={tabs.list.find(d=>d.code==='finish today')}
                             onChange={onChange}/>}

            {'request'===tabs.selected &&
             <TabRequest data={tabs.list.find(d=>d.code==='request')}
                         onChange={onChange}/>}

            {'memo'===tabs.selected &&
             <TabMemo data={tabs.list.find(d=>d.code==='memo')}
                      onChange={onChange}/>}

            <Box sx={{mt:1}}>
              <Button variant="contained">Commit</Button>
            </Box>
          </Box>
        </Box>
    );
}

function defaultTabsData () {
    return {
        selected: 'memo',
        list: [
            {
                code: 'memo',
                label: 'Memo',
                contents: [
                    '## Memo'
                ].join('\n'),
            },
            {
                code: 'request',
                label: 'Request',
                parson: '',
                next_action_date: moment().add(1, 'd').format('YYYY-MM-DD'),
                contents: [
                    ''
                ].join('\n'),
            },
            {
                code: 'finish today',
                label: 'Finish Today',
                next_action_date: moment().add(1, 'd').format('YYYY-MM-DD'),
                contents: [
                    ''
                ].join('\n'),
            },
        ],
    };
}
