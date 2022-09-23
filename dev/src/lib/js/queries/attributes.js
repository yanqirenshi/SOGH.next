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



export const page_nation = `after: "", first: 100`;


export const page_info = `
endCursor
hasNextPage
hasPreviousPage
startCursor
`;
