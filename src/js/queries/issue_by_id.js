import * as attr from './attributes.js';

const query = `{
  node(id: "@id") {
    ... on Issue {
      ${attr.issue()}
      author {
        ${attr.actor()}
      }
      repository {
        ${attr.repositories()}
      }
      milestone {
        ${attr.milestone()}
      }
      assignees(first: 10) {
        nodes {
          ${attr.user()}
        }
      }
      labels(first: 10) {
        nodes {
          ${attr.label()}
        }
      }
    }
  }
}`;

export default query;
