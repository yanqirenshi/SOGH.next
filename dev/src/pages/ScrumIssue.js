import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useRecoilValue, useRecoilState } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import {
    fetchIssue,
    fetchIssueComments,
    REFRESH,
} from '../recoil/PAGE_SCRUM_ISSUE.js';

import Loading from '../panels/Loading.js';
import Frame from '../assemblies/frames/Frame.js';

import {
    PanelIssue,
    PanelIssueComments,
} from '../lib/index.js';

import sogh from '../manegers/sogh.js';

export default function ScrumIssue (props) {
    const params = useParams();

    const authed = useRecoilValue(GITHUB_AUTH);

    if (!authed)
        return null;

    return (
        <Suspense fallback={<Loading/>}>
          <Contents login={params.login}
                    number={params.number}
                    repository={params.repository}/>
        </Suspense>
    );
}

function Contents (props) {
    const login = props.login;
    const number = props.number;
    const repository = props.repository;

    const [tabs, setTabs] = React.useState(defaultTabsData());

    const [edit_contents, setEditContents] = React.useState({});
    const [is_view_description, setIsViewDescription] = React.useState(true);
    const [is_view_add_comment, setIsViewAddComment] = React.useState(true);

    const refresh = useRecoilState(REFRESH)[1];

    const issue_id = useRecoilValue(fetchIssue({
        login: login,
        repository: repository,
        number: number,
    }));

    const issue_comments_id = useRecoilValue(fetchIssueComments({
        login: login,
        repository: repository,
        number: number,
    }));

    if (!issue_id) return null;

    const issue = sogh.issue(issue_id);

    if (!issue) return null;

    const comments = issue_comments_id.map(id=> sogh.issueComment(id));

    const actions = {
        project: {
            click: (owner, number)=> console.log([owner, number]),
        },
        issue: {
            refresh: (issue_id, owner, repo, number)=> refresh(new Date().toISOString()),
            next_action_date: {
                change: (new_val, project, item, field_item, value)=> console.log([new_val, project, item, field_item, value]),
            },
            due_date: {
                change: (new_val, project, item, field_item, value)=> console.log([new_val, project, item, field_item, value]),
            },
            comment: {
                change: (v)=> setEditContents(v),
                create: (id, data)=> console.log([id, data]),
                update: (id,contents)=> console.log([id, contents]),
                delete: (id)=> console.log(id),
                changeTabs: (new_tabs)=> setTabs(new_tabs),
            },
            description: {
                changeView : (v)=> setIsViewDescription(v),
            },
            add_comment: {
                changeView : (v)=> setIsViewAddComment(v),
            },
            reopen: (id)=> console.log(id),
        },
    };

    return (
        <Frame>
          <Box sx={{width:'100%', height:'100%', overflow: 'auto'}}>
            <Box sx={{pt:1, pb:33}}>
              <Container>
                <PanelIssue data={issue}
                            actions={actions}
                            view_description={is_view_description}
                            view_add_comment={is_view_add_comment}
                            members={sogh.members()}
                            tabs={tabs}/>

                <Box>
                  <PanelIssueComments comments={comments}
                                      actions={actions}
                                      edit_contents={edit_contents}/>
                </Box>
              </Container>
            </Box>
          </Box>
        </Frame>
    );
}

function defaultTabsData () {
    return {
        selected: 'memo',
        list: [
            {
                code: 'memo',
                label: 'Memo',
                editor: { type: 'Md', button_label: 'add Memo' },
                contents: [
                    '## Memo',
                    '',
                    '',
                ].join('\n'),
            },
            {
                code: 'request',
                label: 'Request',
                editor: { type: 'MdNadAss', button_label: 'Request' },
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
                editor: { type: 'MdNad', button_label: 'Finish today' },
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
            {
                code: 'meeting-comment',
                label: '会議コメント',
                editor: { type: 'Md', button_label: 'add 会議 コメント' },
                contents: [
                    '## ' + moment().format('YYYY-MM-DD'),
                    '',
                    '',
                ].join('\n'),
            },
            {
                code: 'close-issue',
                label: 'イシューの対応完了',
                editor: { type: 'Md', button_label: '対応完了(クローズ)' },
                contents: [
                    '## イシュー・クローズ!!',
                    '',
                    '',
                ].join('\n'),
            },
        ],
    };
}
