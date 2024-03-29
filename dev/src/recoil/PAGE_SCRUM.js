import * as recoil from 'recoil';

import sogh from '../manegers/sogh.js';

export const PAGE_SCRUM_TABS = recoil.atom({
    key: "PAGE_SCRUM",
    default: {
        tabs: {
            selected: 'projects',
            list: [
                { code: 'timeline',      label: 'Timeline' },
                { code: 'gantt-chart',   label: 'Gantt Chart' },
                { code: 'issues',        label: 'Issues' },
                { code: 'pull-requests', label: 'Pull Requests' },
                { code: 'repositories',  label: 'Repositories' },
                { code: 'projects',      label: 'Projects' },
                { code: 'account',       label: 'Account' },
                { code: 'help',          label: 'Help' },
            ],
        },
    },
});

export const FETCH_REPOSITORIES = recoil.atom({
    key: "PAGE_SCRUM_FETCH_REPOSITORIES",
    default: null, // null, Date, true, error
});

export const REPOSITORIES = recoil.selectorFamily({
    key: 'PAGE_SCRUM_REPOSITORIES',
    get: authed => async () => {
        if (authed!==true)
            return [];

        return await sogh.asyncFetchRepositoriesByViewer();
    },
});

export const PROJECTSV2 = recoil.selectorFamily({
    key: 'PAGE_SCRUM_PROJECTSV2',
    get: authed => async () => {
        if (authed!==true)
            return [];

        return await sogh.asyncFetchProjectsV2ByViewer();
    },
});


export const STATUS_FETCH_PROJECTSV2 = recoil.atom({
    key: 'PAGE_SCRUM_STATUS_FETCH_PROJECTSV2',
    default: null,
});
