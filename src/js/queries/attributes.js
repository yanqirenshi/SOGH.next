// クエリに埋め込む、項目の部品。
// 「この型からは、この項目を取る」という文字列を返す。
//
// 決まり:
//   1. データモデルになる型は、どこで取るときも、id と updatedAt を取る。
//      (同じ id の node を重ねるかどうかを、updatedAt で決めるため)
//   2. データモデルになる型は、__typename (型の名前) も取る。
//      (型が複数ある関連で、どの型かを見分けるため)
//   3. 項目の多い型は、項目の組を 2 つ持つ。
//        〜Ref … 参照の組。ほかの型の入れ子として取るときに使う。
//        無印  … 全部の組。その型を主に取るときに使う。参照の組を含む。
//      項目の少ない型 (Label・Milestone など) は、組が 1 つ。
//   4. 部品が返すのは、その型の項目だけ。{ } では囲まない。
//      (下のほうの「ProjectV2Item の中身」には、{ } で囲んで返す古い形の部品が残っている)

/* ****************************************************************
 * ページ送り
 * **************************************************************** */

export function page_nation (count=100) {
    return `after: "", first: ${count}`;
}

export function page_info () {
    return `endCursor
hasNextPage
hasPreviousPage
startCursor`;
}

/* ****************************************************************
 * 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount)
 * **************************************************************** */

// User の参照の組。
export function userRef () {
    return `__typename
id
login
name
avatarUrl
url
resourcePath
createdAt
updatedAt`;
}

// User の全部の組。
// email は、User では必ず値が入る型 (String!) で、Organization・Mannequin では null がありうる型 (String)。
// 型の違う email を同じ場所で一緒に取ると、クエリとして正しくなくなる。
// そのため email は、型が User と決まっている場所 (assignees など) で使う、この組にだけ入れる。
export function user () {
    return `${userRef()}
email
company`;
}

export function organizationRef () {
    return `__typename
id
login
name
avatarUrl
url
resourcePath
email
createdAt
updatedAt`;
}

export function botRef () {
    return `__typename
id
login
avatarUrl
url
resourcePath
createdAt
updatedAt`;
}

export function mannequinRef () {
    return `__typename
id
login
avatarUrl
url
resourcePath
email
createdAt
updatedAt`;
}

export function enterpriseUserAccountRef () {
    return `__typename
id
login
name
avatarUrl
url
resourcePath
createdAt
updatedAt`;
}

// 型が Actor の場所で使う。(Issue の author、IssueComment の author と editor、ProjectV2 と ProjectV2Item の creator)
// Actor 自体は id も updatedAt も持たないので、型ごとに取る。
export function actor () {
    return `__typename
login
url
avatarUrl
resourcePath
... on User { ${userRef()} }
... on Organization { ${organizationRef()} }
... on Bot { ${botRef()} }
... on Mannequin { ${mannequinRef()} }
... on EnterpriseUserAccount { ${enterpriseUserAccountRef()} }`;
}

// 型が RepositoryOwner の場所で使う。(Repository の owner)
export function repositoryOwner () {
    return `__typename
id
login
avatarUrl
url
resourcePath
... on User { ${userRef()} }
... on Organization { ${organizationRef()} }`;
}

// repositoryOwner の古い名前。
export function owner () {
    return repositoryOwner();
}

/* ****************************************************************
 * Repository
 * **************************************************************** */

export function repositoryRef () {
    return `__typename
id
name
url
createdAt
updatedAt`;
}

export function repositories () {
    return `${repositoryRef()}
description
descriptionHTML
pushedAt
owner {
  ${repositoryOwner()}
}`;
}

/* ****************************************************************
 * Issue
 * **************************************************************** */

export function issueRef () {
    return `__typename
id
url
number
title
state
createdAt
updatedAt
closedAt`;
}

export function issue () {
    return `${issueRef()}
body
bodyHTML`;
}

