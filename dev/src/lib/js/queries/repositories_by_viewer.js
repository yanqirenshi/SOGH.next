import * as attr from './attributes.js';

const query = `
{
  viewer {
    repositories(${attr.page_nation}) {
      nodes {
        ${attr.repositories}
        owner {
          ${attr.owner}
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}
`;

export default query;
