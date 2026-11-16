// コメントの編集の欄のテスト。(yanqirenshi/SOGH.next#123・yanqirenshi/SOGH.next#124)
//   - Edit を押したとき (mode を edit にするとき) は、いまのコメントの本文で、中身 (value) を作り直してから、change を呼ぶ。(#123)
//       取り直して本文が変わったあとの Edit では、新しい本文が入る。
//       書きかけて Cancel したあとの Edit では、書きかけは残らず、いまの本文が入る。
//   - 編集中に書いた文字は、change で利用側に渡り、描き直すと出て、Commit で update(コメントの id, 書いた本文) が呼ばれる。(いままでどおり)
//   - 渡した edit_contents そのものは、書き換えない。ほかのコメントの中身も、変えない。
//   - update・delete は、actions.issue.comment の持ち物として呼ぶ。(関数の中の this が actions.issue.comment。#124 の直し)
//
// 動かし方:
//   npm test
//
// 部品の読み方は、test/issue-comments.test.mjs と同じ。(本物の部品を、偽の React で描く。MUI と MDEditor は名前だけの偽物。moment と luxon は本物)
// 利用側 (edit_contents を持ち、change で受け取ったものに差し替えて、描き直す) も、このテストの中で作る。

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
 * データと、利用側
 * **************************************************************** */

const T1 = '2026-11-01T12:00:00Z';
const T2 = '2026-11-01T13:30:00Z';
const T3 = '2026-11-02T08:00:00Z';

const author = { __typename: 'User', id: 'U_1', login: 'octocat', name: 'Octo Cat', url: 'https://example.test/octocat', avatarUrl: 'x', updatedAt: T1 };

const commentNode = (id, body, at)=> ({
    __typename: 'IssueComment', id, url: `https://example.test/c/${id}`,
    body, bodyHTML: body === null ? null : `<p>${body}</p>`,
    createdAt: T1, publishedAt: T1, updatedAt: at,
    author,
});

// 深く凍らせる。(部品が、渡した edit_contents を書き換えると、strict mode のモジュールの中で TypeError になる)
function freeze (v) {
    if (v && typeof v === 'object') {
        Object.values(v).forEach(freeze);
        Object.freeze(v);
    }

    return v;
}

// 利用側。edit_contents を持ち、change で受け取ったものに差し替える。update・delete は、呼ばれた引数と this を覚える。
function host (comments, edit_contents={}) {
    const state = {
        edit_contents: freeze(edit_contents),
        changes: [],
        calls: [],
    };

    const comment_actions = {
        change (new_edit_contents) {
            state.changes.push(new_edit_contents);
            state.edit_contents = freeze(new_edit_contents);
        },
        update (...args) {
            state.calls.push(['update', args, this]);
        },
        delete (...args) {
            state.calls.push(['delete', args, this]);
        },
    };

    const actions = { issue: { comment: comment_actions } };

    // いまの edit_contents で描く。
    state.draw = ()=> render(React.createElement(PanelIssueComments, { comments, actions, edit_contents: state.edit_contents }));

    // ボタンを押す。(描いて、label の nth 番目のボタンを押す)
    state.click = (label, nth=0)=> {
        const target = walk(state.draw()).filter(n=> n.type === 'Button' && text(n) === label)[nth];

        assert.ok(target, `ボタン ${label} (${nth})`);

        target.props.onClick();
    };

    // 編集の欄に書く。
    state.type = (value, nth=0)=> {
        const editor = walk(state.draw()).filter(n=> n.type === 'MDEditor')[nth];

        assert.ok(editor, '編集の欄');

        editor.props.onChange(value);
    };

    // 編集の欄に出ている値。(nth 番目の欄)
    state.editorValue = (nth=0)=> {
        const editor = walk(state.draw()).filter(n=> n.type === 'MDEditor')[nth];

        return editor ? editor.props.value : undefined;
    };

    state.actions = actions;

    return state;
}

/* ****************************************************************
 * Edit で、中身を作り直す (yanqirenshi/SOGH.next#123)
 * **************************************************************** */

