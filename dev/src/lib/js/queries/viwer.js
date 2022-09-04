import * as attr from './attributes.js';

const query = `{
  viewer {
    ${attr.viewer}
  }
}`;

export default query;
