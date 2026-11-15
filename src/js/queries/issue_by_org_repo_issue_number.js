import * as attr from './attributes.js';

const query = `{
  organization (login:"@login") {
    repository (name:"@name") {
      issue (number:@number){
        ${attr.issue()}
        author {
          ${attr.actor()}
        }
        repository {
          ${attr.repositories()}
        }
        milestone {
          ${attr.milestone()}
        }
        assignees(first: 10) {
          nodes {
            ${attr.user()}
          }
        }
        labels(first: 10) {
          nodes {
            ${attr.label()}
          }
        }
        projectItems (first:1) {
          edges {
            node {
              ${attr.ProjectV2Item()}
              ${attr.projectV2ItemFieldValues(30, 30, 30)}
              project {
                ${attr.projectv2()}
                owner {
                  ${attr.projectv2Owner()}
                }
              }
            }
          }
        }
        comments(orderBy: {field: UPDATED_AT, direction: DESC}, first: 100) {
          totalCount
          nodes {
            ${attr.issueCommentNode()}
          }
        }
      }
    }
  }
}`;

export default query;
