import * as attr from './attributes.js';

// ユーザー (login) の、番号 (number) の ProjectV2 を 1 つ。(Item は取らない)
// variables: { login: String!, number: Int! }
const query = `query ($login: String!, $number: Int!) {
  user(login: $login) {
    projectV2(number: $number) {
      ${attr.projectV2()}
      fields(first: 100) {
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
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.user.projectV2,
};
