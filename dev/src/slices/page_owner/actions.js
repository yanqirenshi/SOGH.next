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

            const obj = SOGH.node2user(node);

            applyCallback(payload, 'success');

            return { data: obj };
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

export const fetchProjectsNextByUser = createAsyncThunk(
    'github/fetchProjectsNextByUser',
    async (payload) => {
        const sogh = payload.sogh;
        const user = payload.user;

        try {
            const response = await sogh.fetchProjectsNextByUser(user);

            const nodes = response.data.user.projectsNext.nodes;

            const id_list = [];

            for (const node of nodes) {
                const obj = SOGH.node2projectnext(node);

                id_list.push(node.id);
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
