export function page_nation (count=100) {
    return `after: "", first: ${count}`;
}

export function page_info () {
    return `endCursor
hasNextPage
hasPreviousPage
startCursor`;
}

export function user () {
    return `id
login
name
avatarUrl
url
email
company
createdAt
updatedAt`;
}

export function repositories () {
    return `id
name
url
description
descriptionHTML
createdAt
updatedAt
pushedAt`;
}

export function issue () {
    return `id
url
title
createdAt
closedAt
updatedAt
number
body
bodyHTML`;
}

export function issue_comment (){
    return `id
url
body
bodyHTML
resourcePath
publishedAt
lastEditedAt
minimizedReason
isMinimized
includesCreatedEdit
databaseId
createdViaEmail
authorAssociation
createdAt
updatedAt`;
}

export function milestone () {
    return `id
url
title
state
number
dueOn`;
}

export function label () {
    return `id
name
url
color`;
}

export function pull_request () {
    return `
 id
 number
 url
 title
 body
 bodyHTML
 closedAt
 updatedAt
 closedAt
 state
 closed
`;
}

export function owner () {
    return `id
login
avatarUrl
url`;
}

export function actor () {
    return `login
url
avatarUrl
resourcePath`;
}

export function project_next () {
    return `id
number
url
title
description
public
viewerCanUpdate
shortDescription
createdAt
updatedAt
closedAt
closed`;
}

export function projectv2 () {
    return `id
number
url
public
title
readme
resourcePath
shortDescription
viewerCanUpdate
closed
createdAt
updatedAt
closedAt`;
}

export function projectv2Fields () {
    return `
 ... on ProjectV2Field {
   ${projectv2Field()}
 }
 ... on ProjectV2SingleSelectField {
   ${projectv2FieldSelect()}
   options {
     id
     name
     nameHTML
   }
 }
 ... on ProjectV2IterationField {
   ${projectv2FieldIteration()}
   configuration {
     startDay
     duration
     iterations {
       duration
       id
       startDate
       title
       titleHTML
     }
     completedIterations {
       duration
       id
       startDate
       title
       titleHTML
     }
   }
 }
`;
}

export function projectv2Creator () {
    return `
 ${actor()}
 ... on User { id }
 ... on Organization { id }
 ... on Mannequin { id }
 ... on EnterpriseUserAccount { id }
 ... on Bot { id }
`;
}

export function projectv2Owner () {
    return `
 id
 ... on Issue { id }
 ... on User { id }
 ... on PullRequest { id }
 ... on Organization { id }
`;
}

export function projectv2FieldIteration () {
    return `id
name
dataType
createdAt
updatedAt`;
}

export function projectv2FieldSelect () {
    return `id
name
dataType
createdAt
updatedAt`;
}

export function projectv2Field () {
    return `id
name
dataType
createdAt
updatedAt`;
}

export function project_next_fields () {
    return `id
name
dataType
settings
createdAt
updatedAt`;
}

export function project_next_item () {
    return `id
title
createdAt
updatedAt
isArchived
type`;
}

export function project_next_item_field_value () {
    return `id
createdAt
updatedAt
value`;
}

/* ****************************************************************
 * Project V2 Item
 * **************************************************************** */

export function ProjectV2Item () {
    return `
 id
 type
 isArchived
 createdAt
 updatedAt
`;
}

export function projectV2FieldValue_Creator () {
    return `{
url
resourcePath
login
avatarUrl
... on User { id name }
... on Organization { id }
... on Mannequin { id }
... on EnterpriseUserAccount { id }
... on Bot { id }
}`;
}

const field = `
 {
   ... on ProjectV2Field { id name }
   ... on ProjectV2IterationField { id name }
   ... on ProjectV2SingleSelectField { id name }
 } `;

export function ProjectV2ItemFieldDateValue () {
    return `
 __typename
 id
 date
 field ${field}
 creator ${projectV2FieldValue_Creator()}
`;
}

export function ProjectV2ItemFieldIterationValue () {
    return `
 __typename
 id
 title
 titleHTML
 duration
 iterationId
 startDate
 createdAt
 updatedAt
 field ${field}
 creator ${projectV2FieldValue_Creator()}
`;
}

