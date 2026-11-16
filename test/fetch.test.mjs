// 取得のメソッド (asyncFetch〜) のテスト。
//   - 値は variables で渡す。(yanqirenshi/SOGH.next#63)
//   - 失敗したときは、例外 (GitHubError) を投げる。(yanqirenshi/SOGH.next#61)
//   - コールバックを受け取るメソッドは、failed(error, ...) を呼んでから投げる。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの fetch (test/fake-fetch.mjs) を使う。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import { GitHubError } from '../src/js/Loader.js';
import { fakeFetch, withFetch } from './fake-fetch.mjs';

const T1 = '2026-11-01T09:00:00Z';

const ERRORS = [{ type: 'NOT_FOUND', message: 'にせのエラー' }];
const GRAPHQL_ERROR = { json: { data: null, errors: ERRORS } };

// 引数と、送る variables。(16 個のメソッド)
const CALLS = [
    ['asyncFetchViewer',                                   [],                               undefined],
    ['asyncFetchRepositoriesByViewer',                     [],                               { after: null }],
    ['asyncFetchIssueByID',                                ['I_1'],                          { id: 'I_1' }],
    ['asyncFetchIssueByViewer',                            [],                               { after: null }],
    ['asyncFetchIssueByOrgRepoIssueNumber',                ['acme', 'repo', '12'],           { org: 'acme', repo: 'repo', number: 12 }],
    ['asyncFetchIssueCommentsByID',                        ['I_1'],                          { id: 'I_1', after: null }],
    ['asyncFetchIssueCommentsByOrgRepoIssueNumber',        ['acme', 'repo', 12],             { org: 'acme', repo: 'repo', number: 12, after: null }],
    ['asyncFetchProjectsV2ByViewer',                       [],                               { login: 'octocat', after: null }],
    ['asyncFetchProjectsV2ByTeam',                         ['T_1'],                          { teamId: 'T_1', after: null }],
    ['asyncFetchProjectsV2WithItemsByTeam',                ['T_1'],                          { teamId: 'T_1', after: null }],
    ['asyncFetchProjectV2ByUserLoginProjectV2Number',      ['octocat', '3'],                 { login: 'octocat', number: 3 }],
    ['asyncFetchProjectV2ByOrgLoginProjectV2Number',       ['acme', 3],                      { org: 'acme', number: 3 }],
    ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', ['octocat', 3],                   { login: 'octocat', number: 3, after: null }],
    ['asyncFetchProjectV2ItemsByOrgLoginProjectV2Number',  ['acme', 3],                      { org: 'acme', number: 3, after: null }],
    ['asyncFetchProjectV2ItemByID',                        ['PVTI_1'],                       { id: 'PVTI_1' }],
    ['asyncFetchItemByID',                                 ['I_1'],                          { id: 'I_1' }],
];

// viewer が入った Sogh。(asyncFetchProjectsV2ByViewer は、viewer の login を使う)
function soghWithViewer () {
    const sogh = new Sogh();

    sogh.viewer(sogh.node2user({ __typename: 'User', id: 'U_1', login: 'octocat', updatedAt: T1 }));

    return sogh;
}

/* ****************************************************************
 * variables
 * **************************************************************** */

for (const [method, args, variables] of CALLS) {
    test(`${method}: 値を variables で渡す。失敗したら GitHubError を投げる`, async ()=> {
        const sogh = soghWithViewer();
        const fake = fakeFetch([GRAPHQL_ERROR]);

        await assert.rejects(withFetch(fake, ()=> sogh[method](...args)), (e)=> {
            assert.ok(e instanceof GitHubError);
            assert.equal(e.name, 'GitHubError');
            assert.deepEqual(e.errors, ERRORS);
            assert.equal(e.status, 200);
            return true;
        });

        assert.equal(fake.requests.length, 1);
        assert.deepEqual(fake.requests[0].variables, variables);
        assert.equal(/@[a-z]/.test(fake.requests[0].query), false);
    });
}

/* ****************************************************************
 * 失敗 (yanqirenshi/SOGH.next#61)
 * **************************************************************** */

// 1 ページめは取れて、2 ページめで失敗する応答。
const pageOf = (pick_path, nodes, has_next)=> {
    const connection = { nodes, pageInfo: { endCursor: 'C1', hasNextPage: has_next } };

    return { json: { data: pick_path.reduceRight((inner, key)=> ({ [key]: inner }), connection) } };
};

