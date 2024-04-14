import * as attr from './attributes.js';

const query = `mutation {
  deleteIssueComment(input: {id: "@comment-id"}) {
    clientMutationId
  }
}`;

export default query;
