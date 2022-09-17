import { createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../../sogh.js';

import * as model from '../../lib/js/models/index.js';

function applyCallback (payload, type, args=[]) {
    if (!payload
        || !payload.callbacks
        || !payload.callbacks[type])
        return;

    payload.callbacks[type].apply(args);
}

export const fetchUserByID = createAsyncThunk(
    'github/fetchUserByID',
    async (payload) => {
        const sogh = payload.sogh;
        const id = payload.id;

        try {
            const response = await sogh.fetchUserByID(id);
            const node = response.data.node;

            const obj = new model.User(node);

            SOGH.node2user(node);

            applyCallback(payload, 'success');

            return {
                data: obj,
            };
        } catch (e) {
            console.error(e);

            applyCallback(payload, 'fail');

            return {
                data: null,
                error: e,
            };
        }
    },
);
