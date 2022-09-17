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

            const nodes = response.data.user.projectsNext.nodes;

            const out = nodes2ids(nodes, (node)=> sogh.node2projectnext(node));

            applyCallback(payload, 'success');

            return out;
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);

export default fetchProjectsNextByUser;
