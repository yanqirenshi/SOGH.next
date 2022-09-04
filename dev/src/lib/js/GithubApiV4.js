export default class GithubApiV4 {
    constructor (token) {
        this._token = token;
    }
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
}
