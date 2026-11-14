// SOGH のデータモデルのクラス (クラス図のデータ)
//
// このファイルは生成したものです。手で書き換えないでください。
// 生成元: SOGH.next リポジトリの src/js (npm の sogh。コミット f6354dc)
// クラスの宣言 (extends)・this.xxx への代入 (属性)・メソッドを、ソースコードから抜き出しています。

export const SOURCE = {
    "path": "src/js",
    "commit": "f6354dc"
};

export const CLASSES = [
    {
        "name": "Loader",
        "extends": null,
        "file": "src/js/Loader.js",
        "fields": [
            {
                "name": "_token",
                "type": "string"
            },
            {
                "name": "_viewer",
                "type": "User"
            },
            {
                "name": "_endpoint",
                "type": "string"
            },
            {
                "name": "_api",
                "type": null
            }
        ],
        "methods": [
            {
                "name": "endpoint",
                "params": [],
                "async": false
            },
            {
                "name": "token",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "viewer",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "isConnected",
                "params": [],
                "async": false
            },
            {
                "name": "makeQuery",
                "params": [
                    "query",
                    "endCursor"
                ],
                "async": false
            },
            {
                "name": "ensureEndCursor",
                "params": [
                    "query",
                    "endCursor"
                ],
                "async": false
            },
            {
                "name": "makeHeader",
                "params": [],
                "async": false
            },
            {
                "name": "postData",
                "params": [
                    "query",
                    "variables"
                ],
                "async": false
            },
            {
                "name": "fetch",
                "params": [
                    "query",
                    "success",
                    "error"
                ],
                "async": false
            },
            {
                "name": "fetchX",
                "params": [
                    "query",
                    "response2data",
                    "success",
                    "error"
                ],
                "async": false
            },
            {
                "name": "makeGraphQLDataItem",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "makeGraphQLData",
                "params": [
                    "data"
                ],
                "async": false
            },
            {
                "name": "text2json",
                "params": [
                    "r"
                ],
                "async": false
            },
            {
                "name": "json2response",
                "params": [
                    "r",
                    "getData"
                ],
                "async": false
            },
            {
                "name": "error2response",
                "params": [
                    "error"
                ],
                "async": false
            }
        ]
    },
    {
        "name": "Pooler",
        "extends": "Loader",
        "file": "src/js/Pooler.js",
        "fields": [
            {
                "name": "matchmaker",
                "type": "Matchmaker"
            },
            {
                "name": "_pools",
                "type": "{ [code]: Pool }"
            }
        ],
        "methods": [
            {
                "name": "pool",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "get",
                "params": [
                    "id"
                ],
                "async": false
            },
            {
                "name": "getPoolAndItemClass",
                "params": [
                    "code"
                ],
                "async": false
            },
            {
                "name": "node2viewer",
                "params": [
                    "d"
                ],
                "async": false
            },
            {
                "name": "node2repository",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "repositories",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "repository",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "node2user",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "user",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "node2projectV2",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "projectsV2",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "projectV2",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "node2projectV2Item",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "projectV2Item",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "node2issue",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "issues",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "issue",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "node2issueComment",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "issueComment",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "node2pullRequest",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "pullRequests",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "pullRequest",
                "params": [
                    "v"
                ],
                "async": false
            }
        ]
    },
    {
        "name": "Sogh",
        "extends": "Pooler",
        "file": "src/js/Sogh.js",
        "fields": [
            {
                "name": "_queries",
                "type": "{ [code]: string }"
            },
            {
                "name": "_routes",
                "type": "{ [code]: string }"
            },
            {
                "name": "_members",
                "type": null
            }
        ],
        "methods": [
            {
                "name": "query",
                "params": [
                    "code"
                ],
                "async": false
            },
            {
                "name": "routes",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "href",
                "params": [
                    "to",
                    "data"
                ],
                "async": false
            },
            {
                "name": "connect",
                "params": [
                    "token",
                    "successed",
                    "failed"
                ],
                "async": false
            },
            {
                "name": "members",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "member",
                "params": [
                    "code"
                ],
                "async": false
            },
            {
                "name": "node2objs",
                "params": [
                    "node_or_nodes",
                    "make"
                ],
                "async": false
            },
            {
                "name": "data2data",
                "params": [
                    "data",
                    "make",
                    "appender"
                ],
                "async": false
            },
            {
                "name": "zzz",
                "params": [
                    "data",
                    "make"
                ],
                "async": false
            },
            {
                "name": "fetchRepositoriesByViewer",
                "params": [
                    "success",
                    "fail"
                ],
                "async": false
            },
            {
                "name": "fetchUserByID",
                "params": [
                    "id",
                    "success",
                    "fail"
                ],
                "async": false
            },
            {
                "name": "fetchProjectsV2ByUser",
                "params": [
                    "user",
                    "success",
                    "fail"
                ],
                "async": false
            },
            {
                "name": "fetchProjectsV2ByID",
                "params": [
                    "id",
                    "success",
                    "fail"
                ],
                "async": false
            },
            {
                "name": "fetchProjectV2ItemsByProjectNext",
                "params": [
                    "project_next",
                    "success",
                    "fail"
                ],
                "async": false
            },
            {
                "name": "fetchProjectNextItemByID",
                "params": [
                    "id"
                ],
                "async": false
            },
            {
                "name": "fetchIssueByID",
                "params": [
                    "id"
                ],
                "async": false
            },
            {
                "name": "fetchIssueCommentsByIssueID",
                "params": [
                    "id"
                ],
                "async": false
            },
            {
                "name": "updateIssueComment",
                "params": [
                    "id",
                    "body",
                    "callbacks={}"
                ],
                "async": false
            },
            {
                "name": "createIssueComment",
                "params": [
                    "id",
                    "body",
                    "callbacks={}"
                ],
                "async": false
            },
            {
                "name": "deleteIssueComment",
                "params": [
                    "id",
                    "callbacks={}"
                ],
                "async": false
            },
            {
                "name": "asyncFetchViewer",
                "params": [],
                "async": true
            },
            {
                "name": "asyncFetchRepositoriesByViewer",
                "params": [],
                "async": true
            },
            {
                "name": "asyncFetchIssueByID",
                "params": [
                    "id"
                ],
                "async": true
            },
            {
                "name": "asyncFetchIssueByViewer",
                "params": [],
                "async": true
            },
            {
                "name": "asyncFetchIssueByOrgRepoIssueNumber",
                "params": [
                    "org_login",
                    "repo_name",
                    "issue_number"
                ],
                "async": true
            },
            {
                "name": "asyncFetchIssueCommentsByID",
                "params": [
                    "id"
                ],
                "async": true
            },
            {
                "name": "asyncFetchIssueCommentsByOrgRepoIssueNumber",
                "params": [
                    "org_login",
                    "repo_name",
                    "issue_number"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectsV2ByViewer",
                "params": [],
                "async": true
            },
            {
                "name": "asyncFetchProjectsV2ByTeam",
                "params": [
                    "team_id",
                    "callbacks={}"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectsV2WithItemsByTeam",
                "params": [
                    "team_id",
                    "callbacks={}"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectV2ByUserLoginProjectV2Number",
                "params": [
                    "login",
                    "number",
                    "callbacks={}"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectV2ByOrgLoginProjectV2Number",
                "params": [
                    "login",
                    "number",
                    "callbacks={}"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectV2ItemsByUserLoginProjectV2Number",
                "params": [
                    "login",
                    "number"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectV2ItemsByOrgLoginProjectV2Number",
                "params": [
                    "login",
                    "number"
                ],
                "async": true
            },
            {
                "name": "asyncFetchProjectV2ItemByID",
                "params": [
                    "id"
                ],
                "async": true
            },
            {
                "name": "asyncFetchItemByID",
                "params": [
                    "id"
                ],
                "async": true
            }
        ]
    },
    {
        "name": "Pool",
        "extends": null,
        "file": "src/js/Pool.js",
        "fields": [
            {
                "name": "_sogh",
                "type": "Sogh"
            },
            {
                "name": "_item_class",
                "type": "class"
            },
            {
                "name": "_ht",
                "type": "{ [id]: GraphQLNode }"
            },
            {
                "name": "_list",
                "type": "GraphQLNode[]"
            }
        ],
        "methods": [
            {
                "name": "itemClass",
                "params": [],
                "async": false
            },
            {
                "name": "ht",
                "params": [],
                "async": false
            },
            {
                "name": "list",
                "params": [],
                "async": false
            },
            {
                "name": "add",
                "params": [
                    "data"
                ],
                "async": false
            },
            {
                "name": "get",
                "params": [
                    "id"
                ],
                "async": false
            },
            {
                "name": "ensure",
                "params": [
                    "node",
                    "makeInstance",
                    "updater"
                ],
                "async": false
            }
        ]
    },
    {
        "name": "Matchmaker",
        "extends": null,
        "file": "src/js/Matchmaker.js",
        "fields": [
            {
                "name": "sogh",
                "type": "Sogh"
            }
        ],
        "methods": [
            {
                "name": "repository",
                "params": [
                    "node"
                ],
                "async": false
            },
            {
                "name": "user",
                "params": [
                    "node"
                ],
                "async": false
            }
        ]
    },
    {
        "name": "Assignee",
        "extends": "GraphQLNode",
        "file": "src/js/models/Assignee.js",
        "fields": [],
        "methods": [
            {
                "name": "login",
                "params": [],
                "async": false
            },
            {
                "name": "name",
                "params": [],
                "async": false
            },
            {
                "name": "email",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "company",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Card",
        "extends": null,
        "file": "src/js/models/Card.js",
        "fields": [],
        "methods": []
    },
    {
        "name": "Column",
        "extends": null,
        "file": "src/js/models/Column.js",
        "fields": [],
        "methods": []
    },
    {
        "name": "GraphQLNode",
        "extends": null,
        "file": "src/js/models/GraphQLNode.js",
        "fields": [
            {
                "name": "_core",
                "type": "object"
            },
            {
                "name": "_sogh",
                "type": "Sogh"
            }
        ],
        "methods": [
            {
                "name": "sogh",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "core",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "id",
                "params": [],
                "async": false
            },
            {
                "name": "createdAt",
                "params": [],
                "async": false
            },
            {
                "name": "updatedAt",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Issue",
        "extends": "GraphQLNode",
        "file": "src/js/models/Issue.js",
        "fields": [
            {
                "name": "_owner",
                "type": null
            },
            {
                "name": "_date_next_action",
                "type": null
            },
            {
                "name": "_due_date",
                "type": null
            },
            {
                "name": "_points",
                "type": null
            },
            {
                "name": "regex",
                "type": null
            }
        ],
        "methods": [
            {
                "name": "core",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "number",
                "params": [],
                "async": false
            },
            {
                "name": "title",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "milestone",
                "params": [],
                "async": false
            },
            {
                "name": "assignees",
                "params": [],
                "async": false
            },
            {
                "name": "labels",
                "params": [],
                "async": false
            },
            {
                "name": "owner",
                "params": [],
                "async": false
            },
            {
                "name": "getOwnerFromBody",
                "params": [
                    "body"
                ],
                "async": false
            },
            {
                "name": "author",
                "params": [],
                "async": false
            },
            {
                "name": "closedAt",
                "params": [],
                "async": false
            },
            {
                "name": "project",
                "params": [],
                "async": false
            },
            {
                "name": "repository",
                "params": [],
                "async": false
            },
            {
                "name": "points",
                "params": [],
                "async": false
            },
            {
                "name": "pointPlansTotal",
                "params": [],
                "async": false
            },
            {
                "name": "pointResultTotal",
                "params": [],
                "async": false
            },
            {
                "name": "getPointResultsFromBody",
                "params": [
                    "body"
                ],
                "async": false
            },
            {
                "name": "getPointPlansFromBody",
                "params": [
                    "body"
                ],
                "async": false
            },
            {
                "name": "getPointFromBody",
                "params": [
                    "body"
                ],
                "async": false
            },
            {
                "name": "body",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "bodyHTML",
                "params": [],
                "async": false
            },
            {
                "name": "fieldItem",
                "params": [],
                "async": false
            },
            {
                "name": "fieldValueContents",
                "params": [
                    "name"
                ],
                "async": false
            },
            {
                "name": "fieldValues",
                "params": [],
                "async": false
            },
            {
                "name": "getFieldValueByName",
                "params": [
                    "name"
                ],
                "async": false
            },
            {
                "name": "dueDate",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "nextActionDate",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "getDueDateFromBody",
                "params": [
                    "body"
                ],
                "async": false
            },
            {
                "name": "getNextActionFromBody",
                "params": [
                    "body"
                ],
                "async": false
            },
            {
                "name": "addAnotetionValue",
                "params": [
                    "issue"
                ],
                "async": false
            },
            {
                "name": "addAnotetionValueNew",
                "params": [
                    "issue"
                ],
                "async": false
            },
            {
                "name": "makeIssueData",
                "params": [],
                "async": false
            },
            {
                "name": "issueData2requestDataDescription",
                "params": [
                    "data"
                ],
                "async": false
            },
            {
                "name": "issueData2requestData",
                "params": [
                    "data"
                ],
                "async": false
            },
            {
                "name": "projectV2Items",
                "params": [],
                "async": false
            },
            {
                "name": "projectV2Item",
                "params": [],
                "async": false
            },
            {
                "name": "projectsV2",
                "params": [],
                "async": false
            },
            {
                "name": "projectV2",
                "params": [],
                "async": false
            },
            {
                "name": "projectCards",
                "params": [],
                "async": false
            },
            {
                "name": "getColumnFirst",
                "params": [],
                "async": false
            },
            {
                "name": "getFirstColumnProject",
                "params": [],
                "async": false
            },
            {
                "name": "getFirstColumnProjectID",
                "params": [],
                "async": false
            },
            {
                "name": "milestoneId",
                "params": [],
                "async": false
            },
            {
                "name": "projects",
                "params": [],
                "async": false
            },
            {
                "name": "projectIds",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "IssueComment",
        "extends": "GraphQLNode",
        "file": "src/js/models/IssueComment.js",
        "fields": [],
        "methods": [
            {
                "name": "body",
                "params": [],
                "async": false
            },
            {
                "name": "bodyHTML",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "publishedAt",
                "params": [],
                "async": false
            },
            {
                "name": "author",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Label",
        "extends": "GraphQLNode",
        "file": "src/js/models/Label.js",
        "fields": [],
        "methods": [
            {
                "name": "color",
                "params": [],
                "async": false
            },
            {
                "name": "name",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "description",
                "params": [],
                "async": false
            },
            {
                "name": "fontColor",
                "params": [
                    "hexcolor"
                ],
                "async": false
            }
        ]
    },
    {
        "name": "Milestone",
        "extends": "GraphQLNode",
        "file": "src/js/models/Milestone.js",
        "fields": [],
        "methods": [
            {
                "name": "title",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "number",
                "params": [],
                "async": false
            },
            {
                "name": "state",
                "params": [],
                "async": false
            },
            {
                "name": "description",
                "params": [],
                "async": false
            },
            {
                "name": "closedAt",
                "params": [],
                "async": false
            },
            {
                "name": "dueOn",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Project",
        "extends": "GraphQLNode",
        "file": "src/js/models/Project.js",
        "fields": [
            {
                "name": "_type",
                "type": null
            },
            {
                "name": "_priority",
                "type": null
            },
            {
                "name": "_assignee",
                "type": null
            },
            {
                "name": "_plan",
                "type": null
            },
            {
                "name": "_result",
                "type": null
            },
            {
                "name": "_issues",
                "type": null
            }
        ],
        "methods": [
            {
                "name": "number",
                "params": [],
                "async": false
            },
            {
                "name": "name",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "state",
                "params": [],
                "async": false
            },
            {
                "name": "closedAt",
                "params": [],
                "async": false
            },
            {
                "name": "closed",
                "params": [],
                "async": false
            },
            {
                "name": "body",
                "params": [],
                "async": false
            },
            {
                "name": "progress",
                "params": [],
                "async": false
            },
            {
                "name": "type",
                "params": [],
                "async": false
            },
            {
                "name": "priority",
                "params": [],
                "async": false
            },
            {
                "name": "assignee",
                "params": [],
                "async": false
            },
            {
                "name": "plan",
                "params": [],
                "async": false
            },
            {
                "name": "result",
                "params": [],
                "async": false
            },
            {
                "name": "issues",
                "params": [],
                "async": false
            },
            {
                "name": "columns",
                "params": [],
                "async": false
            },
            {
                "name": "addAnotetionValue",
                "params": [
                    "project"
                ],
                "async": false
            },
            {
                "name": "colorByPriority",
                "params": [],
                "async": false
            },
            {
                "name": "priorityLabel",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "ProjectV2",
        "extends": "GraphQLNode",
        "file": "src/js/models/ProjectV2.js",
        "fields": [
            {
                "name": "_priorities",
                "type": null
            },
            {
                "name": "_priority",
                "type": null
            },
            {
                "name": "_owner",
                "type": null
            },
            {
                "name": "_type",
                "type": null
            },
            {
                "name": "_release",
                "type": null
            },
            {
                "name": "_plan",
                "type": "Term"
            },
            {
                "name": "_result",
                "type": "Term"
            },
            {
                "name": "_action",
                "type": null
            },
            {
                "name": "_backlog",
                "type": null
            },
            {
                "name": "_systems",
                "type": null
            },
            {
                "name": "_customer",
                "type": null
            },
            {
                "name": "_agency",
                "type": null
            },
            {
                "name": "_scenario",
                "type": null
            },
            {
                "name": "_progress",
                "type": null
            },
            {
                "name": "_regexs",
                "type": null
            }
        ],
        "methods": [
            {
                "name": "core",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "initReadmeAttributes",
                "params": [],
                "async": false
            },
            {
                "name": "initRegexs",
                "params": [],
                "async": false
            },
            {
                "name": "parseReadmeItem",
                "params": [
                    "readme",
                    "regex"
                ],
                "async": false
            },
            {
                "name": "parseReadmeItemPlan",
                "params": [
                    "readme",
                    "regex"
                ],
                "async": false
            },
            {
                "name": "parseReadmeItemResult",
                "params": [
                    "readme",
                    "regexs"
                ],
                "async": false
            },
            {
                "name": "parseReadme",
                "params": [],
                "async": false
            },
            {
                "name": "number",
                "params": [],
                "async": false
            },
            {
                "name": "title",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "fields",
                "params": [],
                "async": false
            },
            {
                "name": "shortDescription",
                "params": [],
                "async": false
            },
            {
                "name": "readme",
                "params": [],
                "async": false
            },
            {
                "name": "public",
                "params": [],
                "async": false
            },
            {
                "name": "owner",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "creator",
                "params": [],
                "async": false
            },
            {
                "name": "items",
                "params": [],
                "async": false
            },
            {
                "name": "itemsWith2ProjectV2Item",
                "params": [],
                "async": false
            },
            {
                "name": "priority",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "priorityData",
                "params": [],
                "async": false
            },
            {
                "name": "maneger",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "type",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "release",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "plan",
                "params": [
                    "start",
                    "end"
                ],
                "async": false
            },
            {
                "name": "result",
                "params": [
                    "start",
                    "end"
                ],
                "async": false
            },
            {
                "name": "action",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "backlog",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "systems",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "agency",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "customer",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "scenario",
                "params": [
                    "v"
                ],
                "async": false
            },
            {
                "name": "progress",
                "params": [
                    "v"
                ],
                "async": false
            }
        ]
    },
    {
        "name": "ProjectV2Item",
        "extends": "GraphQLNode",
        "file": "src/js/models/ProjectV2Item.js",
        "fields": [],
        "methods": [
            {
                "name": "creator",
                "params": [],
                "async": false
            },
            {
                "name": "path",
                "params": [],
                "async": false
            },
            {
                "name": "fieldValues",
                "params": [],
                "async": false
            },
            {
                "name": "getFieldValueByName",
                "params": [
                    "name"
                ],
                "async": false
            },
            {
                "name": "project",
                "params": [],
                "async": false
            },
            {
                "name": "projectNumber",
                "params": [],
                "async": false
            },
            {
                "name": "projectOwnerLogin",
                "params": [],
                "async": false
            },
            {
                "name": "projectPath",
                "params": [],
                "async": false
            },
            {
                "name": "type",
                "params": [],
                "async": false
            },
            {
                "name": "isArchived",
                "params": [],
                "async": false
            },
            {
                "name": "archived",
                "params": [],
                "async": false
            },
            {
                "name": "title",
                "params": [],
                "async": false
            },
            {
                "name": "status",
                "params": [],
                "async": false
            },
            {
                "name": "assignees",
                "params": [],
                "async": false
            },
            {
                "name": "labels",
                "params": [],
                "async": false
            },
            {
                "name": "linkedPullRequests",
                "params": [],
                "async": false
            },
            {
                "name": "reviewers",
                "params": [],
                "async": false
            },
            {
                "name": "repository",
                "params": [],
                "async": false
            },
            {
                "name": "milestone",
                "params": [],
                "async": false
            },
            {
                "name": "content",
                "params": [],
                "async": false
            },
            {
                "name": "contentTypename",
                "params": [],
                "async": false
            },
            {
                "name": "planStart",
                "params": [],
                "async": false
            },
            {
                "name": "planEnd",
                "params": [],
                "async": false
            },
            {
                "name": "planTerm",
                "params": [],
                "async": false
            },
            {
                "name": "planPoints",
                "params": [],
                "async": false
            },
            {
                "name": "planPointsSummary",
                "params": [],
                "async": false
            },
            {
                "name": "resultPoints",
                "params": [],
                "async": false
            },
            {
                "name": "resultPointsSummary",
                "params": [],
                "async": false
            },
            {
                "name": "nextActionDate",
                "params": [],
                "async": false
            },
            {
                "name": "dueDate",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "PullRequest",
        "extends": "GraphQLNode",
        "file": "src/js/models/PullRequest.js",
        "fields": [],
        "methods": [
            {
                "name": "title",
                "params": [],
                "async": false
            },
            {
                "name": "number",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "body",
                "params": [],
                "async": false
            },
            {
                "name": "bodyHTML",
                "params": [],
                "async": false
            },
            {
                "name": "repository",
                "params": [],
                "async": false
            },
            {
                "name": "author",
                "params": [],
                "async": false
            },
            {
                "name": "assignees",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Relationship",
        "extends": "GraphQLNode",
        "file": "src/js/models/Relationship.js",
        "fields": [],
        "methods": [
            {
                "name": "a",
                "params": [],
                "async": false
            },
            {
                "name": "b",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Repository",
        "extends": "GraphQLNode",
        "file": "src/js/models/Repository.js",
        "fields": [],
        "methods": [
            {
                "name": "name",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "description",
                "params": [],
                "async": false
            },
            {
                "name": "descriptionHTML",
                "params": [],
                "async": false
            },
            {
                "name": "owner",
                "params": [],
                "async": false
            },
            {
                "name": "pushedAt",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Term",
        "extends": null,
        "file": "src/js/models/Term.js",
        "fields": [
            {
                "name": "start",
                "type": null
            },
            {
                "name": "end",
                "type": null
            }
        ],
        "methods": []
    },
    {
        "name": "User",
        "extends": "GraphQLNode",
        "file": "src/js/models/User.js",
        "fields": [],
        "methods": [
            {
                "name": "login",
                "params": [],
                "async": false
            },
            {
                "name": "name",
                "params": [],
                "async": false
            },
            {
                "name": "email",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            },
            {
                "name": "company",
                "params": [],
                "async": false
            },
            {
                "name": "avatarUrl",
                "params": [],
                "async": false
            }
        ]
    },
    {
        "name": "Viewer",
        "extends": "GraphQLNode",
        "file": "src/js/models/Viewer.js",
        "fields": [],
        "methods": [
            {
                "name": "login",
                "params": [],
                "async": false
            },
            {
                "name": "name",
                "params": [],
                "async": false
            },
            {
                "name": "url",
                "params": [],
                "async": false
            }
        ]
    }
];
