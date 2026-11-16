// check-updated-at.mjs の、GitHub につながない部分 (scripts/updated-at.mjs) のテスト。(yanqirenshi/SOGH.next#51)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの応答から、スナップショットを作って比べる。
import test from 'node:test';
import assert from 'node:assert/strict';

import {
    parseTarget,
    toSnapshot,
    compareSnapshots,
    formatReport,
    describeSnapshot,
    describeGitHubErrors,
    ISSUE_QUERY,
    PROJECTS_QUERY,
} from '../scripts/updated-at.mjs';

const TARGET = 'octocat/hello-world#1';

const T1 = '2026-11-01T09:00:00Z';
const T2 = '2026-11-02T09:00:00Z';

// にせの応答を作る。(変えたいところだけ、上書きする)
function response (patch = {}) {
    const item = (id, project_id, status)=> ({
        id,
        updatedAt: T1,
        fieldValues: {
            totalCount: 2,
            nodes: [
                { __typename: 'ProjectV2ItemFieldTextValue', text: '題名', field: { name: 'Title' } },
                { __typename: 'ProjectV2ItemFieldSingleSelectValue', name: status, optionId: 'o1', field: { name: 'Status' } },
            ],
        },
        project: {
            id: project_id,
            updatedAt: T1,
            items: { totalCount: 1, nodes: [{ id }] },
        },
    });

    const issue = {
        updatedAt: T1,
        assignees: { nodes: [{ id: 'U_1' }] },
        labels: { nodes: [{ id: 'L_1' }] },
        milestone: { id: 'MS_1', updatedAt: T1 },
        comments: { totalCount: 2, nodes: [{ id: 'IC_1', updatedAt: T1 }, { id: 'IC_2', updatedAt: T1 }] },
        projectItems: { nodes: [item('PVTI_1', 'PVT_1', 'Todo')] },
        ...patch.issue,
    };

    return { repository: { updatedAt: T1, ...patch.repository, issue } };
}

const snap = (patch, watched)=> toSnapshot(TARGET, response(patch), watched);

const rowOf = (result, label)=> result.rows.find(r=> r.label === label);

/* ****************************************************************
 * 対象の指定
 * **************************************************************** */

test('parseTarget: owner/repo#番号 を読む。形が違うときは null', ()=> {
    assert.deepEqual(parseTarget('octocat/hello-world#12'), { owner: 'octocat', name: 'hello-world', number: 12 });
    assert.deepEqual(parseTarget(' my-org/repo.name_1#3 '), { owner: 'my-org', name: 'repo.name_1', number: 3 });

    for (const text of [null, '', 'octocat/hello-world', 'octocat#1', 'octocat/hello-world#0', 'octocat/hello-world#x', 'a/b/c#1', '-x/repo#1'])
        assert.equal(parseTarget(text), null, String(text));
});

/* ****************************************************************
 * スナップショット
 * **************************************************************** */

test('スナップショットには、id そのものは入れない (ProjectV2 の id を除く)', ()=> {
    const s = snap();
    const text = JSON.stringify(s);

    for (const value of ['U_1', 'L_1', 'MS_1', 'IC_1', 'PVTI_1', TARGET])
        assert.equal(text.includes(value), false, value);

    // ProjectV2 の id は、次の回に読み直すために、watch にだけ入れる。
    assert.deepEqual(s.watch.projectIds, ['PVT_1']);
    assert.equal(Object.keys(s.items).length, 1);
    assert.equal(Object.keys(s.projects).length, 1);
    assert.equal(s.comments.totalCount, 2);
    assert.equal(s.comments.recent.length, 2);

    assert.match(describeSnapshot(s), /Item 1 件・ProjectV2 1 件・コメント \(新しい順\) 2 件・Milestone 1 件/);
});

test('同じ ProjectV2 に入った Item が 2 つあっても、ProjectV2 は 1 つとして覚える', ()=> {
    const base = response();
    const second = { ...base.repository.issue.projectItems.nodes[0], id: 'PVTI_2' };

    base.repository.issue.projectItems.nodes.push(second);

    const s = toSnapshot(TARGET, base);

    assert.equal(Object.keys(s.items).length, 2);
    assert.equal(Object.keys(s.projects).length, 1);
});

/* ****************************************************************
 * 比べる
 * **************************************************************** */

