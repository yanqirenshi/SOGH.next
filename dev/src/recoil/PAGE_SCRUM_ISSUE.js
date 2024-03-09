import * as recoil from 'recoil';

import sogh from '../manegers/sogh.js';

export const STATUS_FETCH_ISSUE = recoil.atom({
    key: "PAGE_SCRUM_ISSUE_STATUS_FETCH_ISSUE",
    default: null,
});

export const fetchIssue = recoil.selectorFamily({
    key: 'PAGE_SCRUM_ISSUE_FETCH_ISSUE',
    get: ({login, repository, number})=> async () => {
        return sogh.asyncFetchIssueByOrgRepoIssueNumber(login, repository, number);
    },
});

// export const PROJECTV2_ITEMS = recoil.selectorFamily({
//     key: 'PAGE_SCRUM_PROJECT_PROJECTV2_ITEMS',
//     get: ({authed, login, number})=> async () => {
//         if (!authed)
//             return null;

//         return await sogh.asyncFetchProjectV2ItemsByOrgLoginProjectV2Number(login, number);
//     },
// });
