// ProjectV2 の README の属性と、Issue の本文の注釈のテスト。
//   - README に書いていない属性は、初めの値を残す。(null で上書きしない。yanqirenshi/SOGH.next#90)
//   - plan()・result() の動きは、変わらない。
//   - Issue の本文の注釈は、parseBody(issue) が読む。(addAnotetionValueNew から名前を変えた。yanqirenshi/SOGH.next#91)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。

import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';

const T1 = '2026-11-01T09:00:00Z';
const T2 = '2026-11-02T09:00:00Z';

const README_FULL = [
    '$Priority: h',
    '$Owner: alice',
    '$Type: dev',
    '$Release: v1',
    '$Plan: 2026-11-01 2026-11-30',
    '$Result: 2026-11-02 2026-11-29',
    '$Action: review',
    '$Backlog: B-1',
    '$Customer: acme',
    '$Agency: agent',
    '$Systems: sogh',
    '$Scenario: S-1',
    '$Progress: 40',
].join('\n');

// README に書いていないときの、初めの値。
const INITIAL = {
    priority:    '?',
    readmeOwner: '?',
    type:        '?',
    release:     '?',
    action:      '',
    backlog:     '',
    customer:    '',
    agency:      '',
    scenario:    '',
    progress:    '',
};

const project = (readme, t=T1)=> ({ __typename: 'ProjectV2', id: 'PVT_1', number: 1, readme, updatedAt: t });

/* ****************************************************************
 * README に書いていない属性 (yanqirenshi/SOGH.next#90)
 * **************************************************************** */

test('README に書いていない属性は、初めの値を返す (null ではない)', ()=> {
    for (const readme of ['', '説明だけ', undefined]) {
        const sogh = new Sogh();

        const p = sogh.node2projectV2(project(readme));

        for (const [name, value] of Object.entries(INITIAL))
            assert.equal(p[name](), value, `${name} (readme: ${JSON.stringify(readme)})`);

        assert.deepEqual(p.systems(), []);
    }
});

test('README に書いてある属性は、書いてある値を返す', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project(README_FULL));

    assert.equal(p.priority(), 'h');
    assert.equal(p.readmeOwner(), 'alice');
    assert.equal(p.type(), 'dev');
    assert.equal(p.release(), 'v1');
    assert.equal(p.action(), 'review');
    assert.equal(p.backlog(), 'B-1');
    assert.equal(p.customer(), 'acme');
    assert.equal(p.agency(), 'agent');
    assert.equal(p.systems(), 'sogh'); // 書いてあるときは、文字列のまま。(前と同じ)
    assert.equal(p.scenario(), 'S-1');
    assert.equal(p.progress(), '40');
});

test('一部だけ書いてあるときは、書いてある属性だけが変わる', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project('$Priority: s\n$Release: v2'));

    assert.equal(p.priority(), 's');
    assert.equal(p.release(), 'v2');
    assert.equal(p.readmeOwner(), '?');
    assert.equal(p.type(), '?');
    assert.equal(p.action(), '');
    assert.deepEqual(p.systems(), []);
});

test('priorityData() は、README に $Priority が無いとき、表の「?」(なぞ) を返す', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project(''));

    assert.deepEqual(p.priorityData(), { code: '?', label: 'なぞ', label_short: '謎' });
});

test('取り直しで README から属性が消えたら、初めの値に戻る', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project(README_FULL, T1));

    assert.equal(p.priority(), 'h');

    sogh.node2projectV2(project('$Type: ops', T2));

    assert.equal(p.type(), 'ops');

    for (const [name, value] of Object.entries(INITIAL)) {
        if (name === 'type')
            continue;

        assert.equal(p[name](), value, name);
    }

    assert.deepEqual(p.systems(), []);
    assert.deepEqual({ ...p.plan() }, { start: null, end: null });
    assert.deepEqual({ ...p.result() }, { start: null, end: null });
});

/* ****************************************************************
 * plan()・result() は、前と同じ
 * **************************************************************** */

test('plan()・result() は、README に書いてあれば、その期間', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project(README_FULL));

    assert.deepEqual({ ...p.plan() }, { start: '2026-11-01', end: '2026-11-30' });
    assert.deepEqual({ ...p.result() }, { start: '2026-11-02', end: '2026-11-29' });
});

test('result() は、終わりの日が無ければ、始めの日だけ', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project('$Result: 2026-11-02'));

    assert.deepEqual({ ...p.result() }, { start: '2026-11-02', end: null });
});

test('plan()・result() は、README に書いていなければ、start・end とも null', ()=> {
    const sogh = new Sogh();

    const p = sogh.node2projectV2(project(''));

    assert.deepEqual({ ...p.plan() }, { start: null, end: null });
    assert.deepEqual({ ...p.result() }, { start: null, end: null });
});

/* ****************************************************************
 * Issue の parseBody (yanqirenshi/SOGH.next#91)
 * **************************************************************** */

test('Issue の本文の注釈は parseBody(issue) が読む。addAnotetionValueNew は無い', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ __typename: 'Issue', id: 'I_1', body: '$Owner alice\n$Point.Plan 3', updatedAt: T1 });

    assert.equal(typeof issue.parseBody, 'function');
    assert.equal(typeof issue.addAnotetionValueNew, 'undefined');

    // constructor で読んだ値。
    assert.equal(issue.bodyOwner(), 'alice');
    assert.equal(issue.pointPlansTotal(), 3);

    // parseBody を直に呼んでも、同じように読み直し、渡したものを返す。
    const node = { body: '$Owner bob' };

    assert.equal(issue.parseBody(node), node);
    assert.equal(issue.bodyOwner(), 'bob');
});

test('Issue の本文を書き換える・core を入れ替えると、parseBody で読み直す', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ __typename: 'Issue', id: 'I_1', body: '$Owner alice', updatedAt: T1 });

    issue.body('$Owner bob');

    assert.equal(issue.bodyOwner(), 'bob');

    issue.core({ ...issue.core(), body: '$Owner carol' });

    assert.equal(issue.bodyOwner(), 'carol');
});
