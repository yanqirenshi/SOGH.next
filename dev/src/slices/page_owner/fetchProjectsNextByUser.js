import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
    nodes2ids,
} from '../utils.js';

const fetchProjectsNextByUser = createAsyncThunk(
    'github/fetchProjectsNextByUser',
    async (payload) => {
        const user = payload;

        try {
            const response = await sogh.fetchProjectsNextByUser(user);

            applyCallback(payload, 'success');

            return response.data.map(d=>d.id());
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);

export default fetchProjectsNextByUser;
