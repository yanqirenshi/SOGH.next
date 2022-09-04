import moment from 'moment';

import { createSlice } from '@reduxjs/toolkit';

import {connectGithubAsync} from './github/actions.js';

export const github = createSlice({
    name: 'sogh',
    initialState: {
        viewer: null,
        connect: {
            start: null,
            end: null,
        },
        connected_at: null,
        repositories: null, // new Pool(),
    },
    reducers: {
        fetchViwerRepositories: (state)=> {console.log('y');},
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectGithubAsync.pending, (state) => {
                state.connect.start = moment().toISOString();
                state.viewer = null;
                state.connect.end = null;
            })
            .addCase(connectGithubAsync.fulfilled, (state, action) => {
                state.viewer = action.data;
                state.connect.end = moment().toISOString();
            })
            .addCase(connectGithubAsync.rejected, (state) => {
                state.viewer = null;
                state.connect.end = moment().toISOString();
            });
    },
});

export const {
    fetchViwerRepositories,
} = github.actions;

export default github.reducer;

export { connectGithubAsync };
