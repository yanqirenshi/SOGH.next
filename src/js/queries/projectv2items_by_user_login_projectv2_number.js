import * as attr from './attributes.js';

// ユーザー (login) の、番号 (number) の ProjectV2 の Item。(Item をページ送りする)
// 2 ページめからも、ProjectV2 の項目 (fields など) を取り直す。
// variables: { login: String!, number: Int!, after: String (1 ページめは null) }
const query = `query ($login: String!, $number: Int!, $after: String) {
  user(login: $login) {
    projectV2(number: $number) {
      ${attr.projectV2()}
      fields(first: ${attr.NESTED_LIMIT}) {
        nodes {
          ... on ProjectV2Field { ${attr.projectV2Field()} }
          ... on ProjectV2IterationField { ${attr.projectV2FieldIteration()} }
          ... on ProjectV2SingleSelectField { ${attr.projectV2FieldSelect()} }
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
    pick: (data)=> data.user.projectV2.items,
};
