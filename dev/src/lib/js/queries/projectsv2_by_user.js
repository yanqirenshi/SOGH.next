import * as attr from './attributes.js';

const query = `{
  user(login: "@login") {
    projectsV2(${attr.page_nation()}) {
      nodes {
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
      pageInfo {
        ${attr.page_info()}
      }
    }
  }
}`;

export default query;
