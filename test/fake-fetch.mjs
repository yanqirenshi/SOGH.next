// テストで使う、にせの fetch。(テストのファイルではない。名前が *.test.mjs でないので、npm test は直には動かさない)
//
//   fakeFetch(pages) … 決めた応答を、順に返す fetch を作る。
//     pages の 1 つずつ: { json } (GraphQL の応答) か、{ status } (HTTP のエラー) か、{ throws } (つながらない)。
//     返す値の requests に、送られた body ({ query, variables }) が、順に入る。
//   withFetch(fake, fn) … fn を動かすあいだだけ、globalThis.fetch を差し替える。(終わったら元に戻す)

export function fakeFetch (pages) {
    const requests = [];

    const fetch = async (url, post_data)=> {
        requests.push(JSON.parse(post_data.body));

        const page = pages[requests.length - 1];

        if (!page)
            throw new Error('にせの fetch: 応答が足りない');

        if (page.throws)
            throw page.throws;

        if (page.status)
            return { ok: false, status: page.status, json: async ()=> ({}) };

        return { ok: true, status: 200, json: async ()=> page.json };
    };

    return { fetch, requests };
}

export async function withFetch (fake, fn) {
    const saved = globalThis.fetch;

    globalThis.fetch = fake.fetch;

    try {
        return await fn();
    } finally {
        globalThis.fetch = saved;
    }
}
