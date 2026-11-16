// クエリ (src/js/queries/) の形のテスト。
//   - どのクエリも { query, pick } で、値は variables で渡す。(yanqirenshi/SOGH.next#63・#65)
//   - ProjectV2Item の content の PullRequest は、state を別名で取る。(yanqirenshi/SOGH.next#68)
//   - クエリの名前のつづり。(yanqirenshi/SOGH.next#73)
//   - 項目の部品の名前と、返す形。(yanqirenshi/SOGH.next#74)
//   - 入れ子の件数の上限は、1 か所。(yanqirenshi/SOGH.next#75)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import Sogh from '../src/js/Sogh.js';
import * as queries from '../src/js/queries/index.js';
import * as attr from '../src/js/queries/attributes.js';

const QUERY_DIR = new URL('../src/js/queries/', import.meta.url);

const queryFiles = ()=> fs.readdirSync(QUERY_DIR)
      .filter(f=> f.endsWith('.js') && f !== 'attributes.js' && f !== 'index.js');

/* ****************************************************************
 * 形
 * **************************************************************** */

test('どのクエリも { query, pick } で、query は query か mutation で始まる', ()=> {
    for (const [code, definition] of Object.entries(queries)) {
        assert.equal(typeof definition.query, 'string', code);
        assert.equal(typeof definition.pick, 'function', code);
        assert.match(definition.query, /^(query|mutation)\b/, code);
    }
});

test('クエリに、値の印 (@id・@login・@user-login など) と、ページ送りの印 (after: "") が残っていない', ()=> {
    for (const [code, definition] of Object.entries(queries)) {
        assert.equal(/@[a-z]/.test(definition.query), false, code);
        assert.equal(definition.query.includes('after: ""'), false, code);
    }
});

test('クエリで使う変数は、どれも、頭で宣言している。ページ送りするクエリは、$after: String を宣言している', ()=> {
    for (const [code, { query }] of Object.entries(queries)) {
        const head = /^(?:query|mutation)\s*(?:\(([^)]*)\))?/.exec(query);
        const declared = new Set([...(head[1] || '').matchAll(/\$(\w+)\s*:/g)].map(m=> m[1]));
        const body = query.slice(head[0].length);
        const used = new Set([...body.matchAll(/\$(\w+)/g)].map(m=> m[1]));

        assert.deepEqual([...used].sort(), [...declared].sort(), code);

        if (body.includes('pageInfo'))
            assert.ok(declared.has('after'), code);
    }
});

test('sogh.query(code) はクエリの文字列を、sogh.queryDefinition(code) は { query, pick } を返す', ()=> {
    const sogh = new Sogh();

    assert.equal(sogh.query('issue_by_id'), queries.issue_by_id.query);
    assert.equal(sogh.queryDefinition('issue_by_id'), queries.issue_by_id);
    assert.deepEqual(queries.issue_by_id.pick({ node: { id: 'I_1' } }), { id: 'I_1' });

    assert.equal(sogh.query('no_such_query'), undefined);
    assert.equal(sogh.queryDefinition('no_such_query'), null);
});

/* ****************************************************************
 * 名前のつづり (yanqirenshi/SOGH.next#73)
 * **************************************************************** */

test('クエリの名前は viewer・issues_by_viewer。(viwer・issues_by_viwer は無い)', ()=> {
    assert.ok('viewer' in queries);
    assert.ok('issues_by_viewer' in queries);
    assert.equal('viwer' in queries, false);
    assert.equal('issues_by_viwer' in queries, false);

    for (const file of fs.readdirSync(QUERY_DIR))
        assert.equal(file.includes('viwer'), false, file);
});

/* ****************************************************************
 * 項目の部品 (yanqirenshi/SOGH.next#74)
 * **************************************************************** */

test('項目の部品の名前は、小文字で始まり、途中が大文字。(_ を使わない)', ()=> {
    for (const name of Object.keys(attr)) {
        if (name === 'NESTED_LIMIT')
            continue;

        assert.match(name, /^[a-z][A-Za-z0-9]*$/, name);
    }
});

test('項目の部品は、項目だけを返す。({ } で囲んで返さない)', ()=> {
    for (const [name, fn] of Object.entries(attr)) {
        if (typeof fn !== 'function')
            continue;

        const text = fn().trim();

        assert.equal(text.startsWith('{'), false, name);
        assert.equal(text.endsWith('}') && /^\{[\s\S]*\}$/.test(text), false, name);
    }
});

