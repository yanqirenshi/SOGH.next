import * as attr from './attributes.js';

const query = `{
  node(id: "@column-id") {
    id
    ... on ProjectColumn {
      id
      cards(after: "", first: 100) {
        edges {
          node {
            id
            note
            state
            isArchived
            content {
              ... on Issue {
                ${attr.issue()}
                author {
                  ${attr.actor()}
                }
                repository {
                  ${attr.repositories()}
                }
                projectCards(first: 10) {
                  nodes {
                    ${attr.project_card()}
                    column {
                      ${attr.project_column()}
                      project {
                        ${attr.project()}
                      }
                    }
                  }
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
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`;

export default query;
