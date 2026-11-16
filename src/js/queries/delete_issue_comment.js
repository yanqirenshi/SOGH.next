// コメント (id) を、消す。(書き込み)
// variables: { id: ID! }
const query = `mutation ($id: ID!) {
  deleteIssueComment(input: {id: $id}) {
    clientMutationId
  }
}`;

export default {
    query,
    pick: (data)=> data.deleteIssueComment,
};
