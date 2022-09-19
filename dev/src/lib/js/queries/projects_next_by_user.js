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
        fields(first: 100) {
          nodes {
            ${attr.project_next_fields}
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
