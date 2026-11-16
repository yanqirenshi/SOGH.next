import * as attr from './attributes.js';

// Issue (id) の本文を、変える。(書き込み。本文だけを変える。yanqirenshi/SOGH.next#119)
// 戻りの Issue で取る項目は、issue_by_id と同じ。(projectItems は取らない)
// variables: { id: ID!, body: String! }
const query = `mutation ($id: ID!, $body: String!) {
  updateIssue(input: {id: $id, body: $body}) {
    issue {
      ${attr.issueNode()}
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.updateIssue.issue,
};
