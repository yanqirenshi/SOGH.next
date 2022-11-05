import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {timestamp} from './utils.js';

import sogh from '../sogh.js';

export const page_repositories = createSlice({
    name: 'page/repositories',
    initialState: {
        fetch: {
            start: null,
            end: null,
            pageInfo: null,
        },
        repositories: [],
    },
    reducers: {
        started_fetchRepositoriesByViewer: (state, action) => {
            state.fetch.start = timestamp();
            state.fetch.end = null;
        },
        successed_fetchRepositoriesByViewer: (state, action) => {
            state.fetch.end = timestamp();
            state.fetch.pageInfo = action.payload.pageInfo;

            state.repositories = action.payload.contents;
        },
        failed_fetchRepositoriesByViewer: (state, action) => {
            state.fetch.end = timestamp();
        },
    },
});

export const {
    started_fetchRepositoriesByViewer,
    successed_fetchRepositoriesByViewer,
    failed_fetchRepositoriesByViewer,
} = page_repositories.actions;


export function fetchRepositoriesByViewer () {
    return (dispatch) => {
        dispatch(started_fetchRepositoriesByViewer());

        sogh.fetchRepositoriesByViewer(
            (data)=>  dispatch(successed_fetchRepositoriesByViewer(data)),
            (error)=> dispatch(failed_fetchRepositoriesByViewer(error)));
    };
};

export default page_repositories.reducer;
