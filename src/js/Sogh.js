import Pooler from './Pooler.js';

import * as QUERIES from './queries/index.js';

export default class Sogh extends Pooler {
    constructor () {
        super();

        this._queries = QUERIES;

        this._routes = {
            'issue':            '/scrum/users/:login/repositories/:repository/issues/:number',
            'project-v2':       '/scrum/users/:login/projects/:number',
            'project-v2-data':  '/scrum/users/:login/projects/:number',
            'project-v2-items': '/scrum/users/:login/projects/:project-number/items/:id',
        };

        this._members = [];
    }
    query (code) {
        return this._queries[code];
    }
    /** **************************************************************** *
     * routes
     * **************************************************************** */
    routes (v) {
        if (arguments.length>0)
            this._routes = v;

        return this._routes;
    }
    href (to, data) {
        const routes = this.routes();
        const base = routes[to];

        if ('project-v2'===to)
            return base
            .replace(':login',  data.creator().login())
            .replace(':number', data.number());

        if ('project-v2-data'===to) {
            return base
            .replace(':login',  data.owner.login)
            .replace(':number', data.number);
        }

        if ('project-v2-items'===to)
            return base
            .replace(':login',  data.projectOwnerLogin())
            .replace(':project-number', data.projectNumber())
            .replace(':id', data.id());

        const keys = Object.keys(data);

        return keys.reduce((str, key)=> {
            let out = str;

            if (key==='id') out = str.replaceAll(':id', data[key]);

            return out;
        }, base);
    }
    /** **************************************************************** *
     * Auth
     * **************************************************************** */
    connect (token, successed, failed) {
        this.token(token);

        return this.fetchX(
            this.query('viwer'),
            (node) => {
                return this.node2user(node.data.viewer);
            },
            (results) => {
                const viewer = results.data;

                this.viewer(viewer);

                if (successed) successed(viewer);
            },
            (error) => {
                this.viewer(null);

                if (failed) failed(error);
            });
    }
    /** **************************************************************** *
     * Member
     * **************************************************************** */
    members (v) {
        if (arguments.length>0)
            this._members = v;

        return this._members;
    }
    member (code) {
        return this._members.find(m=> m.code===code) || null;
    }
    /** **************************************************************** *
     * fetch util
     * **************************************************************** */
    node2objs (node_or_nodes, make) {
        // case of nodes
        if (Array.isArray(node_or_nodes)) {
            const nodes = node_or_nodes;

            return nodes.map(node=> {
                return make(node).id();
            });
        }

        // case of node
        const node = make(node_or_nodes);

        return node.id();
    }
    /** **************************************************************** *
     * コメントの追加・更新・削除
     * **************************************************************** */
    updateIssueComment (id, body, callbacks={}) {
        callback('start', callbacks, [id, body]);

        let out = [];

        const query = this.query('update_issue_comment');

        const post_data = this.postData(query, { id: id, body: body });

        fetch(this.endpoint(), post_data)
            .then(response  => this.text2json(response))
            .then(response  => {
                // GraphQL のエラーは json2response が throw して catch に回る。
                const r = this.json2response(response, d=> {
                    const issue_comment_node = d.data.updateIssueComment.issueComment;
                    return this.node2issueComment(issue_comment_node);
                });

                callback('successed', callbacks, [r.data.id(), id, body]);
            })
            .catch(err => {
                callback('failed', callbacks, [this.error2response(err), id, body]);
            });

        return out;
    }
    createIssueComment (id, body, callbacks={}) {
        callback('start', callbacks, [id, body]);

        let out = [];

        const query = this.query('create_issue_comment');

        const post_data = this.postData(query, { id: id, body: body });

        fetch(this.endpoint(), post_data)
            .then(response  => this.text2json(response))
            .then(response  => {
                // GraphQL のエラーは json2response が throw して catch に回る。
                const r = this.json2response(response, d=> {
                    const issue_comment_node = d.data.addComment.commentEdge.node;
                    return this.node2issueComment(issue_comment_node);
                });

                callback('successed', callbacks, [r.data.id(), id, body]);
            })
            .catch(err => {
                callback('failed', callbacks, [this.error2response(err), id, body]);
            });

        return out;
    }
    deleteIssueComment (id, callbacks={}) {
        callback('start', callbacks, [id]);

        let out = [];

        const query = this.query('delete_issue_comment');

        const post_data = this.postData(query, { id: id });

        fetch(this.endpoint(), post_data)
            .then(response  => this.text2json(response))
            .then(response  => {
                // HTTP 200 でも GraphQL の errors が返ることがある。
                // json2response が throw して catch (failed) に回る。
                this.json2response(response, d=> d.data.deleteIssueComment);

                callback('successed', callbacks, [id]);
            })
            .catch(err => {
                callback('failed', callbacks, [this.error2response(err), id]);
            });

        return out;
    }
    async asyncFetchViewer () {
        const query = this.query('viwer');

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.viewer;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type)
            return response.data;

