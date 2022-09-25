import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import { applyCallback, errorDefaultProcess } from '../utils.js';

export default createAsyncThunk(
    'github/page_project_next/fetchProjectV2ItemsByProjectNext',
    async (payload) => {
        const project_next = payload;

        try {
            const response = await sogh.fetchProjectV2ItemsByProjectNext(project_next);

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
