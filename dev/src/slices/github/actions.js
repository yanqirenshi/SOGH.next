import { createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../../sogh.js';

function applyCallback (callbacks, type, args=[]) {
    if (!callbacks || !callbacks[type])
        return;

    callbacks[type].apply(args);
}

export const connectGithubAsync = createAsyncThunk(
    'github/connect',
    async (payload) => {
        const token = payload.token;
        const clbks = payload.callbacks;

        try {
            const response = await SOGH.connect(token);

            applyCallback(clbks, 'success');

            return {
                data: response.data.viewer.id,
            };
        } catch (e) {
            console.error(e);

            applyCallback(clbks, 'fail');

            return {
                data: null,
                error: e,
            };
        }
    },
);
