import * as attr from './attributes.js';

// Issue (id) に、コメントを足す。(書き込み)
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

export default {
    query,
    pick: (data)=> data.addComment.commentEdge.node,
};
