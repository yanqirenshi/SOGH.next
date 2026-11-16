// GitHub への問い合わせが失敗したときに投げる例外。(yanqirenshi/SOGH.next#61)
//   status   … HTTP の状態コード。(つながらなかったときは null)
//   errors   … GraphQL のエラー (GitHub の応答の errors の配列)。無いときは null。
//   response … fetch の Response。(つながらなかったときは null)
//   cause    … 元の例外。(つながらなかったとき)
export class GitHubError extends Error {
    constructor (message, { status=null, errors=null, response=null, cause } = {}) {
        super(message, cause===undefined ? undefined : { cause });

        this.name = 'GitHubError';
        this.status = status;
        this.errors = errors;
        this.response = response;
    }
}

export default class Loader {
    constructor () {
        this._token = null;

        this._viewer = null;

        this._endpoint = 'https://api.github.com/graphql';

        this._api = {
            v4: null,
        };
    }
    endpoint () {
        return this._endpoint;
    }
    /** *************************************************************** *
     *  Auth
     * **************************************************************** */
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
    isConnected () {
        return this.viewer() !== null;
    }
    /** *************************************************************** *
     *  Api
     * **************************************************************** */
    // クエリを 1 回送り、応答の data を返す。(yanqirenshi/SOGH.next#61)
    // 失敗したときは、GitHubError を投げる。
    //   つながらない           … status は null。cause に、元の例外。
    //   HTTP のエラー          … status に HTTP の状態コード。response に、fetch の Response。
    //   GraphQL のエラー       … errors に、GitHub の errors (配列)。status は HTTP の状態コード (ふつう 200)。
    async request (query, variables) {
        let response;

        try {
            response = await fetch(this.endpoint(), this.postData(query, variables));
        } catch (e) {
            throw new GitHubError(`GitHub につながりませんでした: ${e && e.message}`, { cause: e });
        }

        if (!response.ok)
            throw new GitHubError(`GitHub が HTTP ${response.status} を返しました`, { status: response.status, response });

        const json = await response.json();

        if (json.errors) {
            // GraphQL の errors は配列なので、message を連結して読める形にする。
            const messages = json.errors.map(e=> (e && e.message) || JSON.stringify(e));

            throw new GitHubError(messages.join('\n'), { status: response.status, errors: json.errors, response });
        }

        return json.data;
    }
    makeHeader () {
        return {
            'Authorization': `bearer ${this.token()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }
    postData (query, variables) {
        const body = { query: query };

        // 値はクエリ文字列に埋め込まず、GraphQL の variables で渡す。
        // (改行や " を含む値でもクエリが壊れない)
        if (variables)
            body.variables = variables;

        return {
            method: 'POST',
            headers: this.makeHeader(),
            body: JSON.stringify(body)
        };
    }
    fetch (query, success, error) {
        const post_data = this.postData(query);

        // Promis を返す
        return fetch(this.endpoint(), post_data)
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(r => {
                const out = { status: 'success', data: r.data };

                // コールバック関数に結果を返す。
                // SOGH の処理用。
                if (success) success(out);

                return out;
            })
            .catch(err => {
                const out = { status: 'error', error: err };

                // コールバック関数に結果を返す。
                // SOGH の処理用。
                error ? error(out) : console.error(err);

                return out;
            });
    }
    fetchX (query, response2data, success, error) {
        const endpoint = 'https://api.github.com/graphql';
        const post_data = this.postData(query);

        return fetch(endpoint, post_data)
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .then(r => {
                const out = {
                    status: 'success',
                    data: response2data ? response2data(r) : r,
                };

                success && success(out);

                return out;
            })
            .catch(err => {
                const out = { status: 'error', error: err };

                error && error(out);

                return out;
            });
    }
    /** *************************************************************** *
     *  Terminate ?
     * **************************************************************** */
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
    /** *************************************************************** *
     *  Response
     * **************************************************************** */
    text2json (r) {
        return r.ok ? r.json() : Promise.reject(r);
    }
    json2response (r, getData) {
        if (r.errors) {
            // GraphQL の errors は配列なので、message を連結して読める形にする。
            const messages = r.errors.map(e=> (e && e.message) || JSON.stringify(e));
            const error = new Error(messages.join('\n'));

            error.errors = r.errors;

            throw error;
        }

        return {
            type: 'success',
            data: getData(r),
        };
    }
    error2response (error) {
        return { type: 'error', data: error };
    }
}
