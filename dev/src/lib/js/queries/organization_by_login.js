import * as attr from './attributes.js';

const query = `{
  organization(login: "@login") {
    ${attr.organization()}
    teams(first: 100) {
      edges {
        node {
          ${attr.team()}
        }
      }
    }
    repositories(first: 10) {
      edges {
        node {
          ${attr.repositories()}
        }
      }
    }
    projectsV2(first: 10) {
      edges {
        node {
          ${attr.projectv2()}
        }
      }
    }
  }
}`;

export default query;
