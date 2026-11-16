// レビュアーの列のテスト。(yanqirenshi/SOGH.next#39)
//   - レビュアーの名前・リンク・アイコンを、型によらず (メソッドの有無で) 読む。(common/reviewer.js)
//   - 表 X (project_next_items/Table.js。入口は ProjectV2Items) の REVIEWERS の列が、既定で出る。
//   - 表 Y (common/TableProjectV2Items.js。入口は TableProjectV2Items) に、Assignees の右に Reviewers の列が出る。
//   - User・Team・Mannequin・Bot が混ざっても、レビュアーが無い Item でも、落ちない。
//   - Team にアイコンが無いとき (avatarUrl が null) は、src を渡さず、Avatar の子に名前の頭文字を渡す。
//     (MUI の Avatar は、src が無いと、alt の頭文字ではなく、人の形の絵を出すため)
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換し、src/components の部品は本物を読む。
// React は createElement だけを持つ偽物に、MUI は名前だけの偽物に、luxon は日付が読めない偽物に差し替える。
// 描くときは、関数の部品を呼んで、{ type, props, children } の木にする。(DOM は作らない)
//
// GitHub には、つながない。
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

import Sogh from '../src/js/Sogh.js';

const T1 = '2026-11-01T09:00:00Z';

/* ****************************************************************
 * 偽の React と、部品を読むしくみ
 * **************************************************************** */

const REACT_SRC = `
export const createElement = (type, props, ...children)=> ({ type, props: props || {}, children });
export const Fragment = 'Fragment';
export default { createElement, Fragment };
`;

const LUXON_SRC = `
export const DateTime = {
    fromISO: ()=> ({ isValid: false }),
    now: ()=> ({}),
};
`;

const data = (src)=> 'data:text/javascript;base64,' + Buffer.from(src).toString('base64');

const REACT_URL = data(REACT_SRC);
const LUXON_URL = data(LUXON_SRC);

// MUI の部品は、名前だけの偽物。(描くと、type が名前の要素になる)
const NAME_STUB = (name)=> data(`export default ${JSON.stringify(name)};`);

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

    // import <名前 | * as 名前 | { 名前 }> from '<場所>'
    // (Babel は、元のファイルの引用符を、そのまま残す。' も " も読む)
    const replaced = code.replace(/import\s+([^'"]+?)\s+from\s+['"]([^'"]+)['"]/g, (_all, clause, from)=> {
        if (from === 'react')
            return `import ${clause} from '${REACT_URL}'`;

        if (from === 'luxon')
            return `import ${clause} from '${LUXON_URL}'`;

        if (from.startsWith('.'))
            return `import ${clause} from '${urlOf(new URL(from, fileUrl))}'`;

        return `import ${clause} from '${NAME_STUB(from.split('/').pop())}'`;
    });

    const url = data(replaced);

    urls.set(key, url);

    return url;
}

const load = (path)=> import(urlOf(new URL(path, SRC)));

const React = await import(REACT_URL);

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

const draw = (element)=> render(element);

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

// 要素の直下にある要素 (配列は、ほどく。文字は、外す)。
const elements = (node)=> node.children.flat(Infinity).filter(n=> n && typeof n === 'object');

/* ****************************************************************
 * データ
 * **************************************************************** */

const user  = { __typename: 'User', id: 'U_1', login: 'alice', name: 'Alice', url: 'https://example.test/alice', avatarUrl: 'https://example.test/alice.png', updatedAt: T1 };
const team  = { __typename: 'Team', id: 'T_1', slug: 'core', teamName: 'Core Team', teamAvatarUrl: 'https://example.test/core.png', url: 'https://example.test/teams/core', updatedAt: T1 };
// アイコンが無い Team。
const team2 = { __typename: 'Team', id: 'T_2', slug: 'dev', teamName: 'Dev Team', teamAvatarUrl: null, url: 'https://example.test/teams/dev', updatedAt: T1 };
const mannequin = { __typename: 'Mannequin', id: 'M_1', login: 'mona', url: 'https://example.test/mona', avatarUrl: 'https://example.test/mona.png', updatedAt: T1 };
const bot = { __typename: 'Bot', id: 'B_1', login: 'robo', url: 'https://example.test/robo', avatarUrl: 'https://example.test/robo.png', updatedAt: T1 };

const FIELD_TITLE = { id: 'F_T', name: 'Title', dataType: 'TITLE' };
const FIELD_REVIEWERS = { id: 'F_R', name: 'Reviewers', dataType: 'REVIEWERS' };

