import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {timestamp} from './utils.js';

import sogh from '../sogh.js';

export const page_projectV2 = createSlice({
    name: 'page/page_projectV2',
    initialState: {
        project_next: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
        project_next_items: {
            data: null,
            fetch: {
                start: null,
                end: null,
                pageInfo: null,
            },
        },
    },
    reducers: {
        // fetchProjectsV2ByID
        started_fetchProjectsV2ByID: (state, action) => {
            state.project_next.fetch.start = DateTime.now().toISO();
            state.project_next.fetch.end = null;
        },
        successed_fetchProjectsV2ByID: (state, action) => {
            state.project_next.fetch.end = DateTime.now().toISO();

            state.project_next.data = action.payload.contents;
        },
        failed_fetchProjectsV2ByID: (state, action) => {
            state.project_next.fetch.end = DateTime.now().toISO();
        },
        // fetchProjectV2ItemsByProjectNext
        started_fetchProjectV2ItemsByProjectNext: (state, action) => {
            state.project_next_items.fetch.start = DateTime.now().toISO();
            state.project_next_items.fetch.end = null;
        },
        successed_fetchProjectV2ItemsByProjectNext: (state, action) => {
            state.project_next_items.fetch.end = DateTime.now().toISO();
            state.project_next_items.fetch.pageInfo = action.payload.pageInfo;

            state.project_next_items.data = {
                fields: action.payload.fields,
                items: action.payload.contents,
            };
        },
        failed_fetchProjectV2ItemsByProjectNext: (state, action) => {
            state.project_next_items.fetch.end = DateTime.now().toISO();
        },
    },
});

export const {
    // fetchProjectsV2ByID
    started_fetchProjectsV2ByID,
    successed_fetchProjectsV2ByID,
    failed_fetchProjectsV2ByID,
    // fetchProjectV2ItemsByProjectNext
    started_fetchProjectV2ItemsByProjectNext,
    successed_fetchProjectV2ItemsByProjectNext,
    failed_fetchProjectV2ItemsByProjectNext,
} = page_projectV2.actions;

export function fetchProjectsV2ByID (id) {
    return (dispatch) => {
        dispatch(started_fetchProjectsV2ByID());

        sogh.fetchProjectsV2ByID(
            id,
            (data)=>  dispatch(successed_fetchProjectsV2ByID(data)),
            (error)=> dispatch(failed_fetchProjectsV2ByID(error)));
    };
};

export function fetchProjectV2ItemsByProjectNext (projectV2) {
    return (dispatch) => {
        dispatch(started_fetchProjectV2ItemsByProjectNext());

        sogh.fetchProjectV2ItemsByProjectNext(
            projectV2,
            (data)=>  dispatch(successed_fetchProjectV2ItemsByProjectNext(data)),
            (error)=> dispatch(failed_fetchProjectV2ItemsByProjectNext(error)));
    };
};

export default page_projectV2.reducer;
