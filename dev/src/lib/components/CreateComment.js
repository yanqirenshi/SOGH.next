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

        const editor_type = tab.editor.type;

        if ('Md'===editor_type) {
            onClick({
                type: tab.code,
                contents: tab.contents,
            });
        }

        if ('MdNadAss'===editor_type) {
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

        if ('MdNad'===editor_type) {
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

    const tab = tabs.list.find(d=> d.code===tabs.selected);
    const tab_code = tab.code;
    const editor_type = tab.editor.type;

    return (
        <Box>

          <Box sx={{mb:2, pl:2, background:'#f8f8f8'}}>
            <Tabs tabs={tabs} onChange={onChangeTab}/>
          </Box>

          <Box sx={{pl:2, pr:2}}>
            {'Md'===editor_type &&
             <TabMemo value={tab}
                      onChange={onChangeValue}
                      onClick={click}/>}

            {'MdNad'===editor_type &&
             <TabFinishToday value={tab}
                             onChange={onChangeValue}
                             onClick={click}/>}

            {'MdNadAss'===editor_type &&
             <TabRequest members={members}
                         value={tab}
                         onChange={onChangeValue}
                         onClick={click}/>}
          </Box>

        </Box>
    );
}
