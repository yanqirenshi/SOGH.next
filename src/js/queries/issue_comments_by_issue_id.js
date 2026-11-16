import * as attr from './attributes.js';

// id の Issue の、コメント。(ページ送りする)
// variables: { id: ID!, after: String (1 ページめは null) }
const query = `query ($id: ID!, $after: String) {
  node(id: $id) {
    ... on Issue {
      comments(orderBy: {field: UPDATED_AT, direction: DESC}, ${attr.pagination()}) {
        totalCount
        nodes {
          ${attr.issueCommentNode()}
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
    pick: (data)=> data.node.comments,
};
