import * as attr from './attributes.js';

// チーム (teamId) の、OPEN の ProjectV2 と、その Item。(ProjectV2 をページ送りする)
// 入れ子が深いので、ProjectV2 は 1 ページに 10 個、Item は ProjectV2 ごとに 50 個まで。(Item はページ送りしない)
// variables: { teamId: ID!, after: String (1 ページめは null) }
const query = `query ($teamId: ID!, $after: String) {
  node(id: $teamId) {
    ... on Team {
      ${attr.teamRef()}
      name
      projectsV2(${attr.pagination(10)}, query: "is:open") {
        edges {
          node {
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
            items(first: 50) {
              ${attr.projectV2Items()}
            }
          }
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
    pick: (data)=> data.node.projectsV2,
};
