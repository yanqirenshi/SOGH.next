// 0.5.0 の片付けのテスト。
//   - Pool の remove(id)・clear()。deleteIssueComment は、成功したら Pool からも消す。(yanqirenshi/SOGH.next#69)
//   - Loader の fetchX も、endpoint() に送る。(yanqirenshi/SOGH.next#76)
//   - 古い文書 2 つ・Projects (classic) のモデル 3 つ・Issue の classic 用のメソッド 6 個・
//     Issue を作るための部品 5 個・Loader の fetch は、無い。(yanqirenshi/SOGH.next#77・#81・#82・#83・#84)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの fetch (test/fake-fetch.mjs) を使う。

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import Sogh from '../src/js/Sogh.js';
import * as model from '../src/js/models/index.js';
import { fakeFetch, withFetch } from './fake-fetch.mjs';

const T1 = '2026-11-01T09:00:00Z';

/* ****************************************************************
 * Pool の remove・clear (yanqirenshi/SOGH.next#69)
 * **************************************************************** */

test('pool.remove(id) は、表と一覧の両方から消し、消したモデルを返す', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2label({ __typename: 'Label', id: 'L_1', name: 'a', updatedAt: T1 });
    const b = sogh.node2label({ __typename: 'Label', id: 'L_2', name: 'b', updatedAt: T1 });

    const pool = sogh.pool('label');

    assert.equal(pool.remove('L_1'), a);
    assert.equal(pool.get('L_1'), null);
    assert.equal('L_1' in pool.ht(), false);
    assert.deepEqual(pool.list(), [b]);
});

test('pool.remove(id) は、無い id のときは null を返し、何も変えない', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2label({ __typename: 'Label', id: 'L_1', name: 'a', updatedAt: T1 });

    const pool = sogh.pool('label');

    assert.equal(pool.remove('L_9'), null);
    assert.deepEqual(pool.list(), [a]);
    assert.equal(pool.get('L_1'), a);
});

test('pool.clear() は、すべて消す。消したあとも、また入れられる', ()=> {
    const sogh = new Sogh();

    sogh.node2label({ __typename: 'Label', id: 'L_1', name: 'a', updatedAt: T1 });
    sogh.node2label({ __typename: 'Label', id: 'L_2', name: 'b', updatedAt: T1 });

    const pool = sogh.pool('label');

    pool.clear();

    assert.deepEqual(pool.list(), []);
    assert.deepEqual(pool.ht(), {});

    const c = sogh.node2label({ __typename: 'Label', id: 'L_1', name: 'c', updatedAt: T1 });

    assert.deepEqual(pool.list(), [c]);
    assert.equal(c.name(), 'c');
});

test('Pool から消したモデルを指す関連は、null か、外れる', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({
        __typename: 'Issue', id: 'I_1', number: 1, updatedAt: T1,
        milestone: { __typename: 'Milestone', id: 'MS_1', title: 'm', updatedAt: T1 },
        labels: { nodes: [
            { __typename: 'Label', id: 'L_1', name: 'a', updatedAt: T1 },
            { __typename: 'Label', id: 'L_2', name: 'b', updatedAt: T1 },
        ] },
    });

    sogh.pool('milestone').remove('MS_1');
    sogh.pool('label').remove('L_1');

    assert.equal(issue.milestone(), null);
    assert.deepEqual(issue.labels(), [sogh.label('L_2')]);
});

test('deleteIssueComment は、成功したら、successed を呼ぶ前に、Pool からも消す', async ()=> {
    const sogh = new Sogh();

    sogh.node2issueComment({ __typename: 'IssueComment', id: 'IC_1', body: 'x', updatedAt: T1 });

    const fake = fakeFetch([{ json: { data: { deleteIssueComment: { clientMutationId: null } } } }]);

    const in_pool_at_successed = await new Promise((resolve, reject)=> {
        withFetch(fake, async ()=> sogh.deleteIssueComment('IC_1', {
            successed: ()=> resolve(sogh.issueComment('IC_1')),
            failed: (e)=> reject(e.data),
        }));
    });

    assert.equal(in_pool_at_successed, null);
    assert.equal(sogh.issueComment('IC_1'), null);
});

test('deleteIssueComment は、失敗したときは、Pool から消さない', async ()=> {
    const sogh = new Sogh();

    const comment = sogh.node2issueComment({ __typename: 'IssueComment', id: 'IC_1', body: 'x', updatedAt: T1 });

    const fake = fakeFetch([{ json: { data: null, errors: [{ type: 'FORBIDDEN', message: 'no' }] } }]);

    await new Promise((resolve)=> {
        withFetch(fake, async ()=> sogh.deleteIssueComment('IC_1', { successed: resolve, failed: resolve }));
    });

    assert.equal(sogh.issueComment('IC_1'), comment);
});

/* ****************************************************************
 * Loader の fetchX は endpoint() に送る (yanqirenshi/SOGH.next#76)
 * **************************************************************** */

test('fetchX は、endpoint() の URL に送る', async ()=> {
    const sogh = new Sogh();

    sogh._endpoint = 'https://example.test/graphql';

    const urls = [];
    const fake = {
        fetch: async (url)=> {
            urls.push(url);
            return { ok: true, status: 200, json: async ()=> ({ data: { viewer: null } }) };
        },
    };

    await withFetch(fake, ()=> sogh.fetchX('query { viewer { login } }'));

    assert.deepEqual(urls, ['https://example.test/graphql']);
});

/* ****************************************************************
 * 消したもの
 * **************************************************************** */

test('古い文書 2 つ (src/js/README.md・src/js/models/README.markdown) は無い (yanqirenshi/SOGH.next#77)', ()=> {
    for (const file of ['src/js/README.md', 'src/js/models/README.markdown'])
        assert.equal(fs.existsSync(new URL(`../${file}`, import.meta.url)), false, file);
});

test('Projects (classic) のモデル (Project・Card・Column) は、ファイルも models も無い (yanqirenshi/SOGH.next#81)', ()=> {
    for (const name of ['Project', 'Card', 'Column']) {
        assert.equal(name in model, false, name);
        assert.equal(fs.existsSync(new URL(`../src/js/models/${name}.js`, import.meta.url)), false, name);
    }
});

test('Issue の Projects (classic) 用のメソッド 6 個と、Issue を作るための部品 3 個は無い。milestoneId() は残る (yanqirenshi/SOGH.next#82・#83)', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({
        __typename: 'Issue', id: 'I_1', number: 1, updatedAt: T1,
        milestone: { __typename: 'Milestone', id: 'MS_1', title: 'm', updatedAt: T1 },
    });

    const removed = [
        'projectCards', 'getColumnFirst', 'getFirstColumnProject', 'getFirstColumnProjectID', 'projects', 'projectIds',
        'makeIssueData', 'issueData2requestDataDescription', 'issueData2requestData',
    ];

    for (const name of removed)
        assert.equal(typeof issue[name], 'undefined', name);

    assert.equal(issue.milestoneId(), 'MS_1');
});

test('Issue.js は、moment を import しない (Issue を作るための部品を消したので)', ()=> {
    const src = fs.readFileSync(new URL('../src/js/models/Issue.js', import.meta.url), 'utf8');

    assert.equal(/from 'moment'/.test(src), false);
});

test('Loader の fetch(query, success, error)・makeGraphQLData(data)・makeGraphQLDataItem(v) は無い (yanqirenshi/SOGH.next#83・#84)', ()=> {
    const sogh = new Sogh();

    for (const name of ['fetch', 'makeGraphQLData', 'makeGraphQLDataItem'])
        assert.equal(typeof sogh[name], 'undefined', name);
});
