// ProjectV2 の一覧の表の、Task の列の「開く」と、Item の表のテスト。
//   - Table は、TableBodyRow に「開いているか」を opened で渡す。(yanqirenshi/SOGH.next#99)
//   - 「開く」を押すと、Item の表 (TableBodyRowTasks → TableTasks) が出る。
//   - Item の表は、Issue・PullRequest・DraftIssue・content の無い Item で、落ちない。
//   - Item の表の map で作る要素には、key が付いている。(yanqirenshi/SOGH.next#100)
//   - 「#」の列は、Issue と PullRequest に番号のリンクを出し、DraftIssue と content の無い Item は空。(yanqirenshi/SOGH.next#101)
//   - 行が開いたときだけ、actions.tasks.open(project_id) で外に知らせる。Item の表は、Pool にある Item を出す。(yanqirenshi/SOGH.next#102)
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換し、src/components の部品は本物を読む。
// React は、createElement と useState だけを持つ偽物に、MUI は名前だけの偽物に差し替える。
// 描くときは、関数の部品を呼んで、{ type, props, children } の木にする。(DOM は作らない)

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

import Sogh from '../src/js/Sogh.js';
import * as model from '../src/js/models/index.js';

const T1 = '2026-11-01T09:00:00Z';

/* ****************************************************************
 * 偽の React と、部品を読むしくみ
 * **************************************************************** */

const REACT_SRC = `
let hooks = [];
let index = 0;
export function __begin () { index = 0; }
export function __clear () { hooks = []; index = 0; }
export function __hooks () { return hooks; }
const React = {
    createElement: (type, props, ...children)=> ({ type, props: props || {}, children }),
    useState: (init)=> {
        const i = index++;
        if (!(i in hooks)) hooks[i] = init;
        return [hooks[i], (v)=> { hooks[i] = v; }];
    },
    Fragment: 'Fragment',
};
export default React;
`;

const REACT_URL = 'data:text/javascript;base64,' + Buffer.from(REACT_SRC).toString('base64');

const NAME_STUB = (name)=> 'data:text/javascript,' + encodeURIComponent(`export default ${JSON.stringify(name)};`);

const SRC = new URL('../src/components/', import.meta.url);

const urls = new Map();

// src/components の下のファイルを、変換して data: URL にする。(相対の import も、同じように読む)
function urlOf (fileUrl) {
    const key = fileUrl.href;

    if (urls.has(key))
        return urls.get(key);

    const { code } = transformSync(fs.readFileSync(fileUrl, 'utf8'), {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-react'],
    });

    const replaced = code.replace(/import\s+(\w+)\s+from\s+'([^']+)'/g, (_all, name, from)=> {
        if (from === 'react')
            return `import ${name} from '${REACT_URL}'`;

        if (from.startsWith('.'))
            return `import ${name} from '${urlOf(new URL(from, fileUrl))}'`;

        return `import ${name} from '${NAME_STUB(name)}'`;
    });

    const url = 'data:text/javascript;base64,' + Buffer.from(replaced).toString('base64');

    urls.set(key, url);

    return url;
}

const load = (path)=> import(urlOf(new URL(path, SRC)));

const ReactStub = await import(REACT_URL);

// 関数の部品を呼んで、木にする。
function render (node) {
    if (Array.isArray(node))
        return node.map(render);

    if (!node || typeof node !== 'object')
        return node;

    if (typeof node.type === 'function') {
        const children = node.children.length === 0 ? undefined
              : node.children.length === 1 ? node.children[0] : node.children;

        return render(node.type({ ...node.props, children }));
    }

    return { type: node.type, props: node.props, children: node.children.map(render) };
}

function draw (element) {
    ReactStub.__begin();

    return render(element);
}

// 木の中の要素を、すべて並べる。
function walk (node, out=[]) {
    if (Array.isArray(node)) {
        node.forEach(n=> walk(n, out));
        return out;
    }

    if (!node || typeof node !== 'object')
        return out;

    out.push(node);
    walk(node.children, out);

    return out;
}

// 要素の中の文字を、つなげる。
function text (node) {
    if (Array.isArray(node))
        return node.map(text).join('');

    if (node === null || node === undefined || node === false || node === true)
        return '';

    if (typeof node !== 'object')
        return String(node);

    return text(node.children);
}

/* ****************************************************************
 * データ
 * **************************************************************** */

