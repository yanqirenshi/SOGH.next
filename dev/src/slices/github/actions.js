import { createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../../sogh.js';

function applyCallback (payload, type, args=[]) {
    if (!payload
        || !payload.callbacks
        || !payload.callbacks[type])
        return;

    payload.callbacks[type].apply(args);
}

export const connectGithub = createAsyncThunk(
    'github/connect',
    async (payload) => {
        const token = payload.token;
        try {
            const response = await SOGH.connect(token);

            const viewer = response.data;

            applyCallback(payload, 'success');

            return { data: viewer.id() };
        } catch (e) {
            console.error(e);

            applyCallback(payload, 'fail');

            return { data: null, error: e };
        }
    },
);
