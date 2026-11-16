import * as attr from './attributes.js';

// チーム (teamId) の、OPEN の ProjectV2。(ページ送りする)
// variables: { teamId: ID!, after: String (1 ページめは null) }
const query = `query ($teamId: ID!, $after: String) {
  node(id: $teamId) {
    ... on Team {
      ${attr.teamRef()}
      name
      projectsV2(${attr.pagination(100)}, query: "is:open") {
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
