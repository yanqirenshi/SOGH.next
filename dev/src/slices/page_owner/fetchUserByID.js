import { createAsyncThunk } from '@reduxjs/toolkit';

import sogh from '../../sogh.js';

import {
    applyCallback,
    errorDefaultProcess,
    node2id,
} from '../utils.js';

const fetchUserByID = createAsyncThunk(
    'github/fetchUserByID',
    async (payload) => {
        const id = payload;

        try {
            const response = await sogh.fetchUserByID(id);

            const node = response.data.node;

            const out = node2id (node, (node)=>sogh.node2user(node));

            applyCallback(payload, 'success');

            return out;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);

export default fetchUserByID;