/* ****************************************************************
 * 入れ子の件数の上限 (yanqirenshi/SOGH.next#75)
 * **************************************************************** */

test('入れ子の件数の上限は、attributes.js の NESTED_LIMIT (30) の 1 か所で決める', ()=> {
    assert.equal(attr.NESTED_LIMIT, 30);

    // クエリのファイルは、上限の定数を宣言しない。
    for (const file of queryFiles()) {
        const text = fs.readFileSync(new URL(file, QUERY_DIR), 'utf8');

        assert.equal(/MAX_[A-Z_]+_NUM/.test(text), false, file);
    }

    // fieldValues と、その中の labels・pullRequests は、どのクエリも 30 件。
    for (const [code, { query }] of Object.entries(queries)) {
        for (const m of query.matchAll(/\b(fieldValues|labels|pullRequests)\(first: (\d+)\)/g)) {
            if (m[1] === 'labels' && !/ProjectV2ItemFieldLabelValue/.test(query.slice(Math.max(0, m.index - 400), m.index)))
                continue; // Issue の labels (first: 10) は、入れ子の上限の対象ではない。

            assert.equal(Number(m[2]), 30, `${code} の ${m[1]}`);
        }
    }
});

test('チームの ProjectV2 を Item 付きで取るクエリは、ProjectV2 が 10 個・Item が 50 個のまま', ()=> {
    const { query } = queries.projectsv2_with_items_by_team;

    assert.match(query, /projectsV2\(after: \$after, first: 10, query: "is:open"\)/);
    assert.match(query, /items\(first: 50\)/);
});

/* ****************************************************************
 * PullRequest の state の別名 (yanqirenshi/SOGH.next#68)
 * **************************************************************** */

test('ProjectV2Item の content の PullRequest は、state を pullRequestState の別名で取る', ()=> {
    let count = 0;

    for (const [code, { query }] of Object.entries(queries)) {
        if (!query.includes('content {'))
            continue;

        count++;

        assert.match(query, /\.\.\. on PullRequest \{[^}]*pullRequestState: state/, code);
    }

    assert.ok(count >= 5, `content を取るクエリ: ${count} 個`);
});

test('別名 pullRequestState で来た PullRequest は、Pool に入れる前に state に戻す', ()=> {
    const sogh = new Sogh();

    const T1 = '2026-11-01T09:00:00Z';

    sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1,
        content: { __typename: 'PullRequest', id: 'PR_1', number: 1, pullRequestState: 'MERGED', updatedAt: T1 },
    });

    const core = sogh.pullRequest('PR_1').core();

    assert.equal(core.state, 'MERGED');
    assert.equal('pullRequestState' in core, false);

    // 別名の無い PullRequest は、そのまま。
    sogh.node2pullRequest({ __typename: 'PullRequest', id: 'PR_2', state: 'OPEN', updatedAt: T1 });

    assert.equal(sogh.pullRequest('PR_2').core().state, 'OPEN');
});

test('ProjectV2Item の core に残る content でも、PullRequest の state は state の名前になる', ()=> {
    const sogh = new Sogh();

    const T1 = '2026-11-01T09:00:00Z';

    const node = {
        __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1,
        content: { __typename: 'PullRequest', id: 'PR_1', number: 1, pullRequestState: 'MERGED', updatedAt: T1 },
    };

    const content = sogh.node2projectV2Item(node).core().content;

    assert.equal(content.state, 'MERGED');
    assert.equal('pullRequestState' in content, false);

    // 渡した node は、変えない。
    assert.equal(node.content.pullRequestState, 'MERGED');
    assert.equal('state' in node.content, false);

    // ProjectV2 の items から来た Item も、同じ。
    sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1,
        items: { nodes: [ {
            __typename: 'ProjectV2Item', id: 'PVTI_2', updatedAt: T1,
            content: { __typename: 'PullRequest', id: 'PR_2', number: 2, pullRequestState: 'OPEN', updatedAt: T1 },
        } ] },
    });

    const content2 = sogh.projectV2Item('PVTI_2').core().content;

    assert.equal(content2.state, 'OPEN');
    assert.equal('pullRequestState' in content2, false);
    assert.equal(sogh.pullRequest('PR_2').core().state, 'OPEN');

    // Issue の content は、そのまま。
    const issueItem = sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_3', updatedAt: T1,
        content: { __typename: 'Issue', id: 'I_1', number: 3, state: 'CLOSED', updatedAt: T1 },
    });

    assert.equal(issueItem.core().content.state, 'CLOSED');
});