test('前の回が無いときは、比べない', ()=> {
    const result = compareSnapshots(null, snap());

    assert.deepEqual(result, { compared: false, reason: 'none' });
    assert.match(formatReport(result)[0], /覚えました/);
});

test('対象の Issue が前の回と違うときは、比べない', ()=> {
    const prev = toSnapshot('octocat/hello-world#2', response());
    const result = compareSnapshots(prev, snap());

    assert.deepEqual(result, { compared: false, reason: 'target' });
    assert.match(formatReport(result)[0], /前の回と違う/);
});

test('記録の形が違うときは、比べない', ()=> {
    const prev = { ...snap(), version: 0 };

    assert.deepEqual(compareSnapshots(prev, snap()), { compared: false, reason: 'version' });
});

test('何も変わらないときは、すべて「動かない」「変わらない」で、印は付かない', ()=> {
    const result = compareSnapshots(snap(), snap());

    assert.equal(result.compared, true);

    for (const label of ['Issue', 'Item 1', 'ProjectV2 1', 'Repository', 'Milestone', 'コメント 1', 'コメント 2']) {
        const r = rowOf(result, label);

        assert.ok(r, label);
        assert.equal(r.updatedAt, '動かない', label);
        assert.equal(r.alert, false, label);
    }

    assert.equal(rowOf(result, 'Issue').relations, '変わらない');
    assert.equal(rowOf(result, 'Repository').relations, '-');
    assert.ok(result.notes.includes('コメントの数は、変わらない。'));
    assert.match(formatReport(result).at(-1), /ありません/);
});

test('関連が変わって、updatedAt も動いたときは、印は付かない', ()=> {
    const prev = snap();
    const curr = snap({ issue: { updatedAt: T2, labels: { nodes: [{ id: 'L_1' }, { id: 'L_2' }] } } });

    const r = rowOf(compareSnapshots(prev, curr), 'Issue');

    assert.equal(r.updatedAt, '動いた');
    assert.equal(r.relations, '変わった (labels)');
    assert.equal(r.alert, false);
});

test('関連が変わったのに、updatedAt が動いていないときは、印を付ける', ()=> {
    const prev = snap();
    const curr = snap({ issue: { assignees: { nodes: [{ id: 'U_2' }] }, milestone: null } });

    const result = compareSnapshots(prev, curr);
    const r = rowOf(result, 'Issue');

    assert.equal(r.updatedAt, '動かない');
    assert.equal(r.relations, '変わった (assignees, milestone)');
    assert.equal(r.alert, true);

    const lines = formatReport(result);

    assert.ok(lines.some(line=> line.startsWith('Issue') && line.includes('← 関連が変わったのに、updatedAt が動いていない')));
    assert.match(lines.at(-1), /1 件/);
    assert.ok(result.notes.includes('Milestone が外れた。'));
});

test('Item の fieldValues が変わったのに、Item の updatedAt が動いていないときは、印を付ける', ()=> {
    const prev = snap();
    const curr = response();

    curr.repository.issue.projectItems.nodes[0].fieldValues.nodes[1].name = 'Done';

    const result = compareSnapshots(prev, toSnapshot(TARGET, curr));
    const r = rowOf(result, 'Item 1');

    assert.equal(r.relations, '変わった (fieldValues)');
    assert.equal(r.alert, true);
    assert.equal(rowOf(result, 'Issue').relations, '変わらない');
});

test('ProjectV2 の items が変わったら、ProjectV2 の行に出る', ()=> {
    const prev = snap();
    const curr = response();

    curr.repository.issue.projectItems.nodes[0].project.updatedAt = T2;
    curr.repository.issue.projectItems.nodes[0].project.items = { totalCount: 2, nodes: [{ id: 'PVTI_1' }, { id: 'PVTI_9' }] };

    const r = rowOf(compareSnapshots(prev, toSnapshot(TARGET, curr)), 'ProjectV2 1');

    assert.equal(r.updatedAt, '動いた');
    assert.equal(r.relations, '変わった (items)');
    assert.equal(r.alert, false);
});

