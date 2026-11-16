// コメントの一覧の部品 (PanelIssueComments = src/components/IssueComments.js) のテスト。(yanqirenshi/SOGH.next#124)
//   - comments だけを渡しても (edit_contents・actions が無くても)、描いただけでは落ちない。
//   - 利用側の関数が無いときは、その関数が要るボタンを出さない。
//       Edit (と、編集中の Cancel・Commit)   … actions.issue.comment.change と update
//       Delete (と、確かめの Delete・Cancel) … actions.issue.comment.change と delete
//   - 3 つとも渡したときの、見た目と動きは、いままでどおり。
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。(やり方は test/panel-issue.test.mjs と同じ)
// このテストの中で、@babel/preset-react で JSX だけを変換し、src/components の部品は本物を読む。
// React は、createElement と useState だけを持つ偽物に、MUI と MDEditor は名前だけの偽物に差し替える。
// moment と luxon は、本物を読む。

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

import Sogh from '../src/js/Sogh.js';

/* ****************************************************************
 * 偽の React と、部品を読むしくみ
 * **************************************************************** */

const REACT_SRC = `
const React = {
    createElement: (type, props, ...children)=> ({ type, props: props || {}, children }),
    useState: (init)=> [init, ()=> {}],
    Fragment: 'Fragment',
};
export default React;`;

const REACT_URL = 'data:text/javascript;base64,' + Buffer.from(REACT_SRC).toString('base64');

const NAME_STUB = (name)=> 'data:text/javascript,' + encodeURIComponent(`export default ${JSON.stringify(name)};`);

// 本物を読むもの。(data: URL の中からは、パッケージの名前で読めないので、ファイルの URL にする)
const REAL = {
    moment: import.meta.resolve('moment'),
    luxon: import.meta.resolve('luxon'),
};

const SRC = new URL('../src/components/', import.meta.url);

const urls = new Map();

function urlOf (fileUrl) {
    if (urls.has(fileUrl.href))
        return urls.get(fileUrl.href);

    const { code } = transformSync(fs.readFileSync(fileUrl, 'utf8'), {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-react'],
    });

    // import <名前 | { 名前 }> from '<場所>'
    const replaced = code.replace(/import\s+([^'"]+?)\s+from\s+['"]([^'"]+)['"]/g, (_all, clause, from)=> {
        if (from === 'react')
            return `import ${clause} from '${REACT_URL}'`;

        if (REAL[from])
            return `import ${clause} from '${REAL[from]}'`;

        if (from.startsWith('.'))
            return `import ${clause} from '${urlOf(new URL(from, fileUrl))}'`;

        // 名前は、import の名前。(MDEditor・Button など)
        return `import ${clause} from '${NAME_STUB(/^\w+$/.test(clause) ? clause : from.split('/').pop())}'`;
    });

    const url = 'data:text/javascript;base64,' + Buffer.from(replaced).toString('base64');

    urls.set(fileUrl.href, url);

    return url;
}

const load = (path)=> import(urlOf(new URL(path, SRC)));

const React = (await import(REACT_URL)).default;

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

function text (node) {
    if (Array.isArray(node))
        return node.map(text).join('');

    if (node === null || node === undefined || node === false || node === true)
        return '';

    if (typeof node !== 'object')
        return String(node);

    return text(node.children);
}

const { default: PanelIssueComments } = await load('IssueComments.js');

/* ****************************************************************
 * データ
 * **************************************************************** */

const T1 = '2026-11-01T12:00:00Z';
const T2 = '2026-11-01T13:30:00Z';

const author = { __typename: 'User', id: 'U_1', login: 'octocat', name: 'Octo Cat', url: 'https://example.test/octocat', avatarUrl: 'x', updatedAt: T1 };

const commentNode = (id, body, at)=> ({
    __typename: 'IssueComment', id, url: `https://example.test/c/${id}`,
    body, bodyHTML: `<p>${body}</p>`,
    createdAt: at, publishedAt: at, updatedAt: at,
    author,
});

function comments (n=1) {
    const sogh = new Sogh();

    return [
        sogh.node2issueComment(commentNode('IC_1', 'first comment', T2)),
        sogh.node2issueComment(commentNode('IC_2', 'second comment', T1)),
    ].slice(0, n);
}

// 利用側の関数を、呼ばれた順に覚える。names に無い関数は、渡さない。
function recorder (names=['change', 'update', 'delete']) {
    const calls = [];
    const comment = {};

    for (const name of names)
        comment[name] = (...args)=> calls.push([name, args]);

    return { calls, actions: { issue: { comment } } };
}

