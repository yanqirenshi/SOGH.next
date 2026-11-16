// ProjectV2 の一覧の表の、見出しを作る関数 makeHeaderRows(columns) のテスト。(yanqirenshi/SOGH.next#105)
//   - グループ (group) の付いた列が無いときは、見出しの行を 1 つ返す。(前は、列の配列をそのまま返していて、表が落ちた)
//   - 最後の列がグループの中にあるときも、そのグループを見出しに足す。(前は、足していなかった)
//   - 既定の列 (COLUMNS) の見出しは、前と同じ。
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換し、import はすべて名前だけの偽物に差し替える。
// makeHeaderRows と COLUMNS は export していないので、変換したものの最後に export を足して読む。

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

const SRC = new URL('../src/components/', import.meta.url);

const NAME_STUB = (name)=> 'data:text/javascript,' + encodeURIComponent(`export default ${JSON.stringify(name)};`);

async function load (path, exportsLine) {
    const { code } = transformSync(fs.readFileSync(new URL(path, SRC), 'utf8'), {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-react'],
    });

    const replaced = code.replace(/import\s+(\w+)\s+from\s+'([^']+)'/g, (_all, name)=> `import ${name} from '${NAME_STUB(name)}'`)
          + `\n${exportsLine}\n`;

    return import('data:text/javascript;base64,' + Buffer.from(replaced).toString('base64'));
}

const { __makeHeaderRows: makeHeaderRows } = await load('projectsV2/Table.js', 'export { makeHeaderRows as __makeHeaderRows };');
const { __COLUMNS: COLUMNS } = await load('ProjectsV2.js', 'export { COLUMNS as __COLUMNS };');

// 0.5.0 で直す前の makeHeaderRows。(既定の列で、前と同じ形かを比べるためだけに置く)
function makeHeaderRowsBefore (columns) {
    const tmp = columns.reduce((out, column)=> {
        const group = column.group || null;

        if (group) {
            out.is_double_row = true;
            if (!out.group) {
                out.group = { __type: 'group', label: group, list: [column]};
            } else {
                if (group===out.group.label) {
                    out.group.list.push(column);
                } else {
                    out.list.push(out.group);
                    out.group = { __type: 'group', label: group, list: [column]};
                }
            }

        } else {
            if (!out.group) {
                out.list.push(column);
            } else {
                out.list.push(out.group);
                out.group = null;

                out.list.push(column);
            }
        }

        return out;
    }, {
        group: null,
        is_double_row: false,
        list: [],
    });

    if (!tmp.is_double_row)
        return tmp.list;

    return tmp.list.reduce((out, data)=> {
        if ('group'===data.__type) {
            out[0].push({ label: data.label, row_span: 1, col_span: data.list.length});

            for (const d of data.list)
                out[1].push({ label: d.label, row_span: 1, col_span: 1});
        } else {
            out[0].push({ label: data.label, row_span: 2, col_span: 1});
        }

        return out;
    }, [[],[]]);
}

const col = (code, label, group)=> group ? { code, label, group } : { code, label };
const cell = (label, row_span, col_span)=> ({ label, row_span, col_span });

/* ****************************************************************
 * 既定の列
 * **************************************************************** */

test('既定の列 (COLUMNS) の見出しは、直す前と同じ', ()=> {
    assert.deepEqual(makeHeaderRows(COLUMNS), makeHeaderRowsBefore(COLUMNS));

    // 形も確かめる。(2 行。グループは Plan・Result が 2 列ずつ、Dependencies が 1 列)
    const rows = makeHeaderRows(COLUMNS);

    assert.equal(rows.length, 2);
    assert.deepEqual(rows[0].filter(c=> c.row_span === 1).map(c=> [c.label, c.col_span]), [['Plan', 2], ['Result', 2], ['Dependencies', 1]]);
    assert.deepEqual(rows[1], [cell('Start', 1, 1), cell('End', 1, 1), cell('Start', 1, 1), cell('End', 1, 1), cell('Backlog', 1, 1)]);

    // 1 行目の幅と、2 行目の数を足すと、列の数になる。
    const width = rows[0].reduce((n, c)=> n + c.col_span, 0);

    assert.equal(width, COLUMNS.length);
});

/* ****************************************************************
 * グループの付いた列が無い (1)
 * **************************************************************** */

test('グループの付いた列が無いときは、見出しの行を 1 つ返す', ()=> {
    const columns = [col('a', 'A'), col('b', 'B'), col('c', '')];

    assert.deepEqual(makeHeaderRows(columns), [[cell('A', 1, 1), cell('B', 1, 1), cell('', 1, 1)]]);
});

/* ****************************************************************
 * 最後の列がグループの中 (2)
 * **************************************************************** */

test('最後の列がグループの中にあるときも、そのグループを見出しに足す', ()=> {
    const columns = [col('a', 'A'), col('p.s', 'Start', 'Plan'), col('p.e', 'End', 'Plan')];

    assert.deepEqual(makeHeaderRows(columns), [
        [cell('A', 2, 1), cell('Plan', 1, 2)],
        [cell('Start', 1, 1), cell('End', 1, 1)],
    ]);
});

test('列がすべて 1 つのグループの中でも、そのグループを見出しに足す', ()=> {
    const columns = [col('p.s', 'Start', 'Plan'), col('p.e', 'End', 'Plan')];

    assert.deepEqual(makeHeaderRows(columns), [
        [cell('Plan', 1, 2)],
        [cell('Start', 1, 1), cell('End', 1, 1)],
    ]);
});

/* ****************************************************************
 * そのほか
 * **************************************************************** */

test('グループが続くときは、グループごとに分ける (最後のグループも足す)', ()=> {
    const columns = [
        col('p.s', 'Start', 'Plan'), col('p.e', 'End', 'Plan'),
        col('r.s', 'Start', 'Result'), col('r.e', 'End', 'Result'),
    ];

    assert.deepEqual(makeHeaderRows(columns), [
        [cell('Plan', 1, 2), cell('Result', 1, 2)],
        [cell('Start', 1, 1), cell('End', 1, 1), cell('Start', 1, 1), cell('End', 1, 1)],
    ]);
});

test('同じ名前のグループが離れて 2 回出るときは、別のグループとして 2 つ出す (いまの動き)', ()=> {
    const columns = [col('p.s', 'Start', 'Plan'), col('a', 'A'), col('p.e', 'End', 'Plan')];

    assert.deepEqual(makeHeaderRows(columns), [
        [cell('Plan', 1, 1), cell('A', 2, 1), cell('Plan', 1, 1)],
        [cell('Start', 1, 1), cell('End', 1, 1)],
    ]);
});

test('列が 0 個のときは、行も 0 個', ()=> {
    assert.deepEqual(makeHeaderRows([]), []);
});

test('どの列の形でも、見出しの幅は列の数と同じ', ()=> {
    const cases = [
        [col('a', 'A')],
        [col('p.s', 'S', 'P')],
        [col('a', 'A'), col('p.s', 'S', 'P')],
        [col('p.s', 'S', 'P'), col('a', 'A')],
        [col('p.s', 'S', 'P'), col('r.s', 'S', 'R'), col('a', 'A'), col('x.s', 'S', 'X'), col('x.e', 'E', 'X')],
    ];

    for (const columns of cases) {
        const rows = makeHeaderRows(columns);

        const width = rows[0].reduce((n, c)=> n + c.col_span, 0);

        assert.equal(width, columns.length, JSON.stringify(columns));

        if (rows.length === 2) {
            const grouped = columns.filter(c=> c.group).length;

            assert.equal(rows[1].length, grouped, JSON.stringify(columns));
        }
    }
});
