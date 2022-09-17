import * as attr from './attributes.js';

const query = `{
  node(id: "@id") {
    ... on ProjectNext {
      ${attr.project_next}
      creator {
        ... on User {
          ${attr.user}
        }
      }
      owner {
        ... on User {
          ${attr.user}
        }
      }
      fields(first: 100) {
        nodes {
          ${attr.project_next_item}
        }
      }
    }
  }
}
`;

export default query;
