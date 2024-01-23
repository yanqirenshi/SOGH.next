import * as attr from './attributes.js';

const MAX_FIELD_NUM = 20;
const MAX_LABEL_NUM = 20;
const MAX_PR_NUM = 20;

const query = `{
  organization (login: "@user-login") {
    id
    login
    projectV2 (number: @projectv2-number) {
      ${attr.projectv2()}
      fields(first: 20) {
        nodes {
          ${attr.projectv2Fields()}
        }
      }
      creator {
        ${attr.projectv2Creator()}
      }
      owner {
        ${attr.projectv2Owner()}
      }
      items (first:100) {
        ${attr.projectV2Items(MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM)}
      }
    }
  }
}`;

export default query;
