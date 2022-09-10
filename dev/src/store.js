import { configureStore } from '@reduxjs/toolkit';

import github from './slices/github.js';
import modals from './slices/modals.js';
import page_repositories from './slices/page_repositories.js';
import page_repository from './slices/page_repository.js';

export default configureStore({
  reducer: {
      github: github,
      modals: modals,
      page_repository: page_repository,
      page_repositories: page_repositories,
  }
});
