import { configureStore } from '@reduxjs/toolkit';

import github from './slices/github.js';
import modals from './slices/modals.js';
import page_issue from './slices/page_issue.js';
import page_owner from './slices/page_owner.js';
import projectV2 from './slices/page_projectV2.js';
import page_project_next_item from './slices/page_project_next_item.js';
import page_repositories from './slices/page_repositories.js';
import page_repository from './slices/page_repository.js';

export default configureStore({
  reducer: {
      github: github,
      modals: modals,
      page_issue: page_issue,
      page_owner: page_owner,
      page_projectV2: projectV2,
      page_project_next_item: page_project_next_item,
      page_repositories: page_repositories,
      page_repository: page_repository,
  }
});