const PARTIAL = [
    ['asyncFetchRepositoriesByViewer', ['viewer', 'repositories'],  { __typename: 'Repository', id: 'R_1', name: 'r', updatedAt: T1 }],
    ['asyncFetchIssueByViewer',        ['viewer', 'issues'],        { __typename: 'Issue', id: 'I_1', updatedAt: T1 }],
    ['asyncFetchProjectsV2ByViewer',   ['user', 'projectsV2'],      { __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1 }],
];

for (const [method, pick_path, node] of PARTIAL) {
    test(`${method}: 途中のページで失敗したときも、集めた分を返さずに、例外を投げる`, async ()=> {
        const sogh = soghWithViewer();
        const fake = fakeFetch([pageOf(pick_path, [node], true), GRAPHQL_ERROR]);

        await assert.rejects(withFetch(fake, ()=> sogh[method]()), GitHubError);

        assert.equal(fake.requests.length, 2);
        assert.equal(fake.requests[1].variables.after, 'C1');
    });
}

test('HTTP のエラーのときは、status と response を持つ GitHubError を投げる', async ()=> {
    const sogh = new Sogh();

    await assert.rejects(withFetch(fakeFetch([{ status: 401 }]), ()=> sogh.asyncFetchIssueByID('I_1')), (e)=> {
        assert.ok(e instanceof GitHubError);
        assert.equal(e.status, 401);
        assert.equal(e.errors, null);
        assert.equal(e.response.status, 401);
        return true;
    });
});

test('つながらないときは、status が null で、cause に元の例外を持つ GitHubError を投げる', async ()=> {
    const sogh = new Sogh();
    const cause = new TypeError('fetch failed');

    await assert.rejects(withFetch(fakeFetch([{ throws: cause }]), ()=> sogh.asyncFetchIssueByID('I_1')), (e)=> {
        assert.ok(e instanceof GitHubError);
        assert.equal(e.status, null);
        assert.equal(e.cause, cause);
        return true;
    });
});

test('応答に、取り出す値が無い (node が null) ときも、GitHubError を投げる', async ()=> {
    const sogh = new Sogh();

    await assert.rejects(withFetch(fakeFetch([{ json: { data: { node: null } } }]), ()=> sogh.asyncFetchIssueByID('I_1')), (e)=> {
        assert.ok(e instanceof GitHubError);
        assert.equal(e.status, 200);
        return true;
    });
});

test('asyncFetchProjectsV2ByViewer は、viewer が入っていないときは [] を返す (送らない)', async ()=> {
    const sogh = new Sogh();
    const fake = fakeFetch([]);

    assert.deepEqual(await withFetch(fake, ()=> sogh.asyncFetchProjectsV2ByViewer()), []);
    assert.equal(fake.requests.length, 0);
});

/* ****************************************************************
 * コールバック
 * **************************************************************** */

// 呼ばれたコールバックを、名前と引数で覚える。
function recorder () {
    const calls = [];
    const callbacks = {};

    for (const name of ['start', 'fetched', 'successed', 'failed'])
        callbacks[name] = (...args)=> calls.push([name, args]);

    return { calls, callbacks };
}

test('asyncFetchProjectsV2ByTeam: 失敗したら、failed(error, それまでの id) を呼んでから投げる。successed は呼ばない', async ()=> {
    const sogh = new Sogh();
    const { calls, callbacks } = recorder();

    const first = { json: { data: { node: { projectsV2: {
        edges: [{ node: { __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1 } }],
        pageInfo: { endCursor: 'C1', hasNextPage: true },
    } } } } };

    let thrown = null;

    await assert.rejects(withFetch(fakeFetch([first, GRAPHQL_ERROR]), ()=> sogh.asyncFetchProjectsV2ByTeam('T_1', callbacks)), (e)=> {
        thrown = e;
        return true;
    });

    assert.deepEqual(calls.map(c=> c[0]), ['start', 'fetched', 'failed']);
    assert.equal(calls[2][1][0], thrown);
    assert.deepEqual(calls[2][1][1], ['PVT_1']);
});

test('asyncFetchProjectsV2ByTeam: 成功したら、start・fetched・successed(id の配列) を呼び、id の配列を返す', async ()=> {
    const sogh = new Sogh();
    const { calls, callbacks } = recorder();

    const only = { json: { data: { node: { projectsV2: {
        edges: [{ node: { __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1 } }],
        pageInfo: { endCursor: 'C1', hasNextPage: false },
    } } } } };

    const ids = await withFetch(fakeFetch([only]), ()=> sogh.asyncFetchProjectsV2ByTeam('T_1', callbacks));

    assert.deepEqual(ids, ['PVT_1']);
    assert.deepEqual(calls, [
        ['start', []],
        ['fetched', [['PVT_1'], ['PVT_1']]],
        ['successed', [['PVT_1']]],
    ]);
});

