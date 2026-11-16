// ProjectV2 の一覧の表 (src/components/ProjectsV2.js) の、既定の列のテスト。
//   - Plan・Result の Start・End の列は、plan()・result() の日付を出す。(yanqirenshi/SOGH.next#94)
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換し、import (React・MUI・ほかの部品) は空のものに差し替えて読む。
// 列の val は、文字列か null を返すものだけを呼ぶ。(JSX を返す列は呼ばない)

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

import Sogh from '../src/js/Sogh.js';

const T1 = '2026-11-01T09:00:00Z';

const STUB = 'data:text/javascript,export default {}';

async function loadColumns () {
    const src = fs.readFileSync(new URL('../src/components/ProjectsV2.js', import.meta.url), 'utf8');

    const { code } = transformSync(src, {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-react'],
    });

    const replaced = code.replace(/from\s+'[^']+'/g, `from '${STUB}'`) + '\nexport { COLUMNS as __COLUMNS };\n';

    const mod = await import('data:text/javascript;base64,' + Buffer.from(replaced).toString('base64'));

    return mod.__COLUMNS;
}

const COLUMNS = await loadColumns();

const column = (code)=> {
    const c = COLUMNS.find(c=> c.code === code);

    assert.ok(c, code);

    return c;
};

const PERIODS = [
    ['plan.start',   'Plan',   'Start'],
    ['plan.end',     'Plan',   'End'],
    ['result.start', 'Result', 'Start'],
    ['result.end',   'Result', 'End'],
];

test('期間の 4 つの列の code・グループ・見出しは、変わらない', ()=> {
    for (const [code, group, label] of PERIODS) {
        const c = column(code);

        assert.equal(c.group, group, code);
        assert.equal(c.label, label, code);
    }
});

test('Plan・Result の Start・End の列は、plan()・result() の日付をそのまま出す', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1,
        readme: '$Plan: 2026-11-01 2026-11-30\n$Result: 2026-11-02 2026-11-29',
    });

    assert.equal(column('plan.start').val(column('plan.start'), project, {}), '2026-11-01');
    assert.equal(column('plan.end').val(column('plan.end'), project, {}), '2026-11-30');
    assert.equal(column('result.start').val(column('result.start'), project, {}), '2026-11-02');
    assert.equal(column('result.end').val(column('result.end'), project, {}), '2026-11-29');
});

test('README に書いていないときは、空 (null)', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1, readme: '' });

    for (const [code] of PERIODS)
        assert.equal(column(code).val(column(code), a, {}), null, code);

    // $Result に終わりの日が無いときは、Result・End だけが空。
    const b = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_2', updatedAt: T1, readme: '$Result: 2026-11-02' });

    assert.equal(column('result.start').val(column('result.start'), b, {}), '2026-11-02');
    assert.equal(column('result.end').val(column('result.end'), b, {}), null);
});

test('plan()・result() が期間でないもの (null など) を返しても、落ちずに空になる', ()=> {
    const fake = { plan: ()=> null, result: ()=> undefined };

    for (const [code] of PERIODS)
        assert.equal(column(code).val(column(code), fake, {}), null, code);
});
