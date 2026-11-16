// ProjectV2 の Item を取るメソッドが、最後のページまで取ることのテスト。(yanqirenshi/SOGH.next#64)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。
// globalThis.fetch を、にせのもの (決めた応答を順に返し、送られたクエリを覚える) に差し替えて確かめる。
// 差し替えは、テストごとに元に戻す。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';

const T1 = '2026-11-01T09:00:00Z';

// にせの fetch を作る。
//   pages … 1 回ごとの応答。{ json } (GraphQL の応答) か、{ status } (HTTP のエラー)。
// 返す値の requests に、送られたクエリの文字列が、順に入る。
function fakeFetch (pages) {
    const requests = [];

    const fetch = async (url, post_data)=> {
        requests.push(JSON.parse(post_data.body).query);

        const page = pages[requests.length - 1];

        if (!page)
            throw new Error('にせの fetch: 応答が足りない');

        if (page.status)
            return { ok: false, status: page.status, json: async ()=> ({}) };

        return { ok: true, status: 200, json: async ()=> page.json };
    };

    return { fetch, requests };
}

// テストの中だけ、fetch を差し替える。
async function withFetch (fake, fn) {
    const saved = globalThis.fetch;

    globalThis.fetch = fake.fetch;

    try {
        return await fn();
    } finally {
        globalThis.fetch = saved;
    }
}

const item = (id)=> ({ __typename: 'ProjectV2Item', id, type: 'ISSUE', isArchived: false, updatedAt: T1 });

// 1 ページ分の応答。(owner は 'user' か 'organization')
function page (owner, ids, has_next, end_cursor) {
    return {
        json: {
            data: {
                [owner]: {
                    projectV2: {
                        id: 'PVT_1',
                        items: {
                            nodes: ids.map(item),
                            pageInfo: { endCursor: end_cursor, hasNextPage: has_next, hasPreviousPage: false, startCursor: null },
                        },
                    },
                },
            },
        },
    };
}

const METHODS = [
    ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', 'user',         'projectv2items_by_user_login_projectv2_number'],
    ['asyncFetchProjectV2ItemsByOrgLoginProjectV2Number',  'organization', 'projectv2items_by_org_login_projectv2_number'],
];

for (const [method, owner, code] of METHODS) {
    test(`${method}: クエリの、ページ送りの印 (after: "",) は 1 か所だけで、items にある`, ()=> {
        const sogh = new Sogh();
        const query = sogh.query(code);

        assert.equal(query.split('after: "",').length - 1, 1);
        assert.match(query, /items\(after: "", first: 100\)/);
        assert.match(query, /pageInfo \{/);
    });

    test(`${method}: 2 ページ以上あるときは、最後のページまで取り、全ページ分の id を返す`, async ()=> {
        const sogh = new Sogh();

        const fake = fakeFetch([
            page(owner, ['PVTI_1', 'PVTI_2'], true, 'CURSOR_1'),
            page(owner, ['PVTI_3'], true, 'CURSOR_2'),
            page(owner, ['PVTI_4'], false, 'CURSOR_3'),
        ]);

        const ids = await withFetch(fake, ()=> sogh[method]('octocat', 1));

        assert.deepEqual(ids, ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4']);
        assert.equal(fake.requests.length, 3);

        // 1 回めは、after を外して送る。2 回め以降は、前の回の endCursor を入れて送る。
        assert.equal(fake.requests[0].includes('after:'), false);
        assert.match(fake.requests[0], /items\(\s*first: 100\)/);
        assert.match(fake.requests[1], /items\(after: "CURSOR_1", first: 100\)/);
        assert.match(fake.requests[2], /items\(after: "CURSOR_2", first: 100\)/);

        // fields は、どの回も、そのまま。
        for (const query of fake.requests)
            assert.match(query, /fields\(first: 30\)/);

        // 全ページの Item が、Pool に入っている。
        for (const id of ids)
            assert.ok(sogh.projectV2Item(id), id);
    });

    test(`${method}: 1 ページだけのときは、1 回で終わる`, async ()=> {
        const sogh = new Sogh();

        const fake = fakeFetch([page(owner, ['PVTI_1'], false, 'CURSOR_1')]);

        const ids = await withFetch(fake, ()=> sogh[method]('octocat', 1));

        assert.deepEqual(ids, ['PVTI_1']);
        assert.equal(fake.requests.length, 1);
    });

    test(`${method}: 途中のページで GraphQL のエラーが返ったときは、エラーを返す (途中まで集めた分は返さない)`, async ()=> {
        const sogh = new Sogh();

        const fake = fakeFetch([
            page(owner, ['PVTI_1'], true, 'CURSOR_1'),
            { json: { data: null, errors: [{ type: 'NOT_FOUND', message: 'にせのエラー' }] } },
        ]);

        const result = await withFetch(fake, ()=> sogh[method]('octocat', 1));

        assert.ok(result instanceof Error);
        assert.equal(result.message, 'にせのエラー');
        assert.equal(fake.requests.length, 2);
    });

    test(`${method}: 途中のページで HTTP のエラーが返ったときも、エラー (応答) を返す`, async ()=> {
        const sogh = new Sogh();

        const fake = fakeFetch([
            page(owner, ['PVTI_1'], true, 'CURSOR_1'),
            { status: 502 },
        ]);

        const result = await withFetch(fake, ()=> sogh[method]('octocat', 1));

        assert.equal(Array.isArray(result), false);
        assert.equal(result.status, 502);
    });
}
