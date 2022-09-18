import { createAsyncThunk } from '@reduxjs/toolkit';

import { applyCallback, errorDefaultProcess } from '../utils.js';

export default createAsyncThunk(
    'github/fetchRepositoriesByViewer',
    async (payload) => {
        const sogh = payload;

        try {
            const response = await sogh.fetchRepositoriesByViewer();

            if (response.status==='error')
                throw response.error;

            applyCallback(payload, 'success');

            return response.data;


        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);
