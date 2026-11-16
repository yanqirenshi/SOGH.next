// ProjectV2 の Item を取るメソッドが、最後のページまで取ることのテスト。(yanqirenshi/SOGH.next#64)
// ページ送りは、変数 after で渡す。(yanqirenshi/SOGH.next#63)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。
// globalThis.fetch を、にせのもの (決めた応答を順に返し、送られた body を覚える) に差し替えて確かめる。
// 差し替えは、テストごとに元に戻す。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import { fakeFetch, withFetch } from './fake-fetch.mjs';

const T1 = '2026-11-01T09:00:00Z';

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
    ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', 'user',         'projectv2items_by_user_login_projectv2_number', 'login'],
    ['asyncFetchProjectV2ItemsByOrgLoginProjectV2Number',  'organization', 'projectv2items_by_org_login_projectv2_number',  'org'],
];

for (const [method, owner, code, login_name] of METHODS) {
    test(`${method}: クエリは、変数 $after で items をページ送りし、pageInfo を取る`, ()=> {
        const sogh = new Sogh();
        const query = sogh.query(code);

        assert.match(query, /\$after: String/);
        assert.match(query, /items\(after: \$after, first: 100\)/);
        assert.match(query, /pageInfo \{/);
        assert.equal(query.includes('after: ""'), false);
    });

    test(`${method}: 2 ページ以上あるときは、最後のページまで取り、全ページ分の id を返す`, async ()=> {
        const sogh = new Sogh();

        const fake = fakeFetch([
            page(owner, ['PVTI_1', 'PVTI_2'], true, 'CURSOR_1'),
            page(owner, ['PVTI_3'], true, 'CURSOR_2'),
            page(owner, ['PVTI_4'], false, 'CURSOR_3'),
        ]);

        const ids = await withFetch(fake, ()=> sogh[method]('octocat', '1'));

        assert.deepEqual(ids, ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4']);
        assert.equal(fake.requests.length, 3);

        // クエリの文字列は、どの回も同じ。値は variables で渡す。
        for (const request of fake.requests)
            assert.equal(request.query, sogh.query(code));

        // 1 回めは after が null。2 回め以降は、前の回の endCursor。number は数値にして渡す。
        assert.deepEqual(fake.requests.map(r=> r.variables), [
            { [login_name]: 'octocat', number: 1, after: null },
            { [login_name]: 'octocat', number: 1, after: 'CURSOR_1' },
            { [login_name]: 'octocat', number: 1, after: 'CURSOR_2' },
        ]);

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

    test(`${method}: 途中のページで GraphQL のエラーが返ったときは、例外を投げる (yanqirenshi/SOGH.next#61)`, async ()=> {
        const sogh = new Sogh();

        const errors = [{ type: 'NOT_FOUND', message: 'にせのエラー' }];

        const fake = fakeFetch([
            page(owner, ['PVTI_1'], true, 'CURSOR_1'),
            { json: { data: null, errors } },
        ]);

        await assert.rejects(withFetch(fake, ()=> sogh[method]('octocat', 1)), (e)=> {
            assert.equal(e.name, 'GitHubError');
            assert.equal(e.message, 'にせのエラー');
            assert.deepEqual(e.errors, errors);
            assert.equal(e.status, 200);
            return true;
        });

        assert.equal(fake.requests.length, 2);
    });

    test(`${method}: 途中のページで HTTP のエラーが返ったときも、例外を投げる`, async ()=> {
        const sogh = new Sogh();

        const fake = fakeFetch([
            page(owner, ['PVTI_1'], true, 'CURSOR_1'),
            { status: 502 },
        ]);

        await assert.rejects(withFetch(fake, ()=> sogh[method]('octocat', 1)), (e)=> {
            assert.equal(e.name, 'GitHubError');
            assert.equal(e.status, 502);
            assert.equal(e.errors, null);
            assert.equal(e.response.status, 502);
            return true;
        });
    });
}
