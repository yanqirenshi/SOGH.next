// Sogh が持っている取得のメソッドのテスト。(yanqirenshi/SOGH.next#62)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。Sogh のメソッドの名前だけを見る。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import * as queries from '../src/js/queries/index.js';

// Sogh (と、継承の元の Pooler・Loader) が持っているメソッドの名前。
function methodNames (obj) {
    const names = new Set();

    for (let proto = Object.getPrototypeOf(obj); proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto))
        for (const name of Object.getOwnPropertyNames(proto))
            if (name !== 'constructor' && typeof proto[name] === 'function')
                names.add(name);

    return names;
}

const ASYNC_FETCHES = [
    'asyncFetchViewer',
    'asyncFetchRepositoriesByViewer',
    'asyncFetchIssueByID',
    'asyncFetchIssueByViewer',
    'asyncFetchIssueByOrgRepoIssueNumber',
    'asyncFetchIssueCommentsByID',
    'asyncFetchIssueCommentsByOrgRepoIssueNumber',
    'asyncFetchProjectsV2ByViewer',
    'asyncFetchProjectsV2ByTeam',
    'asyncFetchProjectsV2WithItemsByTeam',
    'asyncFetchProjectV2ByUserLoginProjectV2Number',
    'asyncFetchProjectV2ByOrgLoginProjectV2Number',
    'asyncFetchProjectV2ItemsByUserLoginProjectV2Number',
    'asyncFetchProjectV2ItemsByOrgLoginProjectV2Number',
    'asyncFetchProjectV2ItemByID',
    'asyncFetchItemByID',
];

test('古い世代の fetch〜 (8 個) と、それだけが使っていた補助のメソッドは、無い', ()=> {
    const names = methodNames(new Sogh());

    const removed = [
        'fetchRepositoriesByViewer',
        'fetchUserByID',
        'fetchProjectsV2ByUser',
        'fetchProjectsV2ByID',
        'fetchProjectV2ItemsByProjectNext',
        'fetchProjectNextItemByID',
        'fetchIssueByID',
        'fetchIssueCommentsByIssueID',
        'data2data',
        'zzz',
        'ensureEndCursor',
    ];

    for (const name of removed)
        assert.equal(names.has(name), false, name);
});

test('取得のメソッドは、asyncFetch〜 の 16 個 (と、Loader の fetch・fetchX)', ()=> {
    const names = methodNames(new Sogh());

    const fetches = [...names].filter(name=> /^(async)?[Ff]etch/.test(name)).sort();

    assert.deepEqual(fetches, [...ASYNC_FETCHES, 'fetch', 'fetchX'].sort());
});

test('接続とコメントの追加・更新・削除のメソッドは、残っている', ()=> {
    const names = methodNames(new Sogh());

    for (const name of ['connect', 'createIssueComment', 'updateIssueComment', 'deleteIssueComment', 'node2objs', 'makeQuery'])
        assert.ok(names.has(name), name);
});

test('クエリ projects_next_items_by_id は無い。fetch〜 だけが使っていたほかの 3 つは、残っている', ()=> {
    assert.equal('projects_next_items_by_id' in queries, false);

    for (const code of ['user_by_id', 'projects_next_by_id', 'projectsv2_items_by_projects_v2'])
        assert.ok(code in queries, code);
});
