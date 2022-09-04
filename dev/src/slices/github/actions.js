import { createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../../sogh.js';

function applyCallback (payload, type, args=[]) {
    if (!payload
        || !payload.callbacks
        || !payload.callbacks[type])
        return;

    payload.callbacks[type].apply(args);
}

export const connectGithubAsync = createAsyncThunk(
    'github/connect',
    async (payload) => {
        const token = payload.token;

        try {
            const response = await SOGH.connect(token);

            applyCallback(payload, 'success');

            return {
                data: response.data.viewer.id,
            };
        } catch (e) {
            console.error(e);

            applyCallback(payload, 'fail');

            return {
                data: null,
                error: e,
            };
        }
    },
);

export const fetchRepositoriesByViewer = createAsyncThunk(
    'github/fetchRepositoriesByViewer',
    async (payload) => {
        try {
            const response = await SOGH.fetchRepositoriesByViewer();

            applyCallback(payload, 'success');

            return {
                data: null,
            };
        } catch (e) {
            console.error(e);

            applyCallback(payload, 'fail');

            return {
                data: null,
                error: e,
            };
        }
    },
);
