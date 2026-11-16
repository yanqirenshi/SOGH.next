import * as attr from './attributes.js';

// コメント (id) の本文を、変える。(書き込み)
// variables: { id: ID!, body: String! }
const query = `mutation ($id: ID!, $body: String!) {
  updateIssueComment(input: {id: $id, body: $body}) {
    issueComment {
      ${attr.issueCommentNode()}
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.updateIssueComment.issueComment,
};
