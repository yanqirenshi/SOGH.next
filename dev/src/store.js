import { configureStore } from '@reduxjs/toolkit';

import github from './slices/github.js';
import modals from './slices/modals.js';
import page_repositories from './slices/page_repositories.js';

export default configureStore({
  reducer: {
      github: github,
      modals: modals,
      page_repositories: page_repositories,
  }
});
