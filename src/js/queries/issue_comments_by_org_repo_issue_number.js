import * as attr from './attributes.js';

// コメントの pullRequest は、全部の組 (本文つき) で取る。
// (ほかのコメントのクエリは、参照の組で取る。ここは、前から本文を取っていたので、そのままにしている)
const query = `{
  organization (login:"@login") {
    repository (name:"@name") {
      issue (number:@number){
        ${attr.issue()}
        comments(orderBy: {field: UPDATED_AT, direction: DESC}, ${attr.page_nation()}) {
          totalCount
          nodes {
            ${attr.issue_comment()}
            pullRequest {
              ${attr.pull_request()}
            }
            author {
              ${attr.actor()}
            }
            editor {
              ${attr.actor()}
            }
          }
          pageInfo {
            ${attr.page_info()}
          }
        }
      }
    }
  }
}`;

export default query;
