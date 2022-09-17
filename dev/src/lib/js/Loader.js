import * as model from './models/index.js';

import * as query from './queries/index.js';
import GithubApiV4 from './GithubApiV4.js';

export default class Loader {
    constructor () {
        this._token = null;

        this._viewer = null;

        this._api = {
            v4: null,
        };
    }
    token (v) {
        if (arguments.length > 0)
            this._token = v;

        return this._token;
    }
    viewer (v) {
        if (arguments.length > 0){
            this._viewer = v;
        }

        return this._viewer;
    }
    api (v) {
        if (arguments.length > 0)
            this._api.v4 = v;

        return this._api.v4;
    }
    isConnected () {
        return this._viewer !== null && this.api() !== null;
    }
    ensureEndCursor (query, endCursor) {
        if (endCursor)
            return query.replace('after: "",', `after: "${endCursor}",`);

        return query.replace('after: "",', '');
    }
    makeGraphQLDataItem (v) {
        if ("string"===(typeof v))
            return JSON.stringify(v);

        if (Array.isArray(v))
            return '[' + v.map(d => this.makeGraphQLDataItem(d)).join(', ') + ']';

        return v;
    }
    makeGraphQLData (data) {
        const x = Object.keys(data).map(key => {
            const val = data[key];

            if (val===null
                || (Array.isArray(val) && val.length===0))
                return null;

            return key + ': ' + this.makeGraphQLDataItem(data[key]);
        });

        return '{ ' + x.filter(d=>d!==null).join(', ') + ' }';
    }
    /** **************************************************************** *
     *  Api
     * **************************************************************** */
    token (api_or_token) {
        if ((typeof api_or_token)==="string")
            return api_or_token;
        else
            return api_or_token.__auth.token;
    }
    makeHeader (api_or_token) {
        return {
            'Authorization': `bearer ${this.token(api_or_token)}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
    postData (api_or_token, query) {
        return {
            method: 'POST',
            headers: this.makeHeader(api_or_token),
            body: JSON.stringify({query: query})
        };
    }
    fetch (query, success, error) {
        const endpoint = 'https://api.github.com/graphql';
        const post_data = this.postData(this._token, query);

        // Promis を返す
        return fetch(endpoint, post_data)
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(r => {
                const out = { status: 'success', data: r.data };

                // コールバック関数に結果を返す。
                // SOGH の処理用。
                if (success) success(out);

                return out;
            })
            .catch(err => {
                const out = { status: 'error', error };

                // コールバック関数に結果を返す。
                // SOGH の処理用。
                error ? error(out) : console.error(err);

                return out;
            });
    }
    /** **************************************************************** *
     *  Use?
     * **************************************************************** */
    fetchRepositories (owner, name, cb) {
        if (!this.api()._token || !owner || !name)
            cb(null);

        const api = this.api();

        const base_query = query.repository
              .replace('@owner', owner)
              .replace('@name', name);

        const addReop = (success, data) => {
            const repos = this._data.repositories;

            if (!repos[owner])
                repos[owner] = {};

            repos[owner][name] = {
                data:  success ? new model.Repository(data) : null,
                valid: success,
                error: success ? null : data,
            };
        };

        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                if (results.errors)
                    addReop(false, results.errors);
                else
                    addReop(true, results.data.repository);

                if (cb) cb(!results.errors);
            });
        };

        getter();
    }
    /** **************************************************************** *
     * New
     * **************************************************************** */
    connect (token, success, error) {
        const api = new GithubApiV4(token);

        // api を実行するための Promis を返す。
        return api.fetch(
            query.viwer,
            // コールバック： API実行結果 → 成功
            // SOGH としての処理を実行する。
            (results) => {
                const data = results.data;

                this.token(token);
                this.viewer(new model.Viewer(data.viewer));
                this.api(api);

                success && success();
            },
            // コールバック： API実行結果 → エラー
            // SOGH としての処理を実行する。
            (r) => {
                this.token(token);
                this.viewer(null);
                this.api(null);

                console.error(r);

                error && error(r);
            });
    }
    fetchRepositoriesByViewer (success, error) {
        // success, error は不要だな。
        const api = this.api();

        const base = query.repositories_by_viewer;
        const statmenet = this.ensureEndCursor(base, null);

        return api.fetch(
            statmenet,
            // success
            (results) => {
                const data = results.data;

                const list = data.viewer.repositories.nodes || [];

                success && success(list.map(d=> new model.Repository(d)));
            },
            // error
            (r) => {
                console.erro(r);

                error && error(r);
            });
    }
    fetchUserByID (id) {
        const api = this.api();

        const base = query.user_by_id.replace('@id', id);

        const statmenet = this.ensureEndCursor(base, null);

        return api.fetch(statmenet);
    }
    fetchProjectsNextByUser (user) {
        const api = this.api();

        const base = query.projects_next_by_user.replace('@login', user.login());

        const statmenet = this.ensureEndCursor(base, null);

        return api.fetch(statmenet);
    }
    fetchProjectsNextByID (id) {
        const api = this.api();

        const base = query.projects_next_by_id.replace('@id', id);

        const statmenet = this.ensureEndCursor(base, null);

        return api.fetch(statmenet);
    }
}
