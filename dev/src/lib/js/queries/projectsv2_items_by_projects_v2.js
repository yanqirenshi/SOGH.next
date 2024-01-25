import * as attr from './attributes.js';

const MAX_FIELD_NUM = 30;
const MAX_LABEL_NUM = 30;
const MAX_PR_NUM = 30;

const query = `{
  node(id: "@id") {
    ... on ProjectV2 {
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
          ${attr.projectV2ItemFieldValues(MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM)}
          creator ${attr.projectV2FieldValue_Creator()}
          content {
            ... on DraftIssue  {
              ${attr.projectV2ItemContentDraftIssue()}
            }
            ... on Issue       {
              ${attr.projectV2ItemContentIssue()}
            }
            ... on PullRequest {
              ${attr.projectV2ItemContentPullRequest()}
            }
          }
        }
      }
    }
  }
}`;

export default query;
