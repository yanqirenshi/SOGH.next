import * as attr from './attributes.js';

const query = `{
  viewer {
    ${attr.user()}
    organizations (first:100) {
      edges {
        node {
          id
          name
          url
          avatarUrl
          description
          descriptionHTML
        }
      }
    }
  }
}`;

export default query;
