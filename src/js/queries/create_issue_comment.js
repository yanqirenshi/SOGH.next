import * as attr from './attributes.js';

// variables: { id: ID!, body: String! }
const query = `mutation ($id: ID!, $body: String!) {
  addComment(input:{subjectId: $id, body: $body}) {
    commentEdge {
      node {
        ${attr.issueCommentNode()}
      }
    }
  }
}`;

export default query;
