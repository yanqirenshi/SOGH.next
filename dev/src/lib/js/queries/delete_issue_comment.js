import * as attr from './attributes.js';

// variables: { id: ID! }
const query = `mutation ($id: ID!) {
  deleteIssueComment(input: {id: $id}) {
    clientMutationId
  }
}`;

export default query;
