import * as attr from './attributes.js';

// 組織 (org) の、リポジトリ (repo) の、番号 (number) の Issue の、コメント。(ページ送りする)
// コメントの pullRequest は、全部の組 (本文つき) で取る。
// (ほかのコメントのクエリは、参照の組で取る。ここは、前から本文を取っていたので、そのままにしている)
// variables: { org: String!, repo: String!, number: Int!, after: String (1 ページめは null) }
const query = `query ($org: String!, $repo: String!, $number: Int!, $after: String) {
  organization(login: $org) {
    repository(name: $repo) {
      issue(number: $number) {
        ${attr.issue()}
        comments(orderBy: {field: UPDATED_AT, direction: DESC}, ${attr.pagination()}) {
          totalCount
          nodes {
            ${attr.issueComment()}
            pullRequest {
              ${attr.pullRequest()}
            }
            author {
              ${attr.actor()}
            }
            editor {
              ${attr.actor()}
            }
          }
          pageInfo {
            ${attr.pageInfo()}
          }
        }
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.organization.repository.issue.comments,
};
