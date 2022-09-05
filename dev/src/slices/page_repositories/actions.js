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

            const repositories = nodes.map(node=>new model.Repository(node));

            applyCallback(payload, 'success');

            return {
                data: repositories.map(d=>d.id()),
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
