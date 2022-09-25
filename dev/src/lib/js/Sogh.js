import Pooler from './Pooler.js';

import * as queries from './queries/index.js';

export default class Sogh extends Pooler {
    // constructor () { super(); }
    href (obj, to, data) {
        const x = {
            'issue':             '/issues/:id',
            'project-next':      '/projects-next/:id',
            'project-next-item': '/project-next-items/:id',
        };

        const base = x[to];
        const keys = Object.keys(data);

        return keys.reduce((str, key)=> {
            let out = str;

            if (key==='id') out = str.replaceAll(':id', obj.id());

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
    yyy (data, make) {
        const out = {
            contents: this.xxx(data.nodes, make),
        };

        out.pageInfo = data.pageInfo;

        return out;
    }
    zzz (data, make) {
        return {
            contents: this.xxx(data.node, make),
        };
    }
    fetchRepositoriesByViewer () {
        const query = queries.repositories_by_viewer;

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> this.yyy(response.data.viewer.repositories,
                                  node=> this.node2repository(node)));
    }
    fetchUserByID (id) {
        const query = queries.user_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> this.zzz(response.data,
                                  node=> this.node2user(node)));
    }
    fetchProjectsV2ByUser (user) {
        const query = queries.projectsv2_by_user.replace('@login', user.login());

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results)=> this.yyy(results.data.user.projectsV2,
                                 node=> this.node2projectNext(node)));
    }
    fetchProjectsNextByID (id) {
        const query = queries.projects_next_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);
        return this.fetchX(
            query_pageing,
            (response)=> this.zzz(response.data,
                                  node=> this.node2projectNext(node)));
    }
    fetchProjectNextItemsByProjectNext (project_next) {
        const query = queries.projects_next_items_by_projects_next.replace('@id', project_next.id());
        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results)=> {
                return this.yyy(results.data.node.items,
                                node=> this.node2projectNextItem(node));
            });
    }
    fetchProjectNextItemByID (id) {
        const query = queries.projects_next_items_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> this.zzz(response.data,
                                  node=> this.node2projectNextItem(node)));
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
