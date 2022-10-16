import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
} from '../utils.js';

export default createAsyncThunk(
    'github/fetchIssueComments',
    async (payload) => {
        const issue = payload;

        try {
            const response = await sogh.fetchIssueCommentsByIssueID(issue.id());

            applyCallback(payload, 'success');

            return response.data;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);
