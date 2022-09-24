export const page_nation = `after: "", first: 100`;

export const page_info = `
endCursor
hasNextPage
hasPreviousPage
startCursor
`;

export const user = `
id
login
name
avatarUrl
url
email
company
createdAt
updatedAt
`;

export const repositories = `
id
name
url
description
descriptionHTML
createdAt
updatedAt
pushedAt
`;

export const issue = `
id
url
title
createdAt
closedAt
updatedAt
number
body
bodyHTML
`;

export const issue_comment = `
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
updatedAt
`;

export const milestone = `
id
url
title
state
number
dueOn
`;

export const label = `
id
name
url
color
`;

export const project = `
id
number
name
body
createdAt
updatedAt
closedAt
url
`;

export const project_card = `
id
url
note
state
`;

export const project_column = `
id
name
`;

export const owner = `
id
login
avatarUrl
url
`;

export const project_next = `
id
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
closed
`;

export const project_next_fields = `
id
name
dataType
settings
createdAt
updatedAt
`;

export const project_next_item = `
id
title
createdAt
updatedAt
isArchived
type
`;

export const project_next_item_field_value = `
id
createdAt
updatedAt
value
`;

export const actor = `
login
url
avatarUrl
resourcePath
`;
