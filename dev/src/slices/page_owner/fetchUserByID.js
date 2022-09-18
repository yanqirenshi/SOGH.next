import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
} from '../utils.js';

const fetchUserByID = createAsyncThunk(
    'github/fetchUserByID',
    async (payload) => {
        const id = payload;

        try {
            const response = await sogh.fetchUserByID(id);

            const out = response.data.id();

            applyCallback(payload, 'success');

            return out;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);

export default fetchUserByID;
