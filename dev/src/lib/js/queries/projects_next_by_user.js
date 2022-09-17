import * as attr from './attributes.js';

const query = `{
  user(login: "@login") {
    id
    projectsNext(${attr.page_nation}) {
      nodes {
        ${attr.project_next}
        creator {
          ... on User {
            ${attr.user}
          }
        }
        owner {
          ... on User {
            ${attr.user}
          }
        }
      }
      pageInfo {
        ${attr.page_info}
      }
    }
  }
}`;

export default query;
