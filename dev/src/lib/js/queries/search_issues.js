import * as attr from './attributes.js';

const MAX_FIELD_NUM = 30;
const MAX_LABEL_NUM = 30;
const MAX_PR_NUM = 30;

const query = `{
  search(query: "@QUERY", type: ISSUE, first: 100) {
    edges {
      node {
        ... on Issue {
          ${attr.issue()}

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

          projectItems (first:1) {
            ${attr.projectV2Items(MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM)}
          }

          projectCards(first: 1) {
            nodes {
              ${attr.project_card()}
              column {
                ${attr.project_column()}
                project {
                  ${attr.project()}
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      ${attr.page_info()}
    }
  }
}`;

export default query;
