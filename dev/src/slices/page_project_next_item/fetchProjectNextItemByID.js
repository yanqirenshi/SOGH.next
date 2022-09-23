import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
    node2id,
} from '../utils.js';

export default createAsyncThunk(
    'github/page_project_next_item/fetchProjectNextItemByID',
    async (payload) => {
        const id = payload;

        try {
            const response = await sogh.fetchProjectNextItemByID(id);

            applyCallback(payload, 'success');

            return response.data;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);
