import * as attr from './attributes.js';

const query = `{
  user (login: "@user-login") {
    projectV2 (number: @projectv2-number) {
      ${attr.projectv2()}
      fields(first: 100) {
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
    }
  }
}`;

export default query;
