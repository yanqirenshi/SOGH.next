import Pooler from './Pooler.js';

import * as queries from './queries/index.js';

export default class Sogh extends Pooler {
    // constructor () { super(); }
    href (obj, to, data) {
        const x = {
            'project-next': '/projects-next/:id'
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
    fetchRepositoriesByViewer (success, error) {
        const query = queries.repositories_by_viewer;

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results) => {
                const data = results.data;

                const list = data.viewer.repositories.nodes || [];

                return list.map(node=> this.node2repository(node));
            });
    }
    fetchUserByID (id) {
        const query = queries.user_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results)=> this.node2user(results.data.node));
    }
    fetchProjectsNextByUser (user) {
        const query = queries.projects_next_by_user.replace('@login', user.login());

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (results)=> {
                const nodes = results.data.user.projectsNext.nodes;

                return nodes.map(node=>this.node2projectNext(node));
            });
    }
    fetchProjectsNextByID (id) {
        const query = queries.projects_next_by_id.replace('@id', id);

        const query_pageing = this.ensureEndCursor(query, null);

        return this.fetchX(
            query_pageing,
            (response)=> {
                console.log(response);
                const node = response.data.node;

                return this.node2projectNext(node);
            });
    }
}
