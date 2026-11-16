// owner まわりの名前のテスト。
//   - Issue の owner() は、bodyOwner() にした。(本文の $Owner の値。yanqirenshi/SOGH.next#85)
//   - ProjectV2 の maneger() は、消した。README の $Owner は readmeOwner() で読む。(yanqirenshi/SOGH.next#86)
//   - Issue の addAnotetionValue(issue) は、消した。addAnotetionValueNew(issue) は残る。(yanqirenshi/SOGH.next#87)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import Sogh from '../src/js/Sogh.js';

const T1 = '2026-11-01T09:00:00Z';

/* ****************************************************************
 * Issue の bodyOwner() (yanqirenshi/SOGH.next#85)
 * **************************************************************** */

test('Issue の bodyOwner() は、本文の $Owner の値を返す', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2issue({ __typename: 'Issue', id: 'I_1', body: '本文\n$Owner: alice\n$Point.Plan 3', updatedAt: T1 });
    const b = sogh.node2issue({ __typename: 'Issue', id: 'I_2', body: '$owner bob', updatedAt: T1 });

    assert.equal(a.bodyOwner(), 'alice');
    assert.equal(b.bodyOwner(), 'bob');
});

test('Issue の bodyOwner() は、本文に $Owner が無いとき・本文を取っていないときは null', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2issue({ __typename: 'Issue', id: 'I_1', body: '$Point.Plan 3', updatedAt: T1 });
    const b = sogh.node2issue({ __typename: 'Issue', id: 'I_2', number: 2, updatedAt: T1 });

    assert.equal(a.bodyOwner(), null);
    assert.equal(b.bodyOwner(), null);
});

test('Issue に owner() は無い (GitHub の Issue には owner が無いので、代わりも無い)', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ __typename: 'Issue', id: 'I_1', body: '$Owner alice', updatedAt: T1 });

    assert.equal(typeof issue.owner, 'undefined');

    // 本文から読む、ほかの値の名前は、変わらない。
    for (const name of ['points', 'dueDate', 'nextActionDate', 'getOwnerFromBody'])
        assert.equal(typeof issue[name], 'function', name);
});

/* ****************************************************************
 * Issue の addAnotetionValue (yanqirenshi/SOGH.next#87)
 * **************************************************************** */

test('Issue の addAnotetionValue(issue) は無い。addAnotetionValueNew(issue) は残る', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ __typename: 'Issue', id: 'I_1', updatedAt: T1 });

    assert.equal(typeof issue.addAnotetionValue, 'undefined');
    assert.equal(typeof issue.addAnotetionValueNew, 'function');
});

/* ****************************************************************
 * ProjectV2 の maneger() (yanqirenshi/SOGH.next#86)
 * **************************************************************** */

test('ProjectV2 の maneger() は無い。README の $Owner は readmeOwner() で読む', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', readme: '$Owner: alice', updatedAt: T1 });

    assert.equal(typeof project.maneger, 'undefined');
    assert.equal(project.readmeOwner(), 'alice');
});

test('ProjectsV2 の表の Owner の列は、readmeOwner() を読む', ()=> {
    // 部品は JSX なので、Node では読めない。ファイルの中身で確かめる。
    const src = fs.readFileSync(new URL('../src/components/ProjectsV2.js', import.meta.url), 'utf8');

    assert.match(src, /code: 'owner',[\s\S]*?project\.readmeOwner\(\)/);
    assert.equal(src.includes('maneger'), false);
});
