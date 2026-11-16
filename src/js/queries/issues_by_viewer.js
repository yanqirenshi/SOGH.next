import * as attr from './attributes.js';

// viewer が作った、OPEN の Issue。(ページ送りする。projectItems は取らない)
// variables: { after: String (1 ページめは null) }
const query = `query ($after: String) {
  viewer {
    issues(${attr.pagination()}, states: OPEN) {
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
        ${attr.pageInfo()}
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.viewer.issues,
};
