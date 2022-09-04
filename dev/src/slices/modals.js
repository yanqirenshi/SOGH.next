import { createSlice } from '@reduxjs/toolkit';

import Pool from '../js/Pool.js';

export const modals = createSlice({
    name: 'sogh',
    initialState: {
        opened: null,
        list: {
            connect_github: null,
        },
    },
    reducers: {
        open: (state, action)=> {
            const code = action.payload.code;
            const data = action.payload.data;

            if (!(code in state.list))
                return;

            state.list[code] = data || true;
            state.opened = code;
        },
        close: (state, action)=> {
            state.opened = null;
        },
    }
});

export const {
    open, close,
} = modals.actions;

export default modals.reducer;
