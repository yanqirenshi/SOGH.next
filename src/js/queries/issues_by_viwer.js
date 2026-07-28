import * as attr from './attributes.js';

const query = `{
  viewer {
    issues(after: "", first: 100, states: OPEN) {
      nodes {
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
      }
      pageInfo {
        ${attr.page_info()}
      }
    }
  }
}`;

export default query;