        // nodes 2 objs and pooling
        return this.node2viewer(response.data);
    }
    /////
    ///// Repository
    /////
    async asyncFetchRepositoriesByViewer () {
        const query = this.query('repositories_by_viewer');

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> d.data.viewer.repositories))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return out;

            // nodes 2 objs and pooling
            const repositories
                  = this.node2objs(
                      response.data.nodes,
                      node=> this.node2repository(node));

            // concat out
            out = out.concat(repositories);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    /////
    ///// Issue
    /////
    async asyncFetchIssueByID (id) {
        const query = this.query('issue_by_id')
              .replace('@id', id);

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.node;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type)
            return response.data;

        // create object
        const obj = this.node2issue(response.data);

        // nodes 2 objs and pooling
        return obj.id();
    }
    async asyncFetchIssueByViewer () {
        const query = this.query('issues_by_viwer');

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> d.data.viewer.issues))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return out;

            // nodes 2 objs and pooling
            const projects
                  = this.node2objs(
                      response.data.nodes,
                      node=> this.node2issue(node));

            // concat out
            out = out.concat(projects);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    async asyncFetchIssueByOrgRepoIssueNumber (org_login, repo_name, issue_number) {
        const query = this.query('issue_by_org_repo_issue_number')
              .replace('@login',  org_login)
              .replace('@name',   repo_name)
              .replace('@number', issue_number);

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.organization.repository.issue;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type)
            return response.data;

        // create object
        const obj = this.node2issue(response.data);

        // nodes 2 objs and pooling
        return obj.id();
    }
    /////
    ///// Issue Comments
    /////
    async asyncFetchIssueCommentsByID (id) {
        // issue_by_org_repo_issue_number.js
        const query = this.query('issue_comments_by_issue_id')
              .replace('@id', id);

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> {
                      return d.data.node.comments;
                  }))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return response.data;

            // nodes 2 objs and pooling
            const projects
                  = this.node2objs(
                      response.data.nodes,
                      node=> this.node2issueComment(node));

            // concat out
            out = out.concat(projects);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    async asyncFetchIssueCommentsByOrgRepoIssueNumber (org_login, repo_name, issue_number) {
        const query = this.query('issue_comments_by_org_repo_issue_number')
              .replace('@login',  org_login)
              .replace('@name',   repo_name)
              .replace('@number', issue_number);

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> {
                      return d.data.organization.repository.issue.comments;
                  }))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return response.data;

            // nodes 2 objs and pooling
            const projects
                  = this.node2objs(
                      response.data.nodes,
                      node=> this.node2issueComment(node));

            // concat out
            out = out.concat(projects);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    /////
    ///// ProjectV2
    /////
    async asyncFetchProjectsV2ByViewer () {
        // TODO: とりあえず、これで...
        const user = this.viewer();

        if (!user)
            return [];

        const query = this.query('projectsv2_by_user')
              .replace('@login', user.login());

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> d.data.user.projectsV2))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return out;

            // nodes 2 objs and pooling
            const projects
                  = this.node2objs(
                      response.data.nodes,
                      node=> this.node2projectV2(node));

            // concat out
            out = out.concat(projects);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    async asyncFetchProjectsV2ByTeam (team_id, callbacks={}) {
        if (callbacks.start) callbacks.start();

        const query = this.query('projectsv2_by_team')
              .replace('@team-id', team_id);

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> d.data.node.projectsV2))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type) {
                if (callbacks.failed) callbacks.failed(out);
                return response.data;
            }

            // nodes 2 objs and pooling
            const projects
                  = this.node2objs(
                      response.data.edges,
                      data=> this.node2projectV2(data.node));

            // concat out
            out = out.concat(projects);

            if (callbacks.fetched) callbacks.fetched(projects, out);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        if (callbacks.successed) callbacks.successed(out);

        return out;
    }
    async asyncFetchProjectsV2WithItemsByTeam (team_id, callbacks={}) {
        if (callbacks.start) callbacks.start();

        const query = this.query('projectsv2_with_items_by_team')
              .replace('@team-id', team_id);

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> d.data.node.projectsV2))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type) {
                if (callbacks.failed) callbacks.failed(out);
                return response.data;
            }

            // nodes 2 objs and pooling
            const projects
                  = this.node2objs(
                      response.data.edges,
                      data=> this.node2projectV2(data.node));

            // concat out
            out = out.concat(projects);

            if (callbacks.fetched) callbacks.fetched(projects, out);

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        if (callbacks.successed) callbacks.successed(out);

        return out;
    }
    async asyncFetchProjectV2ByUserLoginProjectV2Number (login, number, callbacks={}) {
        callback('start', callbacks);

        const query = this.query('projectv2_by_user_login_projectv2_number')
              .replace('@user-login', login)
              .replace('@projectv2-number', number);

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.user.projectV2;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type) {
            callback('failed', callbacks);
            return response.data;
        }

        callback('successed', callbacks, [response.data]);

        // nodes 2 objs and pooling
        return this.node2projectV2(response.data).id();
    }
    async asyncFetchProjectV2ByOrgLoginProjectV2Number (login, number, callbacks={}) {
        callback('start', callbacks, [login, number]);

        const query = this.query('projectv2_by_org_login_projectv2_number')
              .replace('@user-login', login)
              .replace('@projectv2-number', number);

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.organization.projectV2;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type) {
            callback('failed', callbacks, [response.data, login, number]);
            return response.data;
        }

        callback('successed', callbacks, [response.data, login, number]);

        // nodes 2 objs and pooling
        return this.node2projectV2(response.data).id();
    }
    /////
    ///// ProjectV2 Item
    /////
    // ProjectV2 の Item を、最後のページまで取る。(yanqirenshi/SOGH.next#64)
    // 失敗したときは、エラーを返す。(途中まで集めた分は返さない)
    async asyncFetchProjectV2ItemsByUserLoginProjectV2Number (login, number) {
        const query = this.query('projectv2items_by_user_login_projectv2_number')
              .replace('@user-login', login)
              .replace('@projectv2-number', number);

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> {
                      return d.data.user.projectV2.items;
                  }))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return response.data;

            // nodes 2 objs and pooling
            out = out.concat(response.data.nodes.map(d=> this.node2projectV2Item(d).id()));

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    // ProjectV2 の Item を、最後のページまで取る。(yanqirenshi/SOGH.next#64)
    // 失敗したときは、エラーを返す。(途中まで集めた分は返さない)
    async asyncFetchProjectV2ItemsByOrgLoginProjectV2Number (login, number) {
        const query = this.query('projectv2items_by_org_login_projectv2_number')
              .replace('@user-login', login)
              .replace('@projectv2-number', number);

        let out = [];
        let loop = true, cursor = null;

        while (loop) {
            const query_pageing = this.makeQuery(query, cursor);
            const post_data = this.postData(query_pageing);

            // fetch
            const response = await fetch(this.endpoint(), post_data)
                  .then(res  => this.text2json(res))
                  .then(res  => this.json2response(res, d=> {
                      return d.data.organization.projectV2.items;
                  }))
                  .catch(err => this.error2response(err));

            // case of error
            if ('error'===response.type)
                return response.data;

            // nodes 2 objs and pooling
            out = out.concat(response.data.nodes.map(d=> this.node2projectV2Item(d).id()));

            // paging
            const page_info = response.data.pageInfo;
            cursor = page_info.endCursor;
            loop   = page_info.hasNextPage;
        }

        return out;
    }
    async asyncFetchProjectV2ItemByID (id) {
        const query = this.query('projectv2item_by_id')
              .replace('@id', id);

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.node;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type)
            return response.data;

        // create object
        const obj = this.node2projectV2Item(response.data);

        // nodes 2 objs and pooling
        return obj.id();
    }
    async asyncFetchItemByID (id) {
        const query = this.query('issue_by_id')
              .replace('@id', id);

        const post_data = this.postData(query);

        // fetch
        const response = await fetch(this.endpoint(), post_data)
              .then(res  => this.text2json(res))
              .then(res  => this.json2response(res, d=> {
                  return d.data.node;
              }))
              .catch(err => this.error2response(err));

        // case of error
        if ('error'===response.type)
            return response.data;

        // create object
        const obj = this.node2issue(response.data);

        // nodes 2 objs and pooling
        return obj.id();
    }
}

function callback (name, callbacks, params=[]) {
    const fn = callbacks[name];

    if (!fn || (typeof fn !== 'function'))
        return;

    fn(...params);
}