const reviewerValue = (nodes)=> ({ __typename: 'ProjectV2ItemFieldReviewerValue', field: { id: 'F_R', name: 'Reviewers' }, reviewers: { nodes } });

const item = (id, reviewers)=> ({
    __typename: 'ProjectV2Item', id, type: 'DRAFT_ISSUE', updatedAt: T1,
    fieldValues: { nodes: [
        { __typename: 'ProjectV2ItemFieldTextValue', field: { id: 'F_T', name: 'Title' }, text: `title ${id}` },
        ...(reviewers ? [reviewerValue(reviewers)] : []),
    ] },
});

// PVTI_1: 4 つの型が混ざる (EnterpriseTeam など、id の無い空のものも)。PVTI_2: レビュアーの項目が無い。PVTI_3: レビュアーが空。
// PVTI_4: アイコンが無い Team。
function makeSogh () {
    const sogh = new Sogh();

    sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', number: 1, title: 'p', readme: '', updatedAt: T1,
        items: { edges: [
            { node: item('PVTI_1', [user, team, {}, mannequin, bot]) },
            { node: item('PVTI_2', null) },
            { node: item('PVTI_3', []) },
            { node: item('PVTI_4', [team2]) },
        ] },
    });

    return sogh;
}

const { default: Table } = await load('project_next_items/Table.js');
const { default: TableProjectV2Items } = await load('common/TableProjectV2Items.js');
const reviewer = await load('common/reviewer.js');

/* ****************************************************************
 * 読み方 (common/reviewer.js)
 * **************************************************************** */

test('レビュアーの名前は、name() があれば name()、無ければ login()、それも無ければ slug()', ()=> {
    const sogh = makeSogh();

    const [u, t, m, b] = sogh.projectV2Item('PVTI_1').reviewers();

    assert.equal(reviewer.reviewerName(u), 'Alice');
    assert.equal(reviewer.reviewerName(t), 'Core Team');
    assert.equal(reviewer.reviewerName(m), 'mona');
    assert.equal(reviewer.reviewerName(b), 'robo');

    // User で name が無いとき・Team で name が無いとき。
    assert.equal(reviewer.reviewerName(sogh.node2user({ __typename: 'User', id: 'U_2', login: 'bob', name: null, updatedAt: T1 })), 'bob');
    assert.equal(reviewer.reviewerName(sogh.node2team({ __typename: 'Team', id: 'T_9', slug: 'bare', updatedAt: T1 })), 'bare');

    assert.equal(reviewer.reviewerName(null), null);
});

test('レビュアーのリンクとアイコンは、4 つの型のどれでも url()・avatarUrl() で読める。Team にアイコンが無いときは null', ()=> {
    const sogh = makeSogh();

    const [u, t, m, b] = sogh.projectV2Item('PVTI_1').reviewers();

    assert.deepEqual([u, t, m, b].map(reviewer.reviewerUrl), [
        'https://example.test/alice', 'https://example.test/teams/core', 'https://example.test/mona', 'https://example.test/robo',
    ]);
    assert.deepEqual([u, t, m, b].map(reviewer.reviewerAvatarUrl), [
        'https://example.test/alice.png', 'https://example.test/core.png', 'https://example.test/mona.png', 'https://example.test/robo.png',
    ]);

    assert.equal(reviewer.reviewerAvatarUrl(sogh.projectV2Item('PVTI_4').reviewers()[0]), null);
});

test('名前の頭文字は、1 文字め。大文字にする。符号 2 つで 1 文字のもの (絵文字など) も、切れない。名前が無いときは null', ()=> {
    const sogh = makeSogh();

    const [u, t, m, b] = sogh.projectV2Item('PVTI_1').reviewers();

    assert.deepEqual([u, t, m, b].map(reviewer.reviewerInitial), ['A', 'C', 'M', 'R']);
    assert.equal(reviewer.reviewerInitial(sogh.projectV2Item('PVTI_4').reviewers()[0]), 'D');

    const team = (id, name)=> sogh.node2team({ __typename: 'Team', id, slug: 'x', teamName: name, updatedAt: T1 });

    assert.equal(reviewer.reviewerInitial(team('T_a', 'dev team')), 'D');
    assert.equal(reviewer.reviewerInitial(team('T_b', '開発チーム')), '開');
    assert.equal(reviewer.reviewerInitial(team('T_c', '𠮷野家')), '𠮷');
    assert.equal(reviewer.reviewerInitial(team('T_d', '🚀 launch')), '🚀');
    assert.equal(reviewer.reviewerInitial(team('T_e', 'ßeta')), 'S');
    assert.equal(reviewer.reviewerInitial(team('T_f', '  lead')), 'L');

    // name が無いときは、slug。それも無いときは null。
    assert.equal(reviewer.reviewerInitial(sogh.node2team({ __typename: 'Team', id: 'T_g', slug: 'bare', updatedAt: T1 })), 'B');
    assert.equal(reviewer.reviewerInitial(sogh.node2team({ __typename: 'Team', id: 'T_h', updatedAt: T1 })), null);
    assert.equal(reviewer.reviewerInitial(team('T_i', '   ')), null);
    assert.equal(reviewer.reviewerInitial(null), null);
});

