import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Tabs from './CreateComment/Tabs.js';
import TabFinishToday from './CreateComment/TabFinishToday.js';
import TabRequest from './CreateComment/TabRequest.js';
import TabMemo from './CreateComment/TabMemo.js';

export default function CreateComment (props) {
    const issue = props.issue;
    const onClick = props.onClick;
    const members = props.members;
    const tabs = props.tabs;
    const onChange = props.onChange;

    const onChangeTab = (new_tabs)=> onChange(new_tabs);

    const onChangeValue = (code, target, value)=> {
        const new_tabs = JSON.parse(JSON.stringify(tabs));

        const tab = new_tabs.list.find(tab=> tab.code===code);

        tab[target] = value;

        onChange(new_tabs);
    };

    const click = ()=> {
        const field = issue.fieldValueContents('NextAction.Date');

        const tab = tabs.list.find(tab=> {
            return tab.code===tabs.selected;
        });

        if ('memo'===tab.code) {
            onClick({
                type: tab.code,
                contents: tab.contents,
            });
        }

        if ('request'===tab.code) {
            onClick({
                type: tab.code,
                to_parson: tab.parson,
                contents: tab.contents,
                project: field.project,
                item: field.item,
                field_item: field.field_item,
                next_action_date: tab.next_action_date,
            });
        }

        if ('finish today'===tab.code) {
            onClick({
                type: tab.code,
                contents: tab.contents,
                project: field.project,
                item: field.item,
                field_item: field.field_item,
                next_action_date: tab.next_action_date,
            });
        }
    };

    return (
        <Box>

          <Box sx={{mb:2, pl:2, background:'#f8f8f8'}}>
            <Tabs tabs={tabs} onChange={onChangeTab}/>
          </Box>

          <Box sx={{pl:2, pr:2}}>
            {'finish today'===tabs.selected &&
             <TabFinishToday data={tabs.list.find(d=>d.code==='finish today')}
                             onChange={onChangeValue}/>}

            {'request'===tabs.selected &&
             <TabRequest data={tabs.list.find(d=>d.code==='request')}
                         onChange={onChangeValue}
                         members={members}/>}

            {'memo'===tabs.selected &&
             <TabMemo data={tabs.list.find(d=>d.code==='memo')}
                      onChange={onChangeValue}/>}

            <Box sx={{mt:1}}>
              <Button variant="contained"
                      onClick={click}>
                Commit
              </Button>
            </Box>
          </Box>
        </Box>
    );
}
