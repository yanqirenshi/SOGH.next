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

export const fetchRepositoriesByViewer = createAsyncThunk(
    'github/fetchRepositoriesByViewer',
    async (payload) => {
        const sogh = payload;

        try {
            const response = await sogh.fetchRepositoriesByViewer();

            const nodes = response.data.viewer.repositories.nodes;

            const id_list = [];
            for (const node of nodes) {
                const obj = new model.Repository(node);

                SOGH.node2repository(node);

                id_list.push(obj.id());
            }

            applyCallback(payload, 'success');

            return {
                data: id_list,
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
