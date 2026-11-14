import * as attr from './attributes.js';

// variables: { id: ID!, body: String! }
const query = `mutation ($id: ID!, $body: String!) {
  updateIssueComment(input: {id: $id, body: $body}) {
    issueComment {
      ${attr.issue_comment()}
      pullRequest {
        id
        number
        title
        url
      }
      author {
        ${attr.actor()}
        ... on Bot { id }
        ... on EnterpriseUserAccount { id }
        ... on Mannequin { id }
        ... on Organization { id }
        ... on User { id }
      }
      editor {
        ${attr.actor()}
        avatarUrl
        ... on Bot { id }
        ... on EnterpriseUserAccount { id name }
        ... on Mannequin { id email }
        ... on Organization { id email }
        ... on User { id }
      }
    }
  }
}`;

export default query;
