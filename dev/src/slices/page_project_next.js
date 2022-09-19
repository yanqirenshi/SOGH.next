import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchProjectsNextByID,
    fetchProjectNextItemsByProjectNext,
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
            data: [],
            fetch: {
                start: null,
                end: null,
                pageInfo: null,
            },
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectsNextByID.pending, (state) => {
                state.project_next.fetch.start = DateTime.now().toISO();
                state.project_next.fetch.end = null;
            })
            .addCase(fetchProjectsNextByID.fulfilled, (state, action) => {
                state.project_next.fetch.end = DateTime.now().toISO();

                state.project_next.data = action.payload.contents;
            })
            .addCase(fetchProjectsNextByID.rejected, (state) => {
                state.project_next.fetch.end = DateTime.now().toISO();
            });

        builder
            .addCase(fetchProjectNextItemsByProjectNext.pending, (state) => {
                state.project_next_items.fetch.start = DateTime.now().toISO();
                state.project_next_items.fetch.end = null;
            })
            .addCase(fetchProjectNextItemsByProjectNext.fulfilled, (state, action) => {
                state.project_next_items.fetch.end = DateTime.now().toISO();
                state.project_next_items.fetch.pageInfo = action.payload.pageInfo;

                state.project_next_items.data = action.payload.contents;
            })
            .addCase(fetchProjectNextItemsByProjectNext.rejected, (state) => {
                state.project_next_items.fetch.end = DateTime.now().toISO();
            });


    },
});

export default page_project_next.reducer;

export {
    fetchProjectsNextByID,
    fetchProjectNextItemsByProjectNext,
};
