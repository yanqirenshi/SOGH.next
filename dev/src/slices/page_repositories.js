import { createSlice } from '@reduxjs/toolkit';

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
            })
            .addCase(fetchRepositoriesByViewer.fulfilled, (state, action) => {
            })
            .addCase(fetchRepositoriesByViewer.rejected, (state) => {
            });
    },
});

export default page_repositories.reducer;

export { fetchRepositoriesByViewer };
