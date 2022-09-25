import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchProjectsV2ByID,
    fetchProjectV2ItemsByProjectNext,
} from './page_project_next/actions.js';

export const page_project_next = createSlice({
    name: 'page/page_project_next',
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
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectsV2ByID.pending, (state) => {
                state.project_next.fetch.start = DateTime.now().toISO();
                state.project_next.fetch.end = null;
            })
            .addCase(fetchProjectsV2ByID.fulfilled, (state, action) => {
                state.project_next.fetch.end = DateTime.now().toISO();

                state.project_next.data = action.payload.contents;
            })
            .addCase(fetchProjectsV2ByID.rejected, (state) => {
                state.project_next.fetch.end = DateTime.now().toISO();
            });

        builder
            .addCase(fetchProjectV2ItemsByProjectNext.pending, (state) => {
                state.project_next_items.fetch.start = DateTime.now().toISO();
                state.project_next_items.fetch.end = null;
            })
            .addCase(fetchProjectV2ItemsByProjectNext.fulfilled, (state, action) => {
                state.project_next_items.fetch.end = DateTime.now().toISO();
                state.project_next_items.fetch.pageInfo = action.payload.pageInfo;

                state.project_next_items.data = {
                    fields: action.payload.fields,
                    items: action.payload.contents,
                };
            })
            .addCase(fetchProjectV2ItemsByProjectNext.rejected, (state) => {
                state.project_next_items.fetch.end = DateTime.now().toISO();
            });


    },
});

export default page_project_next.reducer;

export {
    fetchProjectsV2ByID,
    fetchProjectV2ItemsByProjectNext,
};