const draw = (props)=> render(React.createElement(PanelIssueComments, props));

// 出ているボタンの文字。(上から順に)
const buttons = (tree)=> walk(tree).filter(n=> n.type === 'Button').map(n=> text(n));

const button = (tree, label, nth=0)=> walk(tree).filter(n=> n.type === 'Button' && text(n) === label)[nth];

// 書いた人。(アイコンの title に、名前が出る)
const authors = (tree)=> walk(tree).filter(n=> n.props && n.props.title === 'Octo Cat');

// 本文 (bodyHTML) が出ているか。
const bodies = (tree)=> walk(tree).filter(n=> n.props && n.props.dangerouslySetInnerHTML).map(n=> n.props.dangerouslySetInnerHTML.__html);

/* ****************************************************************
 * 渡されていないとき (落ちない・読むだけ)
 * **************************************************************** */

test('comments だけを渡しても落ちない。本文・書いた人・日時が出て、ボタンは出ない', ()=> {
    const tree = draw({ comments: comments(2) });

    assert.deepEqual(buttons(tree), []);

    const all = text(tree);

    assert.deepEqual(bodies(tree), ['<p>first comment</p>', '<p>second comment</p>'], '本文');
    assert.equal(authors(tree).length, 2, '書いた人');
    assert.ok(/2026-11-0[12] /.test(all), '日時'); // 時差で、日がずれることがある

    // 編集の欄は、出ない。
    assert.equal(walk(tree).some(n=> n.type === 'MDEditor'), false);
});

test('edit_contents だけを足しても落ちない。ボタンは出ず、編集の欄も出ない', ()=> {
    for (const edit_contents of [{}, { IC_1: { id: 'IC_1', value: 'draft', mode: 'edit' } }, { IC_1: { id: 'IC_1', value: 'x', mode: 'delete' } }]) {
        const tree = draw({ comments: comments(1), edit_contents });

        assert.deepEqual(buttons(tree), [], JSON.stringify(edit_contents));
        assert.equal(walk(tree).some(n=> n.type === 'MDEditor'), false, JSON.stringify(edit_contents));
    }
});

test('actions のどの段が無くても、関数でないものが入っていても、落ちない。ボタンは出ない', ()=> {
    const cases = [
        null,
        undefined,
        {},
        { issue: null },
        { issue: {} },
        { issue: { comment: null } },
        { issue: { comment: {} } },
        { issue: { comment: { change: null, update: null, delete: null } } },
        { issue: { comment: { change: 'x', update: 1, delete: {} } } },
    ];

    for (const actions of cases) {
        for (const edit_contents of [undefined, {}]) {
            const label = JSON.stringify({ actions, edit_contents });

            let tree;

            assert.doesNotThrow(()=> { tree = draw({ comments: comments(2), actions, edit_contents }); }, label);
            assert.deepEqual(buttons(tree), [], label);
            assert.equal(authors(tree).length, 2, label);
        }
    }
});

test('コメントが 0 個のとき・comments が無いときも、落ちない', ()=> {
    for (const props of [{}, { comments: [] }, { comments: null }, { comments: [], actions: recorder().actions, edit_contents: {} }])
        assert.doesNotThrow(()=> draw(props), JSON.stringify(props));
});

/* ****************************************************************
 * 渡した関数の組み合わせごとに、出るボタン
 * **************************************************************** */

test('渡した関数の組み合わせごとに、出るボタン', ()=> {
    const cases = [
        [[],                              []],
        [['change'],                      []],
        [['update'],                      []],
        [['delete'],                      []],
        [['update', 'delete'],            []],
        [['change', 'update'],            ['Edit']],
        [['change', 'delete'],            ['Delete']],
        [['change', 'update', 'delete'],  ['Edit', 'Delete']],
    ];

    for (const [names, expected] of cases) {
        const tree = draw({ comments: comments(1), actions: recorder(names).actions, edit_contents: {} });

        assert.deepEqual(buttons(tree), expected, names.join(','));
    }
});

