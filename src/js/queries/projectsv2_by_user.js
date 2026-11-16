import * as attr from './attributes.js';

// ユーザー (login) の ProjectV2。(ページ送りする)
// variables: { login: String!, after: String (1 ページめは null) }
const query = `query ($login: String!, $after: String) {
  user(login: $login) {
    projectsV2(${attr.pagination()}) {
      nodes {
        ${attr.projectV2()}
        fields(first: 10) {
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
      pageInfo {
        ${attr.pageInfo()}
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.user.projectsV2,
};
