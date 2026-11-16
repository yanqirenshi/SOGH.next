import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Tabs from './CreateComment/Tabs.js';
import TabFinishToday from './CreateComment/TabFinishToday.js';
import TabRequest from './CreateComment/TabRequest.js';
import TabMemo from './CreateComment/TabMemo.js';

export default function CreateComment (props) {
    const issue = props.issue;
    const item = props.item || null;
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

    // 次の行動の日を書き換えるときに、利用側へ渡す値。Item を渡されたときは、その Item から読む。(yanqirenshi/SOGH.next#114)
    // 作れないとき (null) は、次の行動の日の情報 (project・item・field_item・next_action_date) を付けずに送る。
    const nextActionOf = (tab)=> {
        const field = (item || issue).fieldValueContents('NextAction.Date');

        if (!field)
            return {};

        return {
            project: field.project,
            item: field.item,
            field_item: field.field_item,
            next_action_date: tab.next_action_date,
        };
    };

    const click = ()=> {
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
                ...nextActionOf(tab),
            });
        }

        if ('MdNad'===editor_type) {
            onClick({
                type: tab.code,
                contents: tab.contents,
                ...nextActionOf(tab),
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
