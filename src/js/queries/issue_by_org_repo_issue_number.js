import * as attr from './attributes.js';

// 組織 (org) の、リポジトリ (repo) の、番号 (number) の Issue を 1 つ。(projectItems とコメントも取る)
// variables: { org: String!, repo: String!, number: Int! }
const query = `query ($org: String!, $repo: String!, $number: Int!) {
  organization(login: $org) {
    repository(name: $repo) {
      issue(number: $number) {
        ${attr.issue()}
        author {
          ${attr.actor()}
        }
        repository {
          ${attr.repositories()}
        }
        milestone {
          ${attr.milestone()}
        }
        assignees(first: 10) {
          nodes {
            ${attr.user()}
          }
        }
        labels(first: 10) {
          nodes {
            ${attr.label()}
          }
        }
        projectItems(first: 1) {
          edges {
            node {
              ${attr.projectV2Item()}
              ${attr.projectV2ItemFieldValues()}
              project {
                ${attr.projectV2()}
                owner {
                  ${attr.projectV2Owner()}
                }
              }
            }
          }
        }
        comments(orderBy: {field: UPDATED_AT, direction: DESC}, first: 100) {
          totalCount
          nodes {
            ${attr.issueCommentNode()}
          }
        }
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.organization.repository.issue,
};