test('コメントが増えた・減った、コメントの updatedAt が動いた', ()=> {
    const prev = snap();

    const added = compareSnapshots(prev, snap({
        issue: { comments: { totalCount: 3, nodes: [{ id: 'IC_1', updatedAt: T1 }, { id: 'IC_2', updatedAt: T1 }, { id: 'IC_3', updatedAt: T1 }] } },
    }));

    assert.ok(added.notes.includes('コメントが 1 件増えた。'));
    assert.equal(rowOf(added, 'Issue').relations, '変わった (comments)');

    const removed = compareSnapshots(prev, snap({
        issue: { comments: { totalCount: 1, nodes: [{ id: 'IC_1', updatedAt: T1 }] } },
    }));

    assert.ok(removed.notes.includes('コメントが 1 件減った。'));

    // 新しい順なので、IC_2 が「コメント 1」。
    const edited = compareSnapshots(prev, snap({
        issue: { comments: { totalCount: 2, nodes: [{ id: 'IC_1', updatedAt: T1 }, { id: 'IC_2', updatedAt: T2 }] } },
    }));

    assert.equal(rowOf(edited, 'コメント 1').updatedAt, '動いた');
    assert.equal(rowOf(edited, 'コメント 2').updatedAt, '動かない');
    assert.equal(rowOf(edited, 'Issue').relations, '変わらない');
});

test('Item と ProjectV2 が増えた・減ったことが分かる', ()=> {
    const prev = snap();

    const empty = snap({ issue: { projectItems: { nodes: [] } } });

    const removed = compareSnapshots(prev, empty);

    assert.ok(removed.notes.some(note=> note.startsWith('Item が 1 つ減った')));
    assert.ok(removed.notes.some(note=> note.startsWith('ProjectV2 が 1 つ減った')));
    assert.equal(rowOf(removed, 'Issue').relations, '変わった (projectItems)');

    const added = compareSnapshots(empty, prev);

    assert.ok(added.notes.includes('Item 1 が増えた。'));
    assert.ok(added.notes.includes('ProjectV2 1 が増えた。'));
});

test('Issue の Item から辿れなくなった ProjectV2 は、id で読み直したものと比べる', ()=> {
    const prev = snap();

    // Issue をプロジェクトから外した。ProjectV2 は、id で読み直した。(updatedAt は動いていない)
    const watched = [{ id: 'PVT_1', updatedAt: T1, items: { totalCount: 0, nodes: [] } }];
    const curr = snap({ issue: { projectItems: { nodes: [] } } }, watched);

    const result = compareSnapshots(prev, curr);
    const r = rowOf(result, 'ProjectV2 1 (外)');

    assert.ok(r);
    assert.equal(r.relations, '変わった (items)');
    assert.equal(r.alert, true);
    assert.ok(result.notes.some(note=> note.includes('辿れなくなった')));
    assert.equal(result.notes.some(note=> note.startsWith('ProjectV2 が 1 つ減った')), false);
    assert.deepEqual(curr.watch.projectIds, ['PVT_1']);
    assert.ok(formatReport(result).some(line=> line.startsWith('(外)')));
});

test('プロジェクトから外してから足し直すと、足したときの ProjectV2 も比べられる', ()=> {
    // 1. プロジェクトに入っている。
    const before = snap();

    // 2. プロジェクトから外した。ProjectV2 は、前の回に覚えた id で読み直した。
    const removed = snap({ issue: { projectItems: { nodes: [] } } }, [{ id: 'PVT_1', updatedAt: T1, items: { totalCount: 0, nodes: [] } }]);

    assert.deepEqual(removed.watch.projectIds, ['PVT_1'], '外した回も、ProjectV2 の id を覚えている');
    assert.ok(rowOf(compareSnapshots(before, removed), 'ProjectV2 1 (外)'));

    // 3. 足し直した。Issue の新しい Item から、同じ ProjectV2 に辿れる。
    const added = response();

    added.repository.issue.projectItems.nodes[0].id = 'PVTI_NEW';
    added.repository.issue.projectItems.nodes[0].project.updatedAt = T2;
    added.repository.issue.projectItems.nodes[0].project.items = { totalCount: 1, nodes: [{ id: 'PVTI_NEW' }] };

    const result = compareSnapshots(removed, toSnapshot(TARGET, added));
    const r = rowOf(result, 'ProjectV2 1');

    assert.ok(r, '足し直したときの ProjectV2 の行が出る');
    assert.equal(r.updatedAt, '動いた');
    assert.equal(r.relations, '変わった (items)');
    assert.ok(result.notes.includes('Item 1 が増えた。'));
    assert.equal(result.notes.some(note=> note.startsWith('ProjectV2 1 が増えた')), false, 'ProjectV2 は「増えた」ではなく、比べた行になる');
});