const user = (id, login)=> ({ __typename: 'User', id, login, name: null, avatarUrl: `https://example.test/${login}.png`, updatedAt: T1 });
const label = (id, name, color)=> ({ __typename: 'Label', id, name, color, updatedAt: T1 });

const fields = (title, more=[])=> ({ nodes: [
    { __typename: 'ProjectV2ItemFieldTextValue', field: { name: 'Title' }, text: title },
    ...more,
] });

function makeProject (sogh) {
    const item = (id, content, more)=> ({
        __typename: 'ProjectV2Item', id, type: content ? content.__typename.toUpperCase() : 'REDACTED', updatedAt: T1,
        content,
        fieldValues: fields(`title ${id}`, more),
    });

    return sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', number: 1, title: 'p', readme: '', updatedAt: T1,
        items: { edges: [
            { node: item('PVTI_1',
                         { __typename: 'Issue', id: 'I_1', number: 11, url: 'https://example.test/i/11', updatedAt: T1 },
                         [
                             { __typename: 'ProjectV2ItemFieldUserValue', field: { name: 'Assignees' }, users: { nodes: [user('U_1', 'alice'), user('U_2', 'bob')] } },
                             { __typename: 'ProjectV2ItemFieldLabelValue', field: { name: 'Labels' }, labels: { nodes: [label('L_1', 'bug', 'ff0000')] } },
                             { __typename: 'ProjectV2ItemFieldSingleSelectValue', field: { name: 'Status' }, name: 'Todo' },
                             { __typename: 'ProjectV2ItemFieldDateValue', field: { name: 'Due.Date' }, date: '2026-11-30' },
                             { __typename: 'ProjectV2ItemFieldDateValue', field: { name: 'NextAction.Date' }, date: '2026-11-05' },
                         ]) },
            { node: item('PVTI_2', { __typename: 'PullRequest', id: 'PR_1', number: 12, url: 'https://example.test/pr/12', updatedAt: T1 }) },
            { node: item('PVTI_3', { __typename: 'DraftIssue', id: 'DI_1', title: 'draft', updatedAt: T1 }) },
            { node: item('PVTI_4', null) },
        ] },
    });
}

const { default: ProjectsV2 } = await load('ProjectsV2.js');
const { default: Table } = await load('projectsV2/Table.js');
const { default: TableTasks } = await load('projectsV2/TableTasks.js');

/* ****************************************************************
 * opened の受け渡し (yanqirenshi/SOGH.next#99)
 * **************************************************************** */

test('Table は、TableBodyRow に「開いているか」を opened で渡す (is_opened ではない)', ()=> {
    const src = fs.readFileSync(new URL('projectsV2/Table.js', SRC), 'utf8');

    assert.match(src, /<TableBodyRow [\s\S]*?opened=\{is_opened\}/);
    assert.equal(/is_opened=\{/.test(src), false);
});

test('「開く」を押すと、Item の表が出て、ボタンが「閉じる」になる。もう一度押すと閉じる', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh });

    // 初め: 閉じている。
    let tree = draw(element);

    // 見出しのセル (HeadCell) は、描くと Cell になる。
    const hasItemHead = (t)=> walk(t).some(n=> n.type === 'Cell' && text(n) === 'Next Action Date');

    assert.equal(walk(tree).some(n=> n.type === 'Button' && text(n) === '開く'), true);
    assert.equal(hasItemHead(tree), false);

    // 押す。
    walk(tree).find(n=> n.type === 'Button').props.onClick();

    tree = draw(element);

    assert.equal(walk(tree).some(n=> n.type === 'Button' && text(n) === '閉じる'), true);

    assert.equal(hasItemHead(tree), true, 'Item の表の見出しが出る');

    // Item の表の行 (TableRow で、key が Item の id のもの) が、4 つ出る。
    const rows = walk(tree).filter(n=> n.type === 'TableRow' && /^PVTI_/.test(n.props.key || ''));

    assert.deepEqual(rows.map(r=> r.props.key), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4']);

    // もう一度押すと、閉じる。
    walk(tree).find(n=> n.type === 'Button').props.onClick();

    tree = draw(element);

    assert.equal(walk(tree).some(n=> n.type === 'Button' && text(n) === '開く'), true);
    assert.equal(hasItemHead(tree), false);
    assert.equal(walk(tree).some(n=> n.type === 'TableRow' && /^PVTI_/.test(n.props.key || '')), false);
});

/* ****************************************************************
 * Item の表
 * **************************************************************** */

