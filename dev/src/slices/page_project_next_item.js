import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchProjectNextItemByID,
} from './page_project_next_item/actions.js';

export const page_project_next_item = createSlice({
    name: 'page/page_project_next_item',
    initialState: {
        project_next_item: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectNextItemByID.pending, (state) => {
                state.project_next_item.fetch.start = DateTime.now().toISO();
                state.project_next_item.fetch.end = null;
            })
            .addCase(fetchProjectNextItemByID.fulfilled, (state, action) => {
                state.project_next_item.fetch.end = DateTime.now().toISO();
                state.project_next_item.data = action.payload.contents;
            })
            .addCase(fetchProjectNextItemByID.rejected, (state) => {
                state.project_next_item.fetch.end = DateTime.now().toISO();
            });
    },
});

export default page_project_next_item.reducer;

export {
    fetchProjectNextItemByID,
};
