import * as attr from './attributes.js';

// viewer のリポジトリ。(ページ送りする)
// variables: { after: String (1 ページめは null) }
const query = `query ($after: String) {
  viewer {
    repositories(${attr.pagination()}) {
      nodes {
        ${attr.repositories()}
      }
      pageInfo {
        ${attr.pageInfo()}
      }
    }
  }
}`;

export default {
    query,
    pick: (data)=> data.viewer.repositories,
};