test('reviewersOf() は、モデルの配列を返す。レビュアーが無い Item・Item でないものは、空の配列', ()=> {
    const sogh = makeSogh();

    assert.equal(reviewer.reviewersOf(sogh.projectV2Item('PVTI_1')).length, 4);
    assert.deepEqual(reviewer.reviewersOf(sogh.projectV2Item('PVTI_2')), []);
    assert.deepEqual(reviewer.reviewersOf(sogh.projectV2Item('PVTI_3')), []);
    assert.deepEqual(reviewer.reviewersOf(null), []);
    assert.deepEqual(reviewer.reviewersOf({}), []);
});

/* ****************************************************************
 * 表 X (ProjectV2Items)
 * **************************************************************** */

function drawTableX (sogh) {
    return draw(React.createElement(Table, {
        fields: [FIELD_TITLE, FIELD_REVIEWERS],
        items: ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4'],
        sogh,
    }));
}

const rowsOf = (tree)=> walk(tree).filter(n=> n.type === 'TableRow' && /^PVTI_/.test(n.props.key || ''));

test('表 X: REVIEWERS の列は、既定で出る。(見出しは、フィールドの名前)。ASSIGNEES など、ほかの隠してある列は、隠れたまま', ()=> {
    const tree = drawTableX(makeSogh());

    const head = walk(tree).find(n=> n.type === 'TableHead');
    const heads = elements(elements(head)[0]).map(text);

    // TITLE・REPOSITORY・REVIEWERS・type・is_archived・From・Date.Due・Status の 8 列。(REPOSITORY・From・Date.Due・Status のフィールドは、この表の中に無いので '?')
    assert.equal(heads.length, 8);
    assert.equal(heads[0], 'Title');
    assert.equal(heads[2], 'Reviewers');
    assert.equal(heads.includes('Assignees'), false);
});

