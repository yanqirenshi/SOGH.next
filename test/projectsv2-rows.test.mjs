// ProjectV2 の一覧の表の、行の部品のテスト。
//   - 行の部品は、使っていなかった計算 (期間の中か・過ぎたか) をしない。「いまの日時」(now) も受け取らない。(yanqirenshi/SOGH.next#98)
//   - 行は、列ごとに val(column, project, actions, is_opened, onChange) を呼んで作る。(前と同じ)
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換して読む。
// React は、createElement が { type, props, children } を返すだけの偽物に、MUI などは名前だけの偽物に差し替える。

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

const DIR = new URL('../src/components/projectsV2/', import.meta.url);

const FILES = ['Table.js', 'TableBodyRow.js', 'TableBodyRowProject.js'];

const REACT_STUB = 'data:text/javascript,' + encodeURIComponent(
    'export default { createElement: (type, props, ...children)=> ({ type, props, children }), useState: (v)=> [v, ()=> {}], Fragment: "Fragment" };');

const NAME_STUB = (name)=> 'data:text/javascript,' + encodeURIComponent(`export default ${JSON.stringify(name)};`);

const source = (file)=> fs.readFileSync(new URL(file, DIR), 'utf8');

async function load (file) {
    const { code } = transformSync(source(file), {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-react'],
    });

    const replaced = code.replace(/import\s+(\w+)\s+from\s+'([^']+)'/g, (_all, name, from)=> {
        return `import ${name} from '${from === 'react' ? REACT_STUB : NAME_STUB(name)}'`;
    });

    return import('data:text/javascript;base64,' + Buffer.from(replaced).toString('base64'));
}

/* ****************************************************************
 * 消した名前
 * **************************************************************** */

test('3 つのファイルに、消した計算・now・moment が無い', ()=> {
    for (const file of FILES) {
        const src = source(file);

        for (const name of ['str2moments', 'str2moment', 'is_in_term', 'is_passed', 'moment', 'props.now', 'now={now}', 'const now'])
            assert.equal(src.includes(name), false, `${file}: ${name}`);
    }
});

test('projectsV2 の下に、props.now を読む所が無い', ()=> {
    for (const file of fs.readdirSync(DIR)) {
        if (!file.endsWith('.js'))
            continue;

        assert.equal(/\bprops\.now\b/.test(source(file)), false, file);
    }
});

/* ****************************************************************
 * 行の部品
 * **************************************************************** */

test('行の部品は、plan() を読まずに、列の val を呼んで行を作る', async ()=> {
    const { default: TableBodyRowProject } = await load('TableBodyRowProject.js');

    // plan() を読んだら、落ちるようにしておく。
    const project = {
        id: ()=> 'PVT_1',
        title: ()=> 't',
        plan: ()=> { throw new Error('plan() を読んだ'); },
    };

    const calls = [];
    const actions = { a: 1 };
    const onChange = ()=> {};

    const columns = ['title', 'priority', 'task'].map(code=> ({
        code,
        sx: { code },
        val: (...args)=> { calls.push(args); return `v:${code}`; },
    }));

    const row = TableBodyRowProject({ project, columns, actions, opened: true, onChange });

    assert.equal(row.type, 'TableRow');

    const cells = row.children.flat();

    assert.deepEqual(cells.map(c=> c.type), ['Cell', 'Cell', 'Cell']);
    assert.deepEqual(cells.map(c=> c.props.key), ['title', 'priority', 'task']);
    assert.deepEqual(cells.map(c=> c.children), [['v:title'], ['v:priority'], ['v:task']]);

    // val に渡す引数は、前と同じ。(column, project, actions, is_opened, onChange)
    assert.equal(calls.length, 3);

    for (const [i, args] of calls.entries())
        assert.deepEqual(args, [columns[i], project, actions, true, onChange]);
});

test('TableBodyRow は、行の部品に now を渡さない', async ()=> {
    const { default: TableBodyRow } = await load('TableBodyRow.js');

    const project = { id: ()=> 'PVT_1' };
    const columns = [];
    const onChange = ()=> {};

    const out = TableBodyRow({ project, columns, actions: {}, opened: false, onChange });

    const row = out.children.find(c=> c && c.type === 'TableBodyRowProject');

    assert.ok(row);
    assert.equal('now' in row.props, false);
    assert.deepEqual(Object.keys(row.props).sort(), ['actions', 'columns', 'onChange', 'opened', 'project']);
});
