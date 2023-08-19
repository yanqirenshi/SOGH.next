import Pooler from './Pooler.js';

import * as queries from './queries/index.js';

export default class Sogh extends Pooler {
    constructor () {
        super();

        this._routes = {
            'issue':            '/issues/:id',
            'project-v2':       '/projectsV2/:id',
            'project-v2-items': '/projectV2-items/:id',
        };
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
    connect (token) {
        this.token(token);

        return this.fetchX(
            queries.viwer,
            (node) => {
                return this.node2user(node.data.viewer);
            },
            (results) => {
                this.viewer(results.data);
            },
            (r) => {
                this.viewer(null);
            });
    }
    /** **************************************************************** *
     * fetch
     * **************************************************************** */
    xxx (node_or_nodes, make) {
        if (Array.isArray(node_or_nodes)) {
            const nodes = node_or_nodes;

            return nodes.map(node=> {
                return make(node).id();
            });
        }

        const node = make(node_or_nodes);

        return node.id();
    }
    yyy (data, make, appender) {
        const out = {
            contents: this.xxx(data.nodes, make),
        };

        appender && appender(data, out);

        out.pageInfo = data.pageInfo;

        return out;
    }
    zzz (data, make) {
        return {
            contents: this.xxx(data.node, make),
        };
    }
    fetchRepositoriesByViewer (success, fail) {
        const query = queries.repositories_by_viewer;

        const query_pageing = this.ensureEndCursor(query, null);

        this.fetchX(
            query_pageing,
            (response)=> {
                const repositories = response.data.viewer.repositories;

                const x = this.yyy(repositories, node=> this.node2repository(node));

                if (success) success(x);
            },
            (error)=> {
                if (fail) fail(error);
            });
    }
    async asyncFetchRepositoriesByViewer () {
        const endpoint = 'https://api.github.com/graphql';
        const query = queries.repositories_by_viewer;

        let out = [];
        let loop = true;
        let end_cursor = null;

        while (loop) {
            const query_pageing = this.ensureEndCursor(query, end_cursor);

            const post_data = this.postData(query_pageing);

            const response = await fetch(endpoint, post_data)
                  .then(r => r.ok ? r.json() : Promise.reject(r))
                  .then(r => {
                      if (r.errors)
                          throw new Error(r.errors);

                      return {
                          type: 'success',
                          data: r.data.viewer.repositories,
                      };
                  })
                  .catch(err => {
                      return { type: 'error', data: err };
                  });

            if ('error'===response.type)
                return response.data;

            const page_info = response.data.pageInfo;
            const nodes     = response.data.nodes;

            loop = page_info.hasNextPage;

            end_cursor = page_info.endCursor;

            out = out.concat(nodes);
        }

        return out;
    }
    fetchUserByID (id, success, fail) {
        const query = queries.user_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> {
                const x = this.zzz(response.data, node=> this.node2user(node));

                if (success) success(x);
            },
            (error)=> {
                if (fail) fail(error);
            });
    }
    fetchProjectsV2ByUser (user, success, fail) {
        const query = queries.projectsv2_by_user.replace('@login', user.login());

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results)=> {
                const data = results.data.user.projectsV2;

                const x = this.yyy(data, node=> this.node2projectV2(node));

                if (success) success(x);
            },
            (error)=> {
                if (fail) fail(error);
            });
    }
    fetchProjectsV2ByID (id, success, fail) {
        const query = queries.projects_next_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);
        return this.fetchX(
            query_pageing,
            (response)=> {
                const x =  this.zzz(response.data, node=> this.node2projectV2(node));

                if (success) success(x);
            },
            (error)=> {
                if (fail) fail(error);
            });
    }
    fetchProjectV2ItemsByProjectNext (project_next, success, fail) {
        const query = queries.projects_v2_items_by_projects_v2.replace('@id', project_next.id());
        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results)=> {
                const x = this.yyy(results.data.node.items,
                                node=> this.node2projectV2Item(node),
                                (data, out)=>{
                                    out.fields = results.data.node.fields.nodes;
                                });

                if (success) success(x);
            },
            (error)=> {
                if (fail) fail(error);
            });
    }
    fetchProjectNextItemByID (id) {
        const query = queries.projects_next_items_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> this.zzz(response.data,
                                  node=> this.node2projectV2Item(node)));
    }
    fetchIssueByID (id) {
        const query = queries.issue_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> this.zzz(response.data,
                                  node=> this.node2issue(node)));
    }
    fetchIssueCommentsByIssueID (id) {
        const query = queries.issue_comments_by_issue_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> {
                return this.yyy(response.data.node.comments,
                                node=> this.node2issueComment(node));
            });
    }
}