/* ****************************************************************
 * GitHub のエラー
 * **************************************************************** */

test('GitHub のエラー: type があるものは type だけを出し、message (対象の値) は出さない', ()=> {
    const errors = [
        { type: 'NOT_FOUND', message: "Could not resolve to a Repository with the name 'secret-owner/secret-repo'." },
        { type: 'FORBIDDEN', message: 'Resource not accessible: secret-owner/secret-repo#999999' },
        { type: 'FORBIDDEN', message: 'again secret-owner' },
    ];

    const r = describeGitHubErrors(errors);

    assert.equal(r.notFound, true);
    assert.equal(r.text, 'FORBIDDEN');
    assert.equal(/secret|999999/.test(r.text), false);
});

test('GitHub のエラー: NOT_FOUND だけのときは、notFound で、出す文は無い', ()=> {
    const r = describeGitHubErrors([{ type: 'NOT_FOUND', message: 'Could not resolve to an Issue with the number of 999999.' }]);

    assert.deepEqual(r, { notFound: true, text: '' });
});

test('GitHub のエラー: type が無いもの (クエリの誤り) は、message を出す', ()=> {
    const r = describeGitHubErrors([
        { message: "Field 'foo' doesn't exist on type 'Issue'" },
        { message: "Field 'foo' doesn't exist on type 'Issue'" },
    ]);

    assert.deepEqual(r, { notFound: false, text: "Field 'foo' doesn't exist on type 'Issue'" });
});

test('GitHub のエラー: type があるものと無いものが混ざったとき', ()=> {
    const r = describeGitHubErrors([
        { type: 'NOT_FOUND', message: "Could not resolve to a Repository with the name 'secret-owner/secret-repo'." },
        { type: 'RATE_LIMITED', message: 'secret-owner rate limit' },
        { message: 'Parse error on "}"' },
    ]);

    assert.equal(r.notFound, true);
    assert.equal(r.text, 'RATE_LIMITED / Parse error on "}"');
    assert.equal(r.text.includes('secret'), false);
});

test('GitHub のエラー: 無いとき・形が違うときも、落ちない', ()=> {
    assert.deepEqual(describeGitHubErrors(null), { notFound: false, text: '' });
    assert.deepEqual(describeGitHubErrors([null, {}]), { notFound: false, text: '(文の無いエラー)' });

    const many = describeGitHubErrors([1, 2, 3, 4, 5].map(i=> ({ message: `m${i}` })));

    assert.equal(many.text, 'm1 / m2 / m3 ほか 2 件');
});

test('Milestone が付いた・別の Milestone に変わった', ()=> {
    const none = snap({ issue: { milestone: null } });
    const ms1 = snap();
    const ms2 = snap({ issue: { milestone: { id: 'MS_2', updatedAt: T1 } } });

    assert.ok(compareSnapshots(none, ms1).notes.includes('Milestone が付いた。'));
    assert.ok(compareSnapshots(ms1, ms2).notes.includes('Milestone が、別の Milestone に変わった。'));
    assert.equal(rowOf(compareSnapshots(ms1, ms2), 'Milestone'), undefined);
});

test('表示には、取得した値そのものが出ない', ()=> {
    const prev = snap();
    const curr = snap({ issue: { updatedAt: T2, assignees: { nodes: [{ id: 'U_2' }] } } });

    const text = formatReport(compareSnapshots(prev, curr)).join('\n');

    for (const value of ['U_1', 'U_2', 'L_1', 'MS_1', 'IC_1', 'PVTI_1', 'PVT_1', T1, T2, '題名', 'Todo', TARGET])
        assert.equal(text.includes(value), false, value);
});

/* ****************************************************************
 * クエリ
 * **************************************************************** */

test('クエリは読むだけ (mutation ではない) で、値は variables で受け取る', ()=> {
    for (const query of [ISSUE_QUERY, PROJECTS_QUERY]) {
        assert.match(query, /^query \(/);
        assert.equal(/mutation/i.test(query), false);
    }

    assert.match(ISSUE_QUERY, /\$owner: String!, \$name: String!, \$number: Int!/);
    assert.match(PROJECTS_QUERY, /\$ids: \[ID!\]!/);
});