test('asyncFetchProjectV2ByUserLoginProjectV2Number・ByOrg〜: 失敗したら、failed(error, login, number) を呼んでから投げる', async ()=> {
    for (const method of ['asyncFetchProjectV2ByUserLoginProjectV2Number', 'asyncFetchProjectV2ByOrgLoginProjectV2Number']) {
        const sogh = new Sogh();
        const { calls, callbacks } = recorder();

        let thrown = null;

        await assert.rejects(withFetch(fakeFetch([GRAPHQL_ERROR]), ()=> sogh[method]('octocat', '3', callbacks)), (e)=> {
            thrown = e;
            return true;
        });

        const failed = calls.find(c=> c[0] === 'failed');

        assert.ok(failed, method);
        assert.deepEqual(failed[1], [thrown, 'octocat', '3'], method);
        assert.equal(calls.some(c=> c[0] === 'successed'), false, method);
    }
});

/* ****************************************************************
 * コメントの追加・更新・削除 (書き込み)
 *   取り出す所は、クエリのファイルの pick を使う。(yanqirenshi/SOGH.next#65)
 *   失敗しても、例外は投げず、failed を呼ぶ。(前と同じ)
 * **************************************************************** */

// successed か failed が呼ばれるまで待つ。(コメントのメソッドは、終わりを待たずに戻るため)
function untilDone (run) {
    return new Promise((resolve)=> {
        const calls = [];
        const callbacks = {};

        for (const name of ['start', 'successed', 'failed'])
            callbacks[name] = (...args)=> {
                calls.push([name, args]);

                if (name !== 'start')
                    resolve(calls);
            };

        run(callbacks);
    });
}

const COMMENT_NODE = { __typename: 'IssueComment', id: 'IC_1', body: 'hello', updatedAt: '2026-11-01T09:00:00Z' };

test('createIssueComment・updateIssueComment: 応答から pick で取り出したコメントの id を、successed に渡す', async ()=> {
    const cases = [
        ['createIssueComment', { addComment: { commentEdge: { node: COMMENT_NODE } } }],
        ['updateIssueComment', { updateIssueComment: { issueComment: COMMENT_NODE } }],
    ];

    for (const [method, data] of cases) {
        const sogh = new Sogh();
        const fake = fakeFetch([{ json: { data } }]);

        const calls = await untilDone((callbacks)=> withFetch(fake, async ()=> sogh[method]('X_1', 'hello', callbacks)));

        assert.deepEqual(calls.map(c=> c[0]), ['start', 'successed'], method);
        assert.deepEqual(calls[1][1], ['IC_1', 'X_1', 'hello'], method);
        assert.equal(sogh.issueComment('IC_1').id(), 'IC_1', method);
        assert.deepEqual(fake.requests[0].variables, { id: 'X_1', body: 'hello' }, method);
    }
});

test('deleteIssueComment: 成功したら successed(id) を呼ぶ', async ()=> {
    const sogh = new Sogh();
    const fake = fakeFetch([{ json: { data: { deleteIssueComment: { clientMutationId: null } } } }]);

    const calls = await untilDone((callbacks)=> withFetch(fake, async ()=> sogh.deleteIssueComment('IC_1', callbacks)));

    assert.deepEqual(calls.map(c=> c[0]), ['start', 'successed']);
    assert.deepEqual(calls[1][1], ['IC_1']);
    assert.deepEqual(fake.requests[0].variables, { id: 'IC_1' });
});

test('コメントの 3 つ: GraphQL のエラーのときは、例外を投げず、failed を呼ぶ', async ()=> {
    const cases = [
        ['createIssueComment', ['X_1', 'hello']],
        ['updateIssueComment', ['IC_1', 'hello']],
        ['deleteIssueComment', ['IC_1']],
    ];

    for (const [method, args] of cases) {
        const sogh = new Sogh();
        const fake = fakeFetch([GRAPHQL_ERROR]);

        const calls = await untilDone((callbacks)=> withFetch(fake, async ()=> sogh[method](...args, callbacks)));

        assert.deepEqual(calls.map(c=> c[0]), ['start', 'failed'], method);
        assert.equal(calls[1][1][0].type, 'error', method);
        assert.deepEqual(calls[1][1].slice(1), args, method);
    }
});