test('コメントを取り直して本文が変わったあとの Edit で、新しい本文が入る', ()=> {
    const sogh = new Sogh();
    const comment = sogh.node2issueComment(commentNode('IC_1', 'old body', T1));
    const h = host([comment]);

    h.click('Edit');
    assert.equal(h.editorValue(), 'old body');

    h.click('Cancel');
    assert.equal(h.editorValue(), undefined, 'Cancel で、編集の欄は閉じる');

    // 取り直す。(同じ id のモデルの、本文が変わる)
    const again = sogh.node2issueComment(commentNode('IC_1', 'new body', T3));

    assert.equal(again, comment, '同じモデル');
    assert.equal(comment.body(), 'new body');

    h.click('Edit');

    assert.equal(h.editorValue(), 'new body');
    assert.deepEqual(h.changes.at(-1), { IC_1: { id: 'IC_1', value: 'new body', mode: 'edit' } });
});

test('利用側の edit_contents に古い中身が残っていても、Edit で、いまの本文が入る', ()=> {
    const sogh = new Sogh();
    const comment = sogh.node2issueComment(commentNode('IC_1', 'current body', T1));

    for (const mode of ['view', 'delete']) {
        const h = host([comment], { IC_1: { id: 'IC_1', value: 'stale body', mode } });

        h.click('Edit');

        assert.deepEqual(h.changes, [{ IC_1: { id: 'IC_1', value: 'current body', mode: 'edit' } }], mode);
        assert.equal(h.editorValue(), 'current body', mode);
    }
});

test('書きかけて Cancel したあとの Edit で、書きかけは残らず、いまの本文が入る', ()=> {
    const sogh = new Sogh();
    const h = host([sogh.node2issueComment(commentNode('IC_1', 'current body', T1))]);

    h.click('Edit');
    h.type('draft text');

    assert.equal(h.editorValue(), 'draft text');

    h.click('Cancel');
    h.click('Edit');

    assert.equal(h.editorValue(), 'current body');
    assert.deepEqual(h.calls, [], 'update も delete も、呼ばれない');
});

test('編集中に書いた文字は残り、Commit で update(コメントの id, 書いた本文) が呼ばれる', ()=> {
    const sogh = new Sogh();
    const h = host([sogh.node2issueComment(commentNode('IC_1', 'current body', T1))]);

    h.click('Edit');
    h.type('typed 1');
    h.type('typed 1 and 2');

    // change で利用側に渡り、描き直すと出る。
    assert.deepEqual(h.changes.at(-1), { IC_1: { id: 'IC_1', value: 'typed 1 and 2', mode: 'edit' } });
    assert.equal(h.editorValue(), 'typed 1 and 2');

    h.click('Commit');

    assert.deepEqual(h.calls.map(([name, args])=> [name, args]), [['update', ['IC_1', 'typed 1 and 2']]]);
});

test('Delete の確かめ → Cancel → Edit でも、いまの本文が入る。確かめと Cancel の動きは、いままでどおり', ()=> {
    const sogh = new Sogh();
    const comment = sogh.node2issueComment(commentNode('IC_1', 'old body', T1));
    const h = host([comment]);

    h.click('Delete');
    assert.deepEqual(h.changes.at(-1), { IC_1: { id: 'IC_1', value: 'old body', mode: 'delete' } });

    // 確かめの Cancel。(ボタンは Edit・Delete・Cancel の順)
    h.click('Cancel');
    assert.deepEqual(h.changes.at(-1), { IC_1: { id: 'IC_1', value: 'old body', mode: 'view' } });

    // 取り直して、本文が変わる。
    sogh.node2issueComment(commentNode('IC_1', 'new body', T3));

    h.click('Edit');

    assert.equal(h.editorValue(), 'new body');
    assert.deepEqual(h.calls, []);
});

test('渡した edit_contents は、書き換わらない (写しを作って渡す)', ()=> {
    const sogh = new Sogh();
    const comments = [
        sogh.node2issueComment(commentNode('IC_1', 'first', T2)),
        sogh.node2issueComment(commentNode('IC_2', 'second', T1)),
    ];

    const given = { IC_1: { id: 'IC_1', value: 'stale', mode: 'view' }, IC_2: { id: 'IC_2', value: 'draft 2', mode: 'edit' } };
    const snapshot = JSON.parse(JSON.stringify(given));

    // 凍らせて渡すので、書き換えようとすると落ちる。
    const h = host(comments, given);

    assert.doesNotThrow(()=> h.click('Edit'));
    assert.notEqual(h.changes[0], given);
    assert.deepEqual(given, snapshot);

    // 編集中の欄に書く・Cancel・Delete も、渡したものを書き換えない。
    const before = h.edit_contents;
    const before_snapshot = JSON.parse(JSON.stringify(before));

    assert.doesNotThrow(()=> h.type('typed'));
    assert.doesNotThrow(()=> h.click('Cancel'));
    assert.doesNotThrow(()=> h.click('Delete'));

    assert.deepEqual(before, before_snapshot);
    assert.deepEqual(given, snapshot);
});

