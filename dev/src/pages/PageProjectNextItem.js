import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import { ProjectNextItem } from '../lib/index.js';

import Page from '../components/Page.js';

import sogh from '../sogh.js';

import {
    fetchProjectNextItemByID,
    fetchIssueByID,
    fetchIssueCommentsByIssueID,
} from '../slices/page_project_next_item.js';

export default function PageProjectNextItem (props) {
    const data = useSelector(state => state.page_project_next_item);
    const dispatch = useDispatch();

    const project_next_item_id = useParams().id;
    const project_next_item = sogh.projectNextItem(project_next_item_id);

    if (isNeedLoad(data))
        dispatch(fetchProjectNextItemByID(project_next_item_id));

    if (isNeedLoadIssue(project_next_item, data))
        dispatch(fetchIssueByID(project_next_item.content().id));

    const issue = getIssue(data);

    if (isNeedLoadIssueComments(issue, data))
        dispatch(fetchIssueCommentsByIssueID(issue.id()));

    const issue_comments = getIssueComments(data);

    return (
        <Page data={project_next_item}>
          {project_next_item
           && <ProjectNextItem sogh={sogh}
                               data={project_next_item}
                               issue={issue}
                               issue_comments={issue_comments}/>}
        </Page>
    );
}

function getIssue (data) {
    const issue_id = data.issue.data;
    return issue_id ? sogh.issue(issue_id) : null;
}

function getIssueComments (data) {
    if (!data)
        return [];

    return data.issue.comments.data.map(id=> sogh.issueComment(id));
}

function isNeedLoad (data) {
    return data.project_next_item.data===null
        && data.project_next_item.fetch.start===null;
}

function isNeedLoadIssue (project_next_item, data) {
    return project_next_item
        && project_next_item.type()==='ISSUE'
        && data.issue.data===null
        && data.issue.fetch.start===null;
}

function isNeedLoadIssueComments (issue, data) {
    return issue
        && data.issue.comments.data===null
        && data.issue.comments.fetch.start===null;
}
