import { configureStore } from '@reduxjs/toolkit';

import github from './slices/github.js';
import modals from './slices/modals.js';
import page_owner from './slices/page_owner.js';
import page_project_next from './slices/page_project_next.js';
import page_repositories from './slices/page_repositories.js';
import page_repository from './slices/page_repository.js';

export default configureStore({
  reducer: {
      github: github,
      modals: modals,
      page_owner: page_owner,
      page_project_next: page_project_next,
      page_repositories: page_repositories,
      page_repository: page_repository,
  }
});
