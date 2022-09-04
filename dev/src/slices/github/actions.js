import { createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../../sogh.js';

export const connectGithubAsync = createAsyncThunk(
    'github/connect',
    async (payload) => {
        try {
            const response = await SOGH.connect(payload.token);

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
