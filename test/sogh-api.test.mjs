// Sogh が持っている取得のメソッドのテスト。(yanqirenshi/SOGH.next#62)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。Sogh のメソッドの名前だけを見る。
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

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

test('Sogh のメソッドから使われていないクエリは、無い (yanqirenshi/SOGH.next#66)', ()=> {
    // 0.5.0 で消したクエリ。
    const removed = [
        'projects_next_items_by_id',
        'assignees_by_repository', 'create_issue', 'issues_by_milestone', 'issues_by_report_label',
        'issues_by_repository', 'issues_open_by_label', 'issues_open_by_project_column', 'issues_open_by_repository',
        'labels_by_repository', 'milestones_by_repository', 'project_by_id', 'projects_by_repository',
        'repository', 'search_issues', 'update_issue_body',
        'user_by_id', 'projects_next_by_id', 'projectsv2_items_by_projects_v2',
    ];

    for (const code of removed)
        assert.equal(code in queries, false, code);

    // 残ったクエリは 18 個で、どれも Sogh.js の this.query('…') から使われている。
    const source = fs.readFileSync(new URL('../src/js/Sogh.js', import.meta.url), 'utf8');
    const used = new Set([...source.matchAll(/this\.query\('([a-z0-9_]+)'\)/g)].map(m=> m[1]));

    assert.equal(Object.keys(queries).length, 18);
    assert.deepEqual(Object.keys(queries).sort(), [...used].sort());

    // query(code) は、残ったクエリを返し、消したクエリは返さない。
    const sogh = new Sogh();

    for (const code of Object.keys(queries))
        assert.equal(typeof sogh.query(code), 'string', code);

    for (const code of removed)
        assert.equal(sogh.query(code), undefined, code);
});
