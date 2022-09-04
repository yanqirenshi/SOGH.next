import { configureStore } from '@reduxjs/toolkit';

import counterReducer from './slices/counterSlice.js';
import github from './slices/github.js';
import modals from './slices/modals.js';

export default configureStore({
  reducer: {
      github: github,
      modals: modals,
      counter: counterReducer,
  }
});
