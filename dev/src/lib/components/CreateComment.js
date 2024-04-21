import React from 'react';
import moment from 'moment';

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

    const [tabs, setTabs] = React.useState(defaultTabsData());

    const onChange = (code, target, value)=> {
        const new_tabs = JSON.parse(JSON.stringify(tabs));

        const tab = new_tabs.list.find(tab=> tab.code===code);

        tab[target] = value;

        setTabs(new_tabs);
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
            <Tabs tabs={tabs} onChange={v=>setTabs(v)}/>
          </Box>

          <Box sx={{pl:2, pr:2}}>
            {'finish today'===tabs.selected &&
             <TabFinishToday data={tabs.list.find(d=>d.code==='finish today')}
                             onChange={onChange}/>}

            {'request'===tabs.selected &&
             <TabRequest data={tabs.list.find(d=>d.code==='request')}
                         onChange={onChange}
                         members={members}/>}

            {'memo'===tabs.selected &&
             <TabMemo data={tabs.list.find(d=>d.code==='memo')}
                      onChange={onChange}/>}

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

function defaultTabsData () {
    return {
        selected: 'memo',
        list: [
            {
                code: 'memo',
                label: 'Memo',
                contents: [
                    '## Memo',
                    '',
                    '',
                    '',
                ].join('\n'),
            },
            {
                code: 'request',
                label: 'Request',
                parson: '',
                next_action_date: moment().add(1, 'd').format('YYYY-MM-DD'),
                contents: [
                    '作業を依頼する時は 1、2行で良いので「依頼文章」を記載してください。',
                    'イシューこコメントのメンションは自動で付与されます。',
                    '',
                ].join('\n'),
            },
            {
                code: 'finish today',
                label: 'Finish Today',
                next_action_date: moment().add(1, 'd').format('YYYY-MM-DD'),
                contents: [
                    '## Memo',
                    '',
                    '明日の自分にメモを残すとよいです。',
                    '1. 本日の対応内容、出来た物',
                    '2. 明日やること、作る物',
                    '',
                ].join('\n'),
            },
        ],
    };
}
