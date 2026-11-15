import * as attr from './attributes.js';

const query = `{
   node(id: "@id") {
    ... on ProjectV2 {
      ${attr.projectv2()}
      fields(first: 100) {
        nodes {
          ${attr.projectv2Fields()}
        }
      }
      creator {
        ${attr.projectv2Creator()}
      }
      owner {
        ${attr.projectv2Owner()}
      }
    }
  }
}
`;

export default query;
