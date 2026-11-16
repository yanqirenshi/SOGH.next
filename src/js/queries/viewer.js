import * as attr from './attributes.js';

// viewer (トークンの持ち主)。
// variables: 無し
const query = `query {
  viewer {
    ${attr.user()}
  }
}`;

export default {
    query,
    pick: (data)=> data.viewer,
};
