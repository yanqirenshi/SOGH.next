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
//   4. 部品が返すのは、その型の項目だけ。{ } では囲まない。(囲むのは、呼ぶ側) (yanqirenshi/SOGH.next#74)
//   5. 部品の名前は、小文字で始まり、途中が大文字。(例: projectV2ItemFieldValues) (yanqirenshi/SOGH.next#74)
//   6. 入れ子の件数の上限 (fieldValues・その中の labels と pullRequests) は、NESTED_LIMIT の 1 か所で決める。(yanqirenshi/SOGH.next#75)

/* ****************************************************************
 * 件数
 * **************************************************************** */

// 入れ子の件数の上限。(ProjectV2Item の fieldValues と、その中の labels・pullRequests)
// どのクエリも、この値を使う。上限を超えた分は、取れない。(取れた分だけをモデルにする。yanqirenshi/SOGH.next#30)
export const NESTED_LIMIT = 30;

/* ****************************************************************
 * ページ送り
 * **************************************************************** */

// ページ送りする一覧の引数。
// クエリは、変数 $after: String を宣言する。(1 ページめは null。2 ページめからは、前のページの endCursor)
export function pagination (count=100) {
    return `after: $after, first: ${count}`;
}

export function pageInfo () {
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

export function issueComment () {
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
    return `${issueComment()}
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

// state には、別名を付けられる。(state_field に 'pullRequestState: state' のように渡す)
// ProjectV2Item の content では、Issue の state (IssueState!) と PullRequest の state (PullRequestState!) が
// 同じ場所に来て、GraphQL の決まりに合わないので、PullRequest のほうを別名で取る。(yanqirenshi/SOGH.next#68)
// 別名で取った値は、Pooler の node2projectV2Item(node) と node2pullRequest(node) が、Pool に入れる前に state に戻す。
export function pullRequestRef (state_field='state') {
    return `__typename
id
number
url
title
${state_field}
closed
createdAt
updatedAt
closedAt`;
}

export function pullRequest () {
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

export function projectV2 () {
    return `${projectV2Ref()}
public
readme
resourcePath
shortDescription
viewerCanUpdate
closedAt`;
}

export function projectV2Fields () {
    return `... on ProjectV2Field {
  ${projectV2Field()}
}
... on ProjectV2SingleSelectField {
  ${projectV2FieldSelect()}
  options {
    id
    name
    nameHTML
  }
}
... on ProjectV2IterationField {
  ${projectV2FieldIteration()}
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
}`;
}

// ProjectV2 の creator。型は Actor。
export function projectV2Creator () {
    return actor();
}

// 型が ProjectV2Owner の場所で使う。(ProjectV2 の owner)
// ProjectV2Owner は、User・Organization のほかに、Issue・PullRequest のこともある。
export function projectV2Owner () {
    return `__typename
id
... on User { ${userRef()} }
... on Organization { ${organizationRef()} }
... on Issue { id number updatedAt }
... on PullRequest { id number updatedAt }`;
}

export function projectV2FieldIteration () {
    return `id
name
dataType
createdAt
updatedAt`;
}

export function projectV2FieldSelect () {
    return `id
name
dataType
createdAt
updatedAt`;
}

export function projectV2Field () {
    return `id
name
dataType
createdAt
updatedAt`;
}

/* ****************************************************************
 * Project V2 Item
 * **************************************************************** */

export function projectV2Item () {
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
    ${projectV2Owner()}
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

// Team の参照の組。(チームの ProjectV2 を取るクエリの、根の Team)
// name と avatarUrl は、含めない。(reviewers の Team は、teamReviewerRef を使う)
export function teamRef () {
    return `__typename
id
slug
createdAt
updatedAt`;
}

// ProjectV2Item の reviewers に入る Team の組。
// reviewers には、User・Team・Mannequin・Bot が、同じ場所に来る。
// Team の name (String!) と avatarUrl (URI) は、User などの name (String)・avatarUrl (URI!) と、
// null がありうるかどうかが違い、同じ名前では、一緒に取れない。(GraphQL の決まりに合わない)
// そのため、別名 teamName・teamAvatarUrl で取る。
// url は、どの型も URI! で同じなので、別名は要らない。
// 別名で取った値は、Pooler の node2team(node) と node2projectV2Item(node) が、Pool に入れる前に name・avatarUrl に戻す。
// (PullRequest の state と同じやり方。pullRequestRef を見る。yanqirenshi/SOGH.next#39)
export function teamReviewerRef () {
    return `${teamRef()}
teamName: name
teamAvatarUrl: avatarUrl
url`;
}

/* ****************************************************************
 * ProjectV2Item の中身 (creator・fieldValues・content)
 * **************************************************************** */

// ProjectV2Item と、フィールドの値の creator。型は Actor。
export function projectV2FieldValueCreator () {
    return actor();
}

// フィールドの値の field。(どのフィールドの値か)
export function projectV2FieldValueField () {
    return `... on ProjectV2Field { id name dataType }
... on ProjectV2IterationField { id name dataType }
... on ProjectV2SingleSelectField { id name dataType }`;
}

export function projectV2ItemFieldDateValue () {
    return `__typename
id
date
field { ${projectV2FieldValueField()} }
creator { ${projectV2FieldValueCreator()} }`;
}

export function projectV2ItemFieldIterationValue () {
    return `__typename
id
title
titleHTML
duration
iterationId
startDate
createdAt
updatedAt
field { ${projectV2FieldValueField()} }
creator { ${projectV2FieldValueCreator()} }`;
}

export function projectV2ItemFieldLabelValue () {
    return `__typename
field { ${projectV2FieldValueField()} }
labels(first: ${NESTED_LIMIT}) {
  nodes {
    ${label()}
  }
}`;
}

export function projectV2ItemFieldMilestoneValue () {
    return `__typename
field { ${projectV2FieldValueField()} }
milestone {
  ${milestone()}
}`;
}

export function projectV2ItemFieldNumberValue () {
    return `__typename
id
number
createdAt
updatedAt
field { ${projectV2FieldValueField()} }
creator { ${projectV2FieldValueCreator()} }`;
}

export function projectV2ItemFieldPullRequestValue () {
    return `__typename
field { ${projectV2FieldValueField()} }
pullRequests(first: ${NESTED_LIMIT}) {
  nodes {
    ${pullRequestRef()}
  }
}`;
}

export function projectV2ItemFieldRepositoryValue () {
    return `__typename
field { ${projectV2FieldValueField()} }
repository {
  ${repositoryRef()}
}`;
}

export function projectV2ItemFieldReviewerValue () {
    return `__typename
field { ${projectV2FieldValueField()} }
reviewers(first: 10) {
  nodes {
    ... on User { ${userRef()} }
    ... on Team { ${teamReviewerRef()} }
    ... on Mannequin { ${mannequinRef()} }
    ... on Bot { ${botRef()} }
  }
}`;
}

export function projectV2ItemFieldSingleSelectValue () {
    return `__typename
id
name
nameHTML
optionId
createdAt
updatedAt
field { ${projectV2FieldValueField()} }
creator { ${projectV2FieldValueCreator()} }`;
}

export function projectV2ItemFieldTextValue () {
    return `__typename
id
text
createdAt
updatedAt
field { ${projectV2FieldValueField()} }
creator { ${projectV2FieldValueCreator()} }`;
}

export function projectV2ItemFieldUserValue () {
    return `__typename
field { ${projectV2FieldValueField()} }
users(first: 10) {
  nodes {
    ${user()}
  }
}`;
}

export function projectV2ItemContentDraftIssue () {
    return draftIssue();
}

export function projectV2ItemContentIssue () {
    return `${issueRef()}
repository {
  ${repositories()}
}`;
}

// PullRequest の state は、別名 pullRequestState で取る。(pullRequestRef を見る)
export function projectV2ItemContentPullRequest () {
    return pullRequestRef('pullRequestState: state');
}

// ProjectV2Item の content。(Issue・PullRequest・DraftIssue のどれか)
export function projectV2ItemContent () {
    return `content {
  ... on DraftIssue { ${projectV2ItemContentDraftIssue()} }
  ... on Issue { ${projectV2ItemContentIssue()} }
  ... on PullRequest { ${projectV2ItemContentPullRequest()} }
}`;
}

export function projectV2ItemFieldValues () {
    return `fieldValues(first: ${NESTED_LIMIT}) {
  nodes {
    ... on ProjectV2ItemFieldDateValue { ${projectV2ItemFieldDateValue()} }
    ... on ProjectV2ItemFieldIterationValue { ${projectV2ItemFieldIterationValue()} }
    ... on ProjectV2ItemFieldLabelValue { ${projectV2ItemFieldLabelValue()} }
    ... on ProjectV2ItemFieldMilestoneValue { ${projectV2ItemFieldMilestoneValue()} }
    ... on ProjectV2ItemFieldNumberValue { ${projectV2ItemFieldNumberValue()} }
    ... on ProjectV2ItemFieldPullRequestValue { ${projectV2ItemFieldPullRequestValue()} }
    ... on ProjectV2ItemFieldRepositoryValue { ${projectV2ItemFieldRepositoryValue()} }
    ... on ProjectV2ItemFieldReviewerValue { ${projectV2ItemFieldReviewerValue()} }
    ... on ProjectV2ItemFieldSingleSelectValue { ${projectV2ItemFieldSingleSelectValue()} }
    ... on ProjectV2ItemFieldTextValue { ${projectV2ItemFieldTextValue()} }
    ... on ProjectV2ItemFieldUserValue { ${projectV2ItemFieldUserValue()} }
  }
}`;
}

// ProjectV2Item の全部の組。(項目と、project・fieldValues・creator・content)
export function projectV2ItemNode () {
    return `${projectV2Item()}
${projectV2ItemProject()}
${projectV2ItemFieldValues()}
creator { ${projectV2FieldValueCreator()} }
${projectV2ItemContent()}`;
}

// ProjectV2 の items の中身。(edges の形)
export function projectV2Items () {
    return `edges {
  node {
    ${projectV2ItemNode()}
  }
}`;
}
