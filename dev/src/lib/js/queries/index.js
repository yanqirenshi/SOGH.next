// https://docs.github.com/en/graphql/overview/explorer

import assignees_by_repository from './assignees_by_repository.js';
import create_issue from './create_issue.js';
import issues_by_milestone from './issues_by_milestone.js';
import issues_by_report_label from './issues_by_report_label.js';
import issues_by_repository from './issues_by_repository.js';
import issues_by_viwer from './issues_by_viwer.js';
import issues_open_by_label from './issues_open_by_label.js';
import issues_open_by_project_column from './issues_open_by_project_column.js';
import issues_open_by_repository from './issues_open_by_repository.js';
import labels_by_repository from './labels_by_repository.js';
import milestone_by_reposigory from './milestones_by_repository.js';
import project_by_id from './project_by_id.js';
import projects_by_repository from './projects_by_repository.js';
import repository from './repository.js';
import search_issues from './search_issues.js';
import update_issue_body from './update_issue_body.js';
import viwer from './viwer.js';

export {
    issues_by_milestone,
    issues_by_report_label,
    issues_by_repository,
    issues_by_viwer,
    issues_open_by_project_column,
    issues_open_by_repository,
    issues_open_by_label,
    milestone_by_reposigory,
    projects_by_repository,
    assignees_by_repository,
    labels_by_repository,
    project_by_id,
    repository,
    viwer,
    create_issue,
    update_issue_body,
    search_issues,
}
