import * as recoil from 'recoil';

import sogh from '../manegers/sogh.js';

export const PAGE_SCRUM_PROJECT_TABS = recoil.atom({
    key: "PAGE_SCRUM",
    default: {
        tabs: {
            selected: 'projects',
            list: [
                { code: 'metrix',      label: 'Metrix' },
                { code: 'list',        label: 'List' },
                { code: 'gantt-chart', label: 'Gantt Chart' },
                { code: 'part-graph',  label: 'Part Graph' },
                { code: 'points',      label: 'Points' },
                { code: 'description', label: 'Description' },
            ],
        },
    },
});

// export const FETCH_REPOSITORIES = recoil.atom({
//     key: "FETCH_REPOSITORIES",
//     default: null, // null, Date, true, error
// });

// export const REPOSITORIES = recoil.selectorFamily({
//     key: 'REPOSITORIES',
//     get: authed => async () => {

//         if (authed!==true)
//             return [];

//         return await sogh.asyncFetchRepositoriesByViewer();
//     },
// });

export const PROJECTV2 = recoil.selectorFamily({
    key: 'PAGE_SCRUM_PROJECT_PROJECTV2',
    get: ({authed, login, number})=> async () => {
        if (!authed)
            return null;

        return await sogh.asyncFetchProjectV2ByUserLoginProjectV2Number(login, number);
    },
});

export const PROJECTV2_ITEMS = recoil.selectorFamily({
    key: 'PAGE_SCRUM_PROJECT_PROJECTV2_ITEMS',
    get: ({authed, login, number})=> async () => {
        if (!authed)
            return null;

        return await sogh.asyncFetchProjectV2ItemsByUserLoginProjectV2Number(login, number);
    },
});