export function issue_comment (){
    return `__typename
id
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

// IssueComment と、その関連 (pullRequest・author・editor)。
export function issueCommentNode () {
    return `${issue_comment()}
pullRequest {
  ${pullRequestRef()}
}
author {
  ${actor()}
}
editor {
  ${actor()}
}`;
}

export function milestone () {
    return `__typename
id
url
title
state
number
dueOn
createdAt
updatedAt`;
}

// Label の updatedAt は、null のことがある。
export function label () {
    return `__typename
id
name
url
color
createdAt
updatedAt`;
}

/* ****************************************************************
 * PullRequest
 * **************************************************************** */

export function pullRequestRef () {
    return `__typename
id
number
url
title
state
closed
createdAt
updatedAt
closedAt`;
}

export function pull_request () {
    return `${pullRequestRef()}
body
bodyHTML`;
}

/* ****************************************************************
 * Project V2
 * **************************************************************** */

export function projectV2Ref () {
    return `__typename
id
number
url
title
closed
createdAt
updatedAt`;
}

export function projectv2 () {
    return `${projectV2Ref()}
public
readme
resourcePath
shortDescription
viewerCanUpdate
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

// ProjectV2 の creator。型は Actor。
export function projectv2Creator () {
    return actor();
}

// 型が ProjectV2Owner の場所で使う。(ProjectV2 の owner)
// ProjectV2Owner は、User・Organization のほかに、Issue・PullRequest のこともある。
export function projectv2Owner () {
    return `__typename
id
... on User { ${userRef()} }
... on Organization { ${organizationRef()} }
... on Issue { id number updatedAt }
... on PullRequest { id number updatedAt }`;
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

/* ****************************************************************
 * Project V2 Item
 * **************************************************************** */

export function ProjectV2Item () {
    return `__typename
id
type
isArchived
createdAt
updatedAt`;
}

// ProjectV2Item の project と、その owner。
export function projectV2ItemProject () {
    return `project {
  ${projectV2Ref()}
  owner {
    ${projectv2Owner()}
  }
}`;
}

export function draftIssue () {
    return `__typename
id
title
createdAt
updatedAt`;
}

// Team の参照の組。(ProjectV2Item の reviewers)
// name と avatarUrl は、User と型が違う (null がありうるかどうかが違う) ので、取らない。
export function teamRef () {
    return `__typename
id
slug
createdAt
updatedAt`;
}

/* ****************************************************************
 * ProjectV2Item の中身 (creator・fieldValues・content)
 * ここの部品には、{ } で囲んで返すものがある。
 * **************************************************************** */

// ProjectV2Item と、フィールドの値の creator。型は Actor。
export function projectV2FieldValue_Creator () {
    return `{
${actor()}
}`;
}

const field = `
 {
   ... on ProjectV2Field { id name dataType }
   ... on ProjectV2IterationField { id name dataType }
   ... on ProjectV2SingleSelectField { id name dataType }
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
     ${pullRequestRef()}
   }
 }
`;
}

export function ProjectV2ItemFieldRepositoryValue () {
    return `
 __typename
 field ${field}
 repository {
   ${repositoryRef()}
 }
`;
}

export function ProjectV2ItemFieldReviewerValue () {
    return `
 __typename
 field ${field}
 reviewers(first: 10) {
   nodes {
     ... on User { ${userRef()} }
     ... on Team { ${teamRef()} }
     ... on Mannequin { ${mannequinRef()} }
     ... on Bot { ${botRef()} }
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
    return `
{
  ${draftIssue()}
}`;
}

export function projectV2ItemContentIssue () {
    return `
 {
   ${issueRef()}
   repository {
     ${repositories()}
   }
 }`;
}

export function projectV2ItemContentPullRequest () {
    return `
{
  ${pullRequestRef()}
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

     ${projectV2ItemProject()}

     ${projectV2ItemFieldValues(MAX_FIELD_NUM, MAX_LABEL_NUM, MAX_PR_NUM)}

     creator ${projectV2FieldValue_Creator()}

     content {
       ... on DraftIssue  ${projectV2ItemContentDraftIssue()}
       ... on Issue       ${projectV2ItemContentIssue()}
       ... on PullRequest ${projectV2ItemContentPullRequest()}
     }
   }
 }
`;
}
