import * as attr from './attributes.js';

// 組織 (org) の、番号 (number) の ProjectV2 を 1 つ。(Item は、最初の 100 個まで。ページ送りしない)
// variables: { org: String!, number: Int! }
const query = `query ($org: String!, $number: Int!) {
  organization(login: $org) {
    ${attr.organizationRef()}
    projectV2(number: $number) {
      ${attr.projectV2()}
      fields(first: 20) {
        nodes {
          ${attr.projectV2Fields()}
        }
      }
      creator {
        ${attr.projectV2Creator()}
      }
      owner {
        ${attr.projectV2Owner()}
      }
      items(first: 100) {
        ${attr.projectV2Items()}
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.organization.projectV2,
};
