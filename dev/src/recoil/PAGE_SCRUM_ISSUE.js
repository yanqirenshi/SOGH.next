import * as recoil from 'recoil';

import sogh from '../manegers/sogh.js';

export const STATUS_FETCH_ISSUE = recoil.atom({
    key: "PAGE_SCRUM_ISSUE_STATUS_FETCH_ISSUE",
    default: null,
});

export const REFRESH = recoil.atom({
    key: 'PAGE_SCRUM_ISSUE_REFRESH',
    default: null,
});

export const fetchIssue = recoil.selectorFamily({
    key: 'PAGE_SCRUM_ISSUE_FETCH_ISSUE',
    get: ({login, repository, number})=> {
        return async ({get}) => {
            get(REFRESH);
            return sogh.asyncFetchIssueByOrgRepoIssueNumber(login, repository, number);
        };
    },
});

export const fetchIssueComments = recoil.selectorFamily({
    key: 'PAGE_SCRUM_ISSUE_FETCH_ISSUE_COMMENTS',
    get: ({login, repository, number})=> {
        return async ({get}) => {
            get(REFRESH);
            return sogh.asyncFetchIssueCommentsByOrgRepoIssueNumber(login, repository, number);
        };
    },
});
