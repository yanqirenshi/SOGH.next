import * as attr from './attributes.js';

// 組織 (org) の、番号 (number) の ProjectV2 の Item。(Item をページ送りする)
// 2 ページめからも、ProjectV2 の項目 (fields など) を取り直す。
// variables: { org: String!, number: Int!, after: String (1 ページめは null) }
const query = `query ($org: String!, $number: Int!, $after: String) {
  organization(login: $org) {
    projectV2(number: $number) {
      ${attr.projectV2()}
      fields(first: ${attr.NESTED_LIMIT}) {
        nodes {
          ${attr.projectV2Fields()}
        }
      }
      items(${attr.pagination()}) {
        nodes {
          ${attr.projectV2ItemNode()}
        }
        pageInfo {
          ${attr.pageInfo()}
        }
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.organization.projectV2.items,
};
