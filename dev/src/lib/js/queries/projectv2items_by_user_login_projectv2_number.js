import * as attr from './attributes.js';

const MAX_FIELD_NUM = 30;
const MAX_LABEL_NUM = 30;
const MAX_PR_NUM = 30;

const field = `
 {
   ... on ProjectV2Field { id name }
   ... on ProjectV2IterationField { id name }
   ... on ProjectV2SingleSelectField { id name }
 } `;

const query = `{
  user (login: "@user-login") {
    projectV2 (number: @projectv2-number) {
      ${attr.projectv2()}
      fields(first: ${MAX_FIELD_NUM}) {
        nodes {
          ... on ProjectV2Field { ${attr.projectv2Field()} }
          ... on ProjectV2IterationField { ${attr.projectv2FieldIteration()} }
          ... on ProjectV2SingleSelectField { ${attr.projectv2FieldSelect()} }
        }
      }
      items(${attr.page_nation()}) {
        nodes {
          id
          type
          isArchived
          createdAt
          updatedAt

          project {
            id
            number
            title
            url
            owner {
              __typename
              ... on User {
                login
              }
            }
          }

          fieldValues(first: ${MAX_FIELD_NUM}) {
            nodes {
              ... on ProjectV2ItemFieldDateValue {
                __typename
                id
                date
                field ${field}
                creator ${attr.projectV2FieldValue_Creator()}
              }
              ... on ProjectV2ItemFieldIterationValue {
                __typename
                ${attr.ProjectV2ItemFieldIterationValue()}
                field ${field}
                creator ${attr.projectV2FieldValue_Creator()}
              }
              ... on ProjectV2ItemFieldLabelValue {
                __typename
                field ${field}
                labels(first: ${MAX_LABEL_NUM}) {
                  nodes {
                    ${attr.label()}
                  }
                }
              }
              ... on ProjectV2ItemFieldMilestoneValue {
                __typename
                field ${field}
                milestone {
                  ${attr.milestone()}
                }
              }
              ... on ProjectV2ItemFieldNumberValue {
                __typename
                ${attr.ProjectV2ItemFieldNumberValue()}
                field ${field}
                creator ${attr.projectV2FieldValue_Creator()}
              }
              ... on ProjectV2ItemFieldPullRequestValue {
                __typename
                field ${field}
                pullRequests(first: ${MAX_PR_NUM}) {
                  nodes {
                    id
                    url
                    title
                  }
                }
              }
              ... on ProjectV2ItemFieldRepositoryValue {
                __typename
                field ${field}
                repository {
                  name
                  id
                  url
                }
              }
              ... on ProjectV2ItemFieldReviewerValue {
                __typename
                field ${field}
                reviewers(first: 10) {
                  nodes {
                    ... on User { id }
                    ... on Team { id }
                    ... on Mannequin { id }
                  }
                }
              }
              ... on ProjectV2ItemFieldSingleSelectValue {
                __typename
                ${attr.ProjectV2ItemFieldSingleSelectValue()}
                field ${field}
                creator ${attr.projectV2FieldValue_Creator()}
              }
              ... on ProjectV2ItemFieldTextValue {
                __typename
                ${attr.ProjectV2ItemFieldTextValue()}
                field ${field}
                creator ${attr.projectV2FieldValue_Creator()}
              }
              ... on ProjectV2ItemFieldUserValue {
                __typename
                field ${field}
                users(first: 10) {
                  nodes {
                    ${attr.user()}
                  }
                }
              }
            }
          }
          creator ${attr.projectV2FieldValue_Creator()}
          content {
            ... on DraftIssue  {
              id
              title
            }
            ... on Issue       {
              id
              url
              number
              title
            }
            ... on PullRequest {
              id
              number
              url
              title
            }
          }
        }
      }
    }
  }
}`;

export default query;
