import * as attr from './attributes.js';

// id で、Issue を 1 つ。(projectItems は取らない)
// variables: { id: ID! }
const query = `query ($id: ID!) {
  node(id: $id) {
    ... on Issue {
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
  }
}`;

export default {
    query,
    pick: (data)=> data.node,
};
