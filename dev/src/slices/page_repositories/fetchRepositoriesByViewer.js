import { createAsyncThunk } from '@reduxjs/toolkit';

import SOGH from '../../sogh.js';

import * as model from '../../lib/js/models/index.js';

import { applyCallback, errorDefaultProcess } from '../utils.js';

export default createAsyncThunk(
    'github/fetchRepositoriesByViewer',
    async (payload) => {
        const sogh = payload;

        try {
            const response = await sogh.fetchRepositoriesByViewer();

            if (response.status==='error')
                throw response.error;

            const repositories = response.data;

            const id_list = repositories.map(d=>d.id());

            applyCallback(payload, 'success');

            return {
                data: repositories.map(d=>d.id()),
            };
        } catch (e) {
            applyCallback(payload, 'fail');

            return errorDefaultProcess(e, payload);
        }
    },
);
