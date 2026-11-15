import * as attr from './attributes.js';

// variables: { id: ID!, body: String! }
const query = `mutation ($id: ID!, $body: String!) {
  updateIssueComment(input: {id: $id, body: $body}) {
    issueComment {
      ${attr.issueCommentNode()}
    }
  }
}`;

export default query;
