import moment from 'moment';

import { createSlice } from '@reduxjs/toolkit';

import {
    connectGithub,
} from './github/actions.js';

export const github = createSlice({
    name: 'sogh',
    initialState: {
        viewer: null,
        connect: {
            start: null,
            end: null,
        },
        connected_at: null,
    },
    // reducers: {
    //     fetchViwerRepositories: (state)=> {console.log('y');},
    // },
    extraReducers: (builder) => {
        builder
            .addCase(connectGithub.pending, (state) => {
                state.connect.start = moment().toISOString();
                state.connect.end = null;
            })
            .addCase(connectGithub.fulfilled, (state, action) => {
                state.viewer = action.payload.data;
                state.connect.end = moment().toISOString();
            })
            .addCase(connectGithub.rejected, (state) => {
                state.viewer = null;
                state.connect.end = moment().toISOString();
            });
    },
});

// export const {
//     fetchViwerRepositories,
// } = github.actions;

export default github.reducer;

export { connectGithub };
