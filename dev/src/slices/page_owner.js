import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchUserByID,
    fetchProjectsNextByUser,
} from './page_owner/actions.js';

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
        // fetch: {
        //     start: null,
        //     end: null,
        //     pageInfo: null,
        // },
        // repositories: [],
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserByID.pending, (state) => {
                state.user.fetch.start = DateTime.now().toISO();
                state.user.fetch.end = null;
            })
            .addCase(fetchUserByID.fulfilled, (state, action) => {
                state.user.fetch.end = DateTime.now().toISO();
                state.user.data = action.payload.data.id();
            })
            .addCase(fetchUserByID.rejected, (state) => {
                state.user.fetch.end = DateTime.now().toISO();
            });

        builder
            .addCase(fetchProjectsNextByUser.pending, (state) => {
                state.projects_next.fetch.start = DateTime.now().toISO();
                state.projects_next.fetch.end = null;
            })
            .addCase(fetchProjectsNextByUser.fulfilled, (state, action) => {
                state.projects_next.fetch.end = DateTime.now().toISO();
                state.projects_next.data = action.payload.data;
            })
            .addCase(fetchProjectsNextByUser.rejected, (state) => {
                state.projects_next.fetch.end = DateTime.now().toISO();
            });
    },
});

export default page_owner.reducer;

export {
    fetchUserByID,
    fetchProjectsNextByUser,
};
