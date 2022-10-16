import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
} from '../utils.js';

export default createAsyncThunk(
    'github/fetchIssueByID',
    async (payload) => {
        const id = payload;

        try {
            const response = await sogh.fetchIssueByID(id);

            applyCallback(payload, 'success');

            return response.data.contents;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);