test('編集中・削除の確かめ中も、そのボタンが出せるときだけ出す', ()=> {
    const editing = { IC_1: { id: 'IC_1', value: 'draft', mode: 'edit' } };
    const deleting = { IC_1: { id: 'IC_1', value: 'first comment', mode: 'delete' } };

    // 更新だけ: 編集中は Cancel・Commit。削除の確かめ (mode が delete) は、ふつうの表示にもどる。
    assert.deepEqual(buttons(draw({ comments: comments(1), actions: recorder(['change', 'update']).actions, edit_contents: editing })), ['Cancel', 'Commit']);
    assert.deepEqual(buttons(draw({ comments: comments(1), actions: recorder(['change', 'update']).actions, edit_contents: deleting })), ['Edit']);

    // 削除だけ: 確かめ中は Delete・Cancel。編集中 (mode が edit) は、ふつうの表示にもどり、編集の欄も出ない。
    assert.deepEqual(buttons(draw({ comments: comments(1), actions: recorder(['change', 'delete']).actions, edit_contents: deleting })), ['Delete', 'Cancel']);

    const tree = draw({ comments: comments(1), actions: recorder(['change', 'delete']).actions, edit_contents: editing });

    assert.deepEqual(buttons(tree), ['Delete']);
    assert.equal(walk(tree).some(n=> n.type === 'MDEditor'), false);
});

/* ****************************************************************
 * 3 つとも渡したとき (いままでどおり)
 * **************************************************************** */

test('3 つとも渡したとき: Edit で、change が、新しい edit_contents で呼ばれる。編集の欄が開く', ()=> {
    const { calls, actions } = recorder();
    const edit_contents = {};

    const tree = draw({ comments: comments(1), actions, edit_contents });

    assert.deepEqual(buttons(tree), ['Edit', 'Delete']);

    button(tree, 'Edit').props.onClick();

    assert.deepEqual(calls, [['change', [{ IC_1: { id: 'IC_1', value: 'first comment', mode: 'edit' } }]]]);

    // 渡した edit_contents は、変えない。(写しを渡す)
    assert.deepEqual(edit_contents, {});

    // 利用側が、新しい edit_contents を渡して描き直すと、編集の欄が開く。
    const opened = draw({ comments: comments(1), actions, edit_contents: calls[0][1][0] });

    assert.deepEqual(buttons(opened), ['Cancel', 'Commit', 'Delete']);

    const editor = walk(opened).find(n=> n.type === 'MDEditor');

    assert.ok(editor);
    assert.equal(editor.props.value, 'first comment');

    // 書くと、change が、値を変えた edit_contents で呼ばれる。
    editor.props.onChange('edited');

    assert.deepEqual(calls.at(-1), ['change', [{ IC_1: { id: 'IC_1', value: 'edited', mode: 'edit' } }]]);

    // Cancel で、mode が view にもどる。
    button(opened, 'Cancel').props.onClick();

    assert.deepEqual(calls.at(-1), ['change', [{ IC_1: { id: 'IC_1', value: 'first comment', mode: 'view' } }]]);
});

test('3 つとも渡したとき: Commit で update(コメントの id, 本文) を呼ぶ', ()=> {
    const { calls, actions } = recorder();
    const edit_contents = { IC_1: { id: 'IC_1', value: 'edited body', mode: 'edit' } };

    const tree = draw({ comments: comments(1), actions, edit_contents });

    button(tree, 'Commit').props.onClick();

    assert.deepEqual(calls, [['update', ['IC_1', 'edited body']]]);
});

test('3 つとも渡したとき: Delete の確かめのあと、delete(コメントの id) を呼ぶ', ()=> {
    const { calls, actions } = recorder();

    const tree = draw({ comments: comments(1), actions, edit_contents: {} });

    button(tree, 'Delete').props.onClick();

    assert.deepEqual(calls, [['change', [{ IC_1: { id: 'IC_1', value: 'first comment', mode: 'delete' } }]]]);

    const confirming = draw({ comments: comments(1), actions, edit_contents: calls[0][1][0] });

    assert.deepEqual(buttons(confirming), ['Edit', 'Delete', 'Cancel']);

    button(confirming, 'Delete').props.onClick();

    assert.deepEqual(calls.at(-1), ['delete', ['IC_1']]);

    // 確かめの Cancel で、mode が view にもどる。
    button(confirming, 'Cancel').props.onClick();

    assert.deepEqual(calls.at(-1), ['change', [{ IC_1: { id: 'IC_1', value: 'first comment', mode: 'view' } }]]);
});

test('3 つとも渡したとき: コメントが 2 個なら、それぞれに Edit と Delete が出る', ()=> {
    const tree = draw({ comments: comments(2), actions: recorder().actions, edit_contents: {} });

    assert.deepEqual(buttons(tree), ['Edit', 'Delete', 'Edit', 'Delete']);
});
