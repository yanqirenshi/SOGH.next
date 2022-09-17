import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchProjectsNextByID,
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
        // projects_next: {
        //     data: [],
        //     fetch: {
        //         start: null,
        //         end: null,
        //         pageInfo: null,
        //     },
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectsNextByID.pending, (state) => {
                state.project_next.fetch.start = DateTime.now().toISO();
                state.project_next.fetch.end = null;
            })
            .addCase(fetchProjectsNextByID.fulfilled, (state, action) => {
                state.project_next.fetch.end = DateTime.now().toISO();
                // state.project_next.data = action.payload.data;
            })
            .addCase(fetchProjectsNextByID.rejected, (state) => {
                state.project_next.fetch.end = DateTime.now().toISO();
            });
    },
});

export default page_project_next.reducer;

export {
    fetchProjectsNextByID,
};
