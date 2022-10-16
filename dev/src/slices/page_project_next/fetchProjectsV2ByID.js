import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
} from '../utils.js';

export default createAsyncThunk(
    'github/page_project_next/fetchProjectsV2ByID',
    async (payload) => {
        const id = payload;

        try {
            const response = await sogh.fetchProjectsV2ByID(id);

            applyCallback(payload, 'success');

            return response.data;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);