test('表 X: レビュアーの列は、名前を、リンクにして、1 人ずつ並べる。(User・Team・Mannequin・Bot)', ()=> {
    const tree = drawTableX(makeSogh());

    const rows = rowsOf(tree);

    assert.deepEqual(rows.map(r=> r.props.key), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4']);

    const cell = (row)=> elements(row)[2];

    // PVTI_1: 4 人。(id の無い空のものは、外れる)
    const people = walk(cell(rows[0])).filter(n=> n.type === 'p');

    assert.equal(people.length, 4);
    assert.deepEqual(people.map(n=> n.props.key), ['U_1', 'T_1', 'M_1', 'B_1']);

    const links = walk(cell(rows[0])).filter(n=> n.type === 'Link');

    assert.deepEqual(links.map(n=> [n.props.href, text(n)]), [
        ['https://example.test/alice', 'Alice'],
        ['https://example.test/teams/core', 'Core Team'],
        ['https://example.test/mona', 'mona'],
        ['https://example.test/robo', 'robo'],
    ]);

    // PVTI_4: アイコンが無い Team も、名前のリンクで出る。
    assert.deepEqual(walk(cell(rows[3])).filter(n=> n.type === 'Link').map(n=> [n.props.href, text(n)]),
                     [['https://example.test/teams/dev', 'Dev Team']]);
});

test('表 X: レビュアーが無い Item (項目が無い・空) は、空のセル', ()=> {
    const rows = rowsOf(drawTableX(makeSogh()));

    for (const i of [1, 2]) {
        const cell = elements(rows[i])[2];

        assert.equal(cell.type, 'TableCell');
        assert.equal(walk(cell).some(n=> n.type === 'Link' || n.type === 'p'), false, rows[i].props.key);
    }
});

test('表 X: レビュアーの項目が、プロジェクトのフィールドに無いときも、落ちない', ()=> {
    const tree = draw(React.createElement(Table, {
        fields: [FIELD_TITLE],
        items: ['PVTI_1'],
        sogh: makeSogh(),
    }));

    const rows = rowsOf(tree);

    assert.equal(rows.length, 1);
    assert.equal(walk(elements(rows[0])[2]).some(n=> n.type === 'Link'), false);
});

/* ****************************************************************
 * 表 Y (TableProjectV2Items)
 * **************************************************************** */

function drawTableY (sogh) {
    const items = ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_4'].map(id=> sogh.projectV2Item(id));

    return draw(React.createElement(TableProjectV2Items, { items, actions: {} }));
}

test('表 Y: Reviewers の列は、Assignees の右にある', ()=> {
    const tree = drawTableY(makeSogh());

    const head = walk(tree).find(n=> n.type === 'TableHead');

    assert.deepEqual(elements(elements(head)[0]).map(text), ['Title', 'Assignees', 'Reviewers', 'Due', 'NextAction', 'Closed']);

    // 行も、同じ順で、6 つのセル。
    for (const row of rowsOf(tree))
        assert.equal(elements(row).length, 6, row.props.key);
});

test('表 Y: レビュアーは、Avatar を並べる。alt は名前、src は avatarUrl。アイコンが無い Team は、src を渡さず、子に頭文字を渡す', ()=> {
    const rows = rowsOf(drawTableY(makeSogh()));

    const avatars = (row)=> walk(elements(row)[2]).filter(n=> n.type === 'Avatar');

    assert.deepEqual(avatars(rows[0]).map(n=> [n.props.alt, n.props.src]), [
        ['Alice', 'https://example.test/alice.png'],
        ['Core Team', 'https://example.test/core.png'],
        ['mona', 'https://example.test/mona.png'],
        ['robo', 'https://example.test/robo.png'],
    ]);

    assert.deepEqual(avatars(rows[0]).map(n=> n.props.key), ['U_1', 'T_1', 'M_1', 'B_1']);

    // アイコンがあるものは、子が無い。(画像を出す)
    for (const a of avatars(rows[0]))
        assert.equal(text(a), '', a.props.key);

    // アイコンが無い Team: src は無く、alt に名前があり、子に頭文字が入る。
    const [bare] = avatars(rows[3]);

    assert.equal(bare.props.alt, 'Dev Team');
    assert.equal(bare.props.src, undefined);
    assert.equal(text(bare), 'D');
});

test('表 Y: アイコンが無く、名前も無いときは、子が無い (Avatar の既定の絵のまま)', ()=> {
    const sogh = new Sogh();

    // name も slug も無い Team。(avatarUrl も無い)
    sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_8', type: 'DRAFT_ISSUE', updatedAt: T1,
        fieldValues: { nodes: [
            { __typename: 'ProjectV2ItemFieldTextValue', field: { name: 'Title' }, text: 't' },
            reviewerValue([{ __typename: 'Team', id: 'T_8', updatedAt: T1 }]),
        ] },
    });

    const rows = rowsOf(draw(React.createElement(TableProjectV2Items, { items: [sogh.projectV2Item('PVTI_8')], actions: {} })));

    const [avatar] = walk(elements(rows[0])[2]).filter(n=> n.type === 'Avatar');

    assert.equal(avatar.props.alt, undefined);
    assert.equal(avatar.props.src, undefined);
    assert.equal(text(avatar), '');
});

test('表 Y: レビュアーが無い Item は、Avatar の無いセル', ()=> {
    const rows = rowsOf(drawTableY(makeSogh()));

    for (const i of [1, 2]) {
        const cell = elements(rows[i])[2];

        assert.equal(cell.type, 'TableCell');
        assert.equal(walk(cell).some(n=> n.type === 'Avatar'), false, rows[i].props.key);
    }
});

test('表 Y: 担当者の列は、いまのまま。(Avatar を並べる)', ()=> {
    const sogh = new Sogh();

    sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_9', type: 'DRAFT_ISSUE', updatedAt: T1,
        fieldValues: { nodes: [
            { __typename: 'ProjectV2ItemFieldTextValue', field: { name: 'Title' }, text: 't' },
            { __typename: 'ProjectV2ItemFieldUserValue', field: { name: 'Assignees' }, users: { nodes: [user] } },
        ] },
    });

    const tree = draw(React.createElement(TableProjectV2Items, { items: [sogh.projectV2Item('PVTI_9')], actions: {} }));

    const row = rowsOf(tree)[0];

    assert.deepEqual(walk(elements(row)[1]).filter(n=> n.type === 'Avatar').map(n=> n.props.alt), ['Alice']);
    assert.equal(walk(elements(row)[2]).some(n=> n.type === 'Avatar'), false);
});
