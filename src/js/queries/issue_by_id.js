import * as attr from './attributes.js';

// id で、Issue を 1 つ。(projectItems は取らない)
// variables: { id: ID! }
const query = `query ($id: ID!) {
  node(id: $id) {
    ... on Issue {
      ${attr.issueNode()}
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.node,
};
