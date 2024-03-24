import * as attr from './attributes.js';

const MAX_FIELD_NUM = 20;
const MAX_LABEL_NUM = 20;
const MAX_PR_NUM = 20;

const query = `{
  node (id:"@team-id"){
    ... on Team {
      id
      name
      projectsV2 (${attr.page_nation(10)}, query: "is:open") {
        edges {
          node {
            items (first:50) {
              ${attr.projectV2Items(MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM)}
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