test('Item の表は、Issue・PullRequest・DraftIssue・content の無い Item で、落ちずに出る', ()=> {
    const sogh = new Sogh();
    const project = makeProject(sogh);

    const tree = draw(ReactStub.default.createElement(TableTasks, { items: project.items() }));

    const rows = walk(tree).filter(n=> n.type === 'TableRow' && /^PVTI_/.test(n.props.key || ''));

    assert.equal(rows.length, 4);

    const cells = (row)=> row.children.flat().filter(n=> n && typeof n === 'object');

    // Issue: 番号のリンク・題・日付・担当者・ラベル・Status・Type。
    const issue = cells(rows[0]);

    assert.equal(text(issue[0]), '11');
    assert.equal(walk(issue[0]).find(n=> n.type === 'a').props.href, 'https://example.test/i/11');
    assert.equal(text(issue[1]), 'title PVTI_1');
    assert.equal(text(issue[2]), '2026-11-05');
    assert.equal(text(issue[3]), '2026-11-30');
    assert.equal(text(issue[4]), 'alicebob');
    assert.equal(text(issue[5]), 'bug');
    assert.equal(text(issue[6]), 'Todo');
    assert.equal(text(issue[7]), 'ISSUE');

    // PullRequest: 番号のリンク。(yanqirenshi/SOGH.next#101)
    assert.equal(text(cells(rows[1])[0]), '12');
    assert.equal(walk(cells(rows[1])[0]).find(n=> n.type === 'a').props.href, 'https://example.test/pr/12');
    assert.equal(text(cells(rows[1])[1]), 'title PVTI_2');

    // DraftIssue: 番号の欄は空。(前は "(null)" だった)
    assert.equal(text(cells(rows[2])[0]), '');

    // content の無い Item: 番号の欄は空で、担当者・ラベルも空。
    assert.equal(text(cells(rows[3])[0]), '');
    assert.equal(text(cells(rows[3])[4]), '');
    assert.equal(text(cells(rows[3])[5]), '');
});

test('Item の表の map で作る要素には、key が付いている (担当者は User の id)', ()=> {
    const sogh = new Sogh();
    const project = makeProject(sogh);

    const tree = draw(ReactStub.default.createElement(TableTasks, { items: project.items() }));

    const issueRow = walk(tree).find(n=> n.type === 'TableRow' && n.props.key === 'PVTI_1');
    const [, , , , assignees, labels] = issueRow.children.flat().filter(n=> n && typeof n === 'object');

    // 担当者の Box。
    const assigneeBoxes = assignees.children.flat().filter(n=> n && n.type === 'Box');

    assert.deepEqual(assigneeBoxes.map(b=> b.props.key), ['U_1', 'U_2']);

    // ラベルの Box。(前から付いている)
    const labelBoxes = walk(labels).filter(n=> n.type === 'Box' && n.props.key);

    assert.deepEqual(labelBoxes.map(b=> b.props.key), ['L_1']);

    // ソースの中の、要素を作る map ({…map(…)} の形) が、どれも key を付けていること。(Item の表と、一覧の表)
    // (値だけを作る map は、数えない。例: Table.js の makeHeaderRows の中の map)
    for (const file of ['projectsV2/TableTasks.js', 'projectsV2/Table.js', 'projectsV2/TableBodyRowProject.js']) {
        const src = fs.readFileSync(new URL(file, SRC), 'utf8');

        const maps = (src.match(/\{\s*[\w.()]+\.map\(/g) || []).length;

        assert.ok(maps > 0, `${file}: 要素を作る map が見つからない`);
        const keys = (src.match(/\bkey=\{/g) || []).length;

        assert.ok(keys >= maps, `${file}: map ${maps} 個・key ${keys} 個`);
    }
});

test('Table.js は、使っていない import (Cell・TableBodyRowProject・TableBodyRowTasks) を持たない', ()=> {
    const src = fs.readFileSync(new URL('projectsV2/Table.js', SRC), 'utf8');

    for (const name of ['Cell', 'TableBodyRowProject', 'TableBodyRowTasks'])
        assert.equal(new RegExp(`import ${name} from`).test(src), false, name);

    // Table 自体は、読める。
    assert.equal(typeof Table, 'function');
});

test('「#」の列: 種類は Issue・PullRequest でも、Pool にモデルが無いとき (content() が null) は、落ちずに空', ()=> {
    // sogh を入れないので、content() は関連を引けず null。(contentTypename() は core から読む)
    const items = [
        new model.ProjectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_1', content: { __typename: 'Issue', id: 'I_9' }, fieldValues: fields('a') }),
        new model.ProjectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_2', content: { __typename: 'PullRequest', id: 'PR_9' }, fieldValues: fields('b') }),
    ];

    assert.equal(items[0].contentTypename(), 'Issue');
    assert.equal(items[0].content(), null);

    const tree = draw(ReactStub.default.createElement(TableTasks, { items }));

    const rows = walk(tree).filter(n=> n.type === 'TableRow' && /^PVTI_/.test(n.props.key || ''));

    assert.equal(rows.length, 2);

    for (const row of rows) {
        const first = row.children.flat().filter(n=> n && typeof n === 'object')[0];

        assert.equal(text(first), '');
    }
});

/* ****************************************************************
 * 開いたことを知らせる (yanqirenshi/SOGH.next#102)
 * **************************************************************** */

test('行が開いたときだけ、actions.tasks.open(project_id) を呼ぶ。閉じたときは呼ばない', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const opened = [];
    const actions = {
        title: { click: ()=> {} },
        tasks: { open: (id)=> opened.push(id) },
    };

    const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, actions });

    const press = ()=> walk(draw(element)).find(n=> n.type === 'Button').props.onClick();

    press(); // 開く
    assert.deepEqual(opened, ['PVT_1']);

    press(); // 閉じる
    assert.deepEqual(opened, ['PVT_1']);

    press(); // また開く
    assert.deepEqual(opened, ['PVT_1', 'PVT_1']);
});

