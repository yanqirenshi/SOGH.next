import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {timestamp} from './utils.js';

import sogh from '../sogh.js';

export const page_owner = createSlice({
    name: 'page/owner',
    initialState: {
        user: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
        projects_next: {
            data: [],
            fetch: {
                start: null,
                end: null,
                pageInfo: null,
            },
        },
    },
    reducers: {
        //
        started_fetchUserByID: (state, action) => {
            state.user.fetch.start = timestamp();
            state.user.fetch.end = null;
        },
        successed_fetchUserByID: (state, action) => {
            state.user.fetch.end = timestamp();
            state.user.data = action.payload;
        },
        failed_fetchUserByID: (state, action) => {
            state.user.fetch.end = timestamp();
        },
        //
        started_fetchProjectsV2ByUser: (state, action) => {
            state.projects_next.fetch.start = timestamp();
            state.projects_next.fetch.end = null;
        },
        successed_fetchProjectsV2ByUser: (state, action) => {
            state.projects_next.fetch.end = timestamp();

            state.projects_next.fetch.pageInfo = action.payload.pageInfo;
            state.projects_next.data = action.payload.contents;
        },
        failed_fetchProjectsV2ByUser: (state, action) => {
            state.projects_next.fetch.end = timestamp();
        },
    },
});

export const {
    //
    started_fetchUserByID,
    successed_fetchUserByID,
    failed_fetchUserByID,
    //
    started_fetchProjectsV2ByUser,
    successed_fetchProjectsV2ByUser,
    failed_fetchProjectsV2ByUser,
} = page_owner.actions;


export function fetchUserByID (id) {
    return (dispatch) => {
        dispatch(started_fetchUserByID());

        sogh.fetchUserByID(id,
            (data)=>  dispatch(successed_fetchUserByID(data)),
            (error)=> dispatch(failed_fetchUserByID(error)));
    };
};

export function fetchProjectsV2ByUser (user) {
    return (dispatch) => {
        dispatch(started_fetchProjectsV2ByUser());

        sogh.fetchProjectsV2ByUser(
            user,
            (data)=>  dispatch(successed_fetchProjectsV2ByUser(data)),
            (error)=> dispatch(failed_fetchProjectsV2ByUser(error)));
    };
};

export default page_owner.reducer;
