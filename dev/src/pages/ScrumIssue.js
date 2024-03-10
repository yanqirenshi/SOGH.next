import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import {
    fetchIssue,
    fetchIssueComments,
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
          <Issue login={params.login}
                 number={params.number}
                 repository={params.repository}/>
        </Suspense>
    );
}

function Issue (props) {
    const login = props.login;
    const number = props.number;
    const repository = props.repository;

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
            refresh: (issue_id, owner, repo, number)=> console.log(issue_id),
            next_action_date: {
                change: (issue_id, date, owner, repo, number)=> console.log([issue_id, date]),
            },
            due_date: {
                change: (issue_id, date, owner, repo, number)=> console.log([issue_id, date]),
            },
            comment: {
                create: (id, data)=> console.log([id, data]),
                update: (id,contents)=> console.log([id, contents]),
                delete: (id,)=> console.log(id),
            },
        },
    };

    return (
        <Frame>
          <Box sx={{width:'100%', height:'100%', overflow: 'auto'}}>
            <Box sx={{pt:1, pb:33}}>
              <Container>
                <PanelIssue data={issue}
                            actions={actions}/>

                <Box>
                  <PanelIssueComments comments={comments}
                                      actions={actions}/>
                </Box>
              </Container>
            </Box>
          </Box>
        </Frame>
    );
}