test('actions に tasks.open が無くても、落ちずに開く', ()=> {
    for (const actions of [{ title: { click: ()=> {} } }, { title: { click: ()=> {} }, tasks: {} }, { title: { click: ()=> {} }, tasks: { open: 'x' } }]) {
        ReactStub.__clear();

        const sogh = new Sogh();
        const project = makeProject(sogh);

        const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, actions });

        walk(draw(element)).find(n=> n.type === 'Button').props.onClick();

        const tree = draw(element);

        assert.equal(walk(tree).some(n=> n.type === 'Button' && text(n) === '閉じる'), true);
    }
});

test('ProjectsV2 の既定の actions にも、何もしない tasks.open がある', ()=> {
    const src = fs.readFileSync(new URL('ProjectsV2.js', SRC), 'utf8');

    assert.match(src, /function defaultActions \(\) \{[\s\S]*?tasks: \{\s*open: \(project_id\)=> project_id,/);
});

test('Item の表は、Pool にある、その ProjectV2 の Item を出す。(別に取った Item も出す。ほかの ProjectV2 の Item は出さない)', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    // 別に取って Pool に入った Item。(asyncFetchProjectV2ItemsBy〜 の形)
    sogh.node2projectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_5', updatedAt: T1, project: { __typename: 'ProjectV2', id: 'PVT_1', number: 1, updatedAt: T1 }, fieldValues: fields('five') });
    sogh.node2projectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_9', updatedAt: T1, project: { __typename: 'ProjectV2', id: 'PVT_2', number: 2, updatedAt: T1 }, fieldValues: fields('nine') });

    const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh });

    walk(draw(element)).find(n=> n.type === 'Button').props.onClick();

    const rows = walk(draw(element)).filter(n=> n.type === 'TableRow' && /^PVTI_/.test(n.props.key || ''));

    assert.deepEqual(rows.map(r=> r.props.key), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4', 'PVTI_5']);
});

/* ****************************************************************
 * actions を一部だけ渡したとき (yanqirenshi/SOGH.next#102)
 * **************************************************************** */

// 題の列の、押せる要素。(MUI の Typography を S の名前で読んでいる)
const pressTitle = (tree)=> walk(tree).find(n=> n.type === 'S' && typeof n.props.onClick === 'function').props.onClick();
const pressTask  = (tree)=> walk(tree).find(n=> n.type === 'Button').props.onClick();

test('tasks.open だけを渡しても、題を押して落ちない (title.click は既定)。渡した tasks.open は呼ばれる', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const opened = [];
    const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, actions: { tasks: { open: (id)=> opened.push(id) } } });

    assert.doesNotThrow(()=> pressTitle(draw(element)));

    pressTask(draw(element));

    assert.deepEqual(opened, ['PVT_1']);
});

