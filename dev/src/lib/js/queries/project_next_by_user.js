import * as attr from './attributes.js';

const query = `{
  node(id: "@id") {
    ... on User {
      id
      projectsNext(${attr.page_nation}) {
        nodes {
          ${attr.project_next}
        }
      }
    }
  }
}`;

export default query;
