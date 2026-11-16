import * as attr from './attributes.js';

// id で、ProjectV2Item を 1 つ。
// variables: { id: ID! }
const query = `query ($id: ID!) {
  node(id: $id) {
    __typename
    ... on ProjectV2Item {
      ${attr.projectV2ItemNode()}
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.node,
};