test('組の中が空 ({ title: {} }) でも、title.click は既定を使う', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, actions: { title: {}, tasks: { open: 'x' } } });

    assert.doesNotThrow(()=> pressTitle(draw(element)));
    assert.doesNotThrow(()=> pressTask(draw(element)));
});

test('渡した関数は、既定で上書きされずに呼ばれる', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const clicked = [];
    const element = ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, actions: { title: { click: (id)=> clicked.push(id) } } });

    pressTitle(draw(element));

    assert.deepEqual(clicked, ['PVT_1']);

    // tasks は渡していないので、既定 (何もしない)。開いても落ちない。
    assert.doesNotThrow(()=> pressTask(draw(element)));
});

test('既定に無い名前 (組も、組の中の名前も) は、そのまま列の val に渡る。actions が無いときは既定だけ', ()=> {
    for (const [given, check] of [
        [{ issue: { refresh: ()=> 'r' }, title: { other: ()=> 'o' } },
         (a)=> {
             assert.equal(a.issue.refresh(), 'r');
             assert.equal(a.title.other(), 'o');
             assert.equal(typeof a.title.click, 'function');
             assert.equal(typeof a.tasks.open, 'function');
         }],
        [undefined, (a)=> assert.deepEqual(Object.keys(a).sort(), ['tasks', 'title'])],
        [null,      (a)=> assert.deepEqual(Object.keys(a).sort(), ['tasks', 'title'])],
    ]) {
        ReactStub.__clear();

        const sogh = new Sogh();
        const project = makeProject(sogh);

        let seen = null;
        // group の無い列だけ。(前は、見出しを作る所 (makeHeaderRows) が落ちたので group を付けていた。yanqirenshi/SOGH.next#105 で直した)
        const columns = [{ code: 'probe', label: 'Probe', sx: null, val: (_column, _p, actions)=> { seen = actions; return null; } }];

        draw(ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, columns, actions: given }));

        check(seen);
    }
});

/* ****************************************************************
 * 見出し (yanqirenshi/SOGH.next#105)
 * **************************************************************** */

// 表の見出し (TableHead) の行ごとの、セルの [文字, rowSpan, colSpan]。
function headRows (tree) {
    const head = walk(tree).find(n=> n.type === 'TableHead');

    return head.children.flat().filter(n=> n && n.type === 'TableRow').map(row=> {
        return row.children.flat().filter(n=> n && n.type === 'Cell').map(c=> [text(c), c.props.rowSpan, c.props.colSpan]);
    });
}

const plainColumn = (code, label, group)=> ({ code, label, group, sx: null, val: ()=> code });

test('グループの無い列だけでも、表は落ちずに、見出しを 1 行で描く', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const columns = [plainColumn('a', 'A'), plainColumn('b', 'B')];

    const tree = draw(ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, columns }));

    assert.deepEqual(headRows(tree), [[['A', 1, 1], ['B', 1, 1]]]);
});

test('最後の列がグループの中でも、表は、そのグループを見出しに描く', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const columns = [plainColumn('a', 'A'), plainColumn('p.s', 'Start', 'Plan'), plainColumn('p.e', 'End', 'Plan')];

    const tree = draw(ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, columns }));

    assert.deepEqual(headRows(tree), [
        [['A', 2, 1], ['Plan', 1, 2]],
        [['Start', 1, 1], ['End', 1, 1]],
    ]);
});

test('列が 0 個でも、表は落ちない (見出しの行は無い)', ()=> {
    ReactStub.__clear();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const tree = draw(ReactStub.default.createElement(ProjectsV2, { data: [project], sogh, columns: [] }));

    assert.deepEqual(headRows(tree), []);
});

test('見出しのセルの key は、見出しの文字と、何番めかの数 (label_i) (yanqirenshi/SOGH.next#111)', ()=> {
    ReactStub.__clear();
    ReactStub.__begin();

    const sogh = new Sogh();
    const project = makeProject(sogh);

    const columns = [plainColumn('a', 'A'), plainColumn('p.s', 'Start', 'Plan'), plainColumn('p.e', 'End', 'Plan')];

    // Table を描く前の木。(HeadCell は、まだ呼ばれていないので、key が残っている)
    const element = Table({ data: [project], actions: {}, columns });

    const keys = walk(element)
          .filter(n=> typeof n.type === 'function' && n.type.name === 'HeadCell')
          .map(n=> n.props.key);

    assert.deepEqual(keys, ['A_0', 'Plan_1', 'Start_0', 'End_1']);
    assert.equal(keys.some(k=> k.includes('[object Object]')), false);
});
