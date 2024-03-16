import * as attr from './attributes.js';

const MAX_FIELD_NUM = 20;
const MAX_LABEL_NUM = 20;
const MAX_PR_NUM = 20;

const query = `{
  node (id:"@team-id"){
    ... on Team {
      id
      name
      projectsV2 (${attr.page_nation(100)}, query: "is:open") {
        edges {
          node {
            ${attr.projectv2()}
            fields(first: 10) {
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
        pageInfo {
          ${attr.page_info()}
        }
      }
    }
  }
}`;

export default query;
