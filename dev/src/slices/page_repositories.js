import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchRepositoriesByViewer
} from './page_repositories/actions.js';

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
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepositoriesByViewer.pending, (state) => {
                state.fetch.start = DateTime.now().toISO();
                state.fetch.end = null;
            })
            .addCase(fetchRepositoriesByViewer.fulfilled, (state, action) => {
                state.fetch.end = DateTime.now().toISO();
                state.repositories = action.payload.data;
            })
            .addCase(fetchRepositoriesByViewer.rejected, (state) => {
                state.fetch.end = DateTime.now().toISO();
            });
    },
});

export default page_repositories.reducer;

export { fetchRepositoriesByViewer };
