import { configureStore } from '@reduxjs/toolkit';

import github from './slices/github.js';
import modals from './slices/modals.js';

export default configureStore({
  reducer: {
      github: github,
      modals: modals,
  }
});
