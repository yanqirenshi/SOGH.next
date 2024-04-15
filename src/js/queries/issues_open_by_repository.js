import * as attr from './attributes.js';

const query = `{
  repository(name: "@name", owner: "@owner") {
    issues(after: "", first: 100, states: OPEN) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ${attr.issue()}
        repository {
          ${attr.repositories()}
        }
        projectCards(first: 10) {
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
      }
    }
  }
}
`;

export default query;
