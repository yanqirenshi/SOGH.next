import * as attr from './attributes.js';

const query = `{
  node(id: "@id") {
    ... on Issue {
      comments(orderBy: {field: UPDATED_AT, direction: DESC}, ${attr.page_nation()}) {
        totalCount
        nodes {
          ${attr.issueCommentNode()}
        }
        pageInfo {
          ${attr.page_info()}
        }
      }
    }
  }
}`;

export default query;
