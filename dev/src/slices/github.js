import moment from 'moment';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../sogh.js';

export const connectGithubAsync = createAsyncThunk(
    'github/connect',
    async (payload) => {
        try {
            const response = await SOGH.connect(payload.token);
            console.log();
            return {
                status: 'idle',
                data: response.data.viewer.id,
            };
        } catch (e) {
            console.error(e);
            return {
                status: 'failed',
                data: null,
                error: e,
            };
        }
    },
);

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
