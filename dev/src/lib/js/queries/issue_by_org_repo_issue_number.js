import * as attr from './attributes.js';

const query = `{
  organization (login:"@login") {
    repository (name:"@name") {
      issue (number:@number){
        ${attr.issue()}
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
              id
              ${attr.projectV2ItemFieldValues(30, 30, 30)}
              project {
                id
                number
                title
                url
              }
            }
          }
        }
        comments(orderBy: {field: UPDATED_AT, direction: DESC}, first: 100) {
          totalCount
          nodes {
            ${attr.issue_comment()}
            pullRequest {
              id
              number
              title
              url
            }
            author {
              ${attr.actor()}
              ... on Bot {
                id
              }
              ... on EnterpriseUserAccount {
                id
              }
              ... on Mannequin {
                id
              }
              ... on Organization {
                id
              }
              ... on User {
                id
              }
            }
            editor {
              ${attr.actor()}
              avatarUrl
              ... on Bot {
                id
              }
              ... on EnterpriseUserAccount {
                id
                name
              }
              ... on Mannequin {
                id
                email
              }
              ... on Organization {
                id
                email
              }
              ... on User {
                id
              }
            }
          }
        }
      }
    }
  }
}`;

export default query;
