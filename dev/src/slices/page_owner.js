import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchUserByID
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
        projects: {
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
    },
});

export default page_owner.reducer;

export { fetchUserByID };