export function ProjectV2ItemFieldLabelValue (MAX_LABEL_NUM) {
    return `
 __typename
 field ${field}
 labels(first: ${MAX_LABEL_NUM}) {
   nodes {
     ${label()}
   }
 }
`;
}

export function ProjectV2ItemFieldMilestoneValue () {
    return `
 __typename
 field ${field}
 milestone {
   ${milestone()}
 }
`;
}

export function ProjectV2ItemFieldNumberValue () {
    return `
 __typename
 id
 number
 createdAt
 updatedAt
 field ${field}
 creator ${projectV2FieldValue_Creator()}
`;
}

export function ProjectV2ItemFieldPullRequestValue (MAX_PR_NUM) {
    return `
 __typename
 field ${field}
 pullRequests(first: ${MAX_PR_NUM}) {
   nodes {
     id
     url
     title
   }
 }
`;
}

export function ProjectV2ItemFieldRepositoryValue () {
    return `
 __typename
 field ${field}
 repository {
   name
   id
   url
 }
`;
}

export function ProjectV2ItemFieldReviewerValue () {
    return `
 __typename
 field ${field}
 reviewers(first: 10) {
   nodes {
     ... on User { id }
     ... on Team { id }
     ... on Mannequin { id }
   }
 }
`;
}

export function ProjectV2ItemFieldSingleSelectValue () {
    return `
 __typename
 id
 name
 nameHTML
 optionId
 createdAt
 updatedAt
 field ${field}
 creator ${projectV2FieldValue_Creator()}

`;
}

export function ProjectV2ItemFieldTextValue () {
    return `
 __typename
 id
 text
 createdAt
 updatedAt
 field ${field}
 creator ${projectV2FieldValue_Creator()}
`;
}

export function ProjectV2ItemFieldUserValue () {
    return `
 __typename
 field ${field}
 users(first: 10) {
   nodes {
     ${user()}
   }
 }
`;
}

export function projectV2ItemContentDraftIssue () {
    return ` {
 __typename
 id
 title
 }`;
}

export function projectV2ItemContentIssue () {
    return ` {
 __typename
 id
 url
 number
 title
 }`;
}

export function projectV2ItemContentPullRequest () {
    return ` {
 __typename
 id
 number
 url
 title
 }`;
}

export function projectV2ItemFieldValues (MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM) {
    return `
 fieldValues(first: ${MAX_FIELD_NUM}) {
   nodes {
     ... on ProjectV2ItemFieldDateValue {
       ${ProjectV2ItemFieldDateValue()}
     }
     ... on ProjectV2ItemFieldIterationValue {
       ${ProjectV2ItemFieldIterationValue()}
     }
     ... on ProjectV2ItemFieldLabelValue {
       ${ProjectV2ItemFieldLabelValue(MAX_LABEL_NUM)}
     }
     ... on ProjectV2ItemFieldMilestoneValue {
       ${ProjectV2ItemFieldMilestoneValue()}
     }
     ... on ProjectV2ItemFieldNumberValue {
       ${ProjectV2ItemFieldNumberValue()}
     }
     ... on ProjectV2ItemFieldPullRequestValue {
       ${ProjectV2ItemFieldPullRequestValue(MAX_PR_NUM)}
     }
     ... on ProjectV2ItemFieldRepositoryValue {
       ${ProjectV2ItemFieldRepositoryValue()}
     }
     ... on ProjectV2ItemFieldReviewerValue {
       ${ProjectV2ItemFieldReviewerValue()}
     }
     ... on ProjectV2ItemFieldSingleSelectValue {
       ${ProjectV2ItemFieldSingleSelectValue()}
     }
     ... on ProjectV2ItemFieldTextValue {
       ${ProjectV2ItemFieldTextValue()}
     }
     ... on ProjectV2ItemFieldUserValue {
       ${ProjectV2ItemFieldUserValue()}
     }
   }
 }
`;
}

export function projectV2Items (MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM) {
    return `
 edges {
   node {

     ${ProjectV2Item()}

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

     ${projectV2ItemFieldValues(MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM)}

     creator ${projectV2FieldValue_Creator()}

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
`;
}

/* ****************************************************************
 * Project (Classic)
 * **************************************************************** */

export function project () {
    return `id
number
name
body
createdAt
updatedAt
closedAt
url`;
}

export function project_card () {
    return `id
url
note
state`;
}

export function project_column () {
    return `id
name`;
}