test('コメントが 2 個のとき、片方の Edit は、もう片方の中身を変えない', ()=> {
    const sogh = new Sogh();
    const comments = [
        sogh.node2issueComment(commentNode('IC_1', 'first', T2)),
        sogh.node2issueComment(commentNode('IC_2', 'second', T1)),
    ];

    // 2 個めは、書きかけの編集中。
    const h = host(comments, { IC_2: { id: 'IC_2', value: 'draft 2', mode: 'edit' } });

    // 1 個めの Edit。(2 個めは編集中なので、Edit のボタンは 1 個めのものだけ)
    h.click('Edit', 0);

    assert.deepEqual(h.changes.at(-1), {
        IC_1: { id: 'IC_1', value: 'first', mode: 'edit' },
        IC_2: { id: 'IC_2', value: 'draft 2', mode: 'edit' },
    });

    assert.equal(h.editorValue(0), 'first');
    assert.equal(h.editorValue(1), 'draft 2');

    // 1 個めに書いても、2 個めは変わらない。
    h.type('first edited', 0);

    assert.deepEqual(h.edit_contents.IC_2, { id: 'IC_2', value: 'draft 2', mode: 'edit' });
    assert.equal(h.edit_contents.IC_1.value, 'first edited');
});

test('本文が null のコメントの Edit では、空の文字が入る', ()=> {
    const sogh = new Sogh();
    const comment = sogh.node2issueComment(commentNode('IC_1', null, T1));

    assert.equal(comment.body(), null);

    const h = host([comment], { IC_1: { id: 'IC_1', value: 'stale', mode: 'view' } });

    h.click('Edit');

    assert.deepEqual(h.changes.at(-1), { IC_1: { id: 'IC_1', value: '', mode: 'edit' } });
    assert.equal(h.editorValue(), '');
});

/* ****************************************************************
 * update・delete の this (yanqirenshi/SOGH.next#124 の直し)
 * **************************************************************** */

test('update・delete は、actions.issue.comment の持ち物として呼ぶ (this が actions.issue.comment)', ()=> {
    const sogh = new Sogh();
    const h = host([sogh.node2issueComment(commentNode('IC_1', 'body', T1))]);

    h.click('Edit');
    h.click('Commit');

    h.click('Cancel');
    h.click('Delete');
    h.click('Delete'); // 確かめの Delete

    assert.deepEqual(h.calls.map(([name, args])=> [name, args]), [['update', ['IC_1', 'body']], ['delete', ['IC_1']]]);

    for (const [name, , self] of h.calls)
        assert.equal(self, h.actions.issue.comment, name);
});

test('update・delete が this を使う利用側の関数でも、動く', ()=> {
    const sogh = new Sogh();
    const comments = [sogh.node2issueComment(commentNode('IC_1', 'body', T1))];

    const log = [];

    // this で、同じ持ち物のほかの値を読む利用側。
    const comment_actions = {
        prefix: 'via-this',
        change () {},
        update (id, body) { log.push(`${this.prefix}:update:${id}:${body}`); },
        delete (id) { log.push(`${this.prefix}:delete:${id}`); },
    };

    const draw = (edit_contents)=> render(React.createElement(PanelIssueComments, { comments, actions: { issue: { comment: comment_actions } }, edit_contents }));

    const press = (tree, label)=> walk(tree).find(n=> n.type === 'Button' && text(n) === label).props.onClick();

    press(draw({ IC_1: { id: 'IC_1', value: 'written', mode: 'edit' } }), 'Commit');
    press(draw({ IC_1: { id: 'IC_1', value: 'body', mode: 'delete' } }), 'Delete');

    assert.deepEqual(log, ['via-this:update:IC_1:written', 'via-this:delete:IC_1']);
});
