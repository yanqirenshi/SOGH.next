// Issue の本文を書き換える。(yanqirenshi/SOGH.next#119)
//   - クエリ update_issue_body: mutation で、値は variables。戻りの Issue は、issue_by_id と同じ項目で、projectItems は取らない。
//   - Sogh の asyncUpdateIssueBody(id, body): Issue の id を返し (asyncFetchIssueByID と同じ)、Pool の本文が変わる。
//     Pool に projectItems を持つ同じ Issue があるときは、projectItems (と、そこから引く Item・日付) は、消えない。
//     失敗したときは、GitHubError を投げる。
//   - 本文の所 (Issue/FirstComment.js): 削除のボタンが無く、Commit で actions.issue.description.update(id, 本文) を呼ぶ。
//     actions.issue.comment.update・delete は、呼ばない。Edit を押すと、いまの本文が編集の欄に入る。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの fetch (test/fake-fetch.mjs) を使う。
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換し、src/components の部品は本物を読む。
// React は createElement と useState だけを持つ偽物に、MUI などは名前だけの偽物に差し替える。
// 描くときは、関数の部品を呼んで、{ type, props, children } の木にする。(DOM は作らない)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { transformSync } from '@babel/core';

import Sogh from '../src/js/Sogh.js';
import { GitHubError } from '../src/js/Loader.js';
import * as queries from '../src/js/queries/index.js';
import { fakeFetch, withFetch } from './fake-fetch.mjs';

const T1 = '2026-11-01T09:00:00Z';
const T2 = '2026-11-02T09:00:00Z';

/* ****************************************************************
 * データ
 * **************************************************************** */

// Item を持つ Issue。(issue_by_org_repo_issue_number などで取ったもの。projectItems がある)
function projectItems () {
    return {
        edges: [ { node: {
            __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1,
            project: { __typename: 'ProjectV2', id: 'PVT_1', number: 1, title: 'p', updatedAt: T1 },
            fieldValues: { nodes: [
                { __typename: 'ProjectV2ItemFieldDateValue', date: '2026-11-20', field: { name: 'Due.Date', dataType: 'DATE' } },
                { __typename: 'ProjectV2ItemFieldDateValue', date: '2026-11-05', field: { name: 'NextAction.Date', dataType: 'DATE' } },
            ] },
        } } ],
    };
}

const issueNode = (patch={})=> ({
    __typename: 'Issue', id: 'I_1', number: 7, title: '題名', url: 'https://example.test/i/7', state: 'OPEN',
    body: 'もとの本文', bodyHTML: '<p>もとの本文</p>', updatedAt: T1,
    ...patch,
});

// updateIssue の応答。(projectItems は、無い)
const updateResponse = (patch={})=> ({
    json: { data: { updateIssue: { issue: issueNode({ body: '新しい本文', bodyHTML: '<p>新しい本文</p>', updatedAt: T2, ...patch }) } } },
});

const withItems = ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue(issueNode({ projectItems: projectItems() }));

    return { sogh, issue };
};

/* ****************************************************************
 * クエリ
 * **************************************************************** */

test('update_issue_body は mutation で、値は variables ($id: ID!・$body: String!)。updateIssue の issue を取り出す', ()=> {
    const { query, pick } = queries.update_issue_body;

    assert.match(query, /^mutation \(\$id: ID!, \$body: String!\) \{/);
    assert.match(query, /updateIssue\(input: \{id: \$id, body: \$body\}\) \{\s*issue \{/);
    assert.equal(/@[a-z]/.test(query), false);

    const issue = { id: 'I_1' };

    assert.equal(pick({ updateIssue: { issue } }), issue);

    // sogh から、名前で引ける。
    const sogh = new Sogh();

    assert.equal(sogh.query('update_issue_body'), query);
    assert.equal(sogh.queryDefinition('update_issue_body'), queries.update_issue_body);
});

test('update_issue_body が取る Issue の項目は、issue_by_id と同じ。projectItems は取らない', ()=> {
    const norm = (q)=> q.replace(/\s+/g, ' ').trim();

    const inner = (q, re)=> norm(q).match(re)[1];

    const by_id = inner(queries.issue_by_id.query, /\.\.\. on Issue \{ (.*) \} \} \}$/);
    const updated = inner(queries.update_issue_body.query, /issue \{ (.*) \} \} \}$/);

    assert.equal(updated, by_id);
    assert.equal(updated.includes('projectItems'), false);
    assert.equal(updated.includes('bodyHTML'), true);
});

/* ****************************************************************
 * asyncUpdateIssueBody
 * **************************************************************** */

test('asyncUpdateIssueBody(id, body): Issue の id を返し、Pool の本文が変わる', async ()=> {
    const { sogh, issue } = withItems();

    const fake = fakeFetch([updateResponse()]);

    const result = await withFetch(fake, ()=> sogh.asyncUpdateIssueBody('I_1', '新しい本文'));

    // 送ったもの: 1 回だけ。mutation で、値は variables。
    assert.equal(fake.requests.length, 1);
    assert.match(fake.requests[0].query, /^mutation /);
    assert.deepEqual(fake.requests[0].variables, { id: 'I_1', body: '新しい本文' });

    // 返すもの: Issue の id。(モデルではない。asyncFetchIssueByID と同じ)
    assert.equal(result, 'I_1');
    assert.equal(typeof result, 'string');

    // モデルは、id で Pool から引く。
    assert.equal(sogh.issue(result), issue);

    // Pool の本文が変わる。
    assert.equal(sogh.issue(result).body(), '新しい本文');
    assert.equal(sogh.issue(result).bodyHTML(), '<p>新しい本文</p>');
    assert.equal(sogh.issue(result).updatedAt(), T2);
});

test('asyncUpdateIssueBody: Pool に無い Issue は、モデルにして Pool に入る', async ()=> {
    const sogh = new Sogh();

    const result = await withFetch(fakeFetch([updateResponse()]), ()=> sogh.asyncUpdateIssueBody('I_1', '新しい本文'));

    assert.equal(result, 'I_1');
    assert.equal(sogh.issue(result).id(), 'I_1');
    assert.equal(sogh.issue(result).body(), '新しい本文');
});

test('asyncUpdateIssueBody: Pool の Issue の projectItems (と、そこから引く Item・日付) は、書き換えのあとも消えない', async ()=> {
    const { sogh, issue } = withItems();

    // 書き換える前に、読めること。
    assert.deepEqual(issue.projectV2Items().map(d=> d.id()), ['PVTI_1']);
    assert.equal(issue.dueDate(), '2026-11-20');
    assert.equal(issue.nextActionDate(), '2026-11-05');

    await withFetch(fakeFetch([updateResponse()]), ()=> sogh.asyncUpdateIssueBody('I_1', '新しい本文'));

    assert.equal(issue.body(), '新しい本文');
    assert.deepEqual(issue.projectV2Items().map(d=> d.id()), ['PVTI_1']);
    assert.equal(issue.projectV2().id(), 'PVT_1');
    assert.equal(issue.dueDate(), '2026-11-20');
    assert.equal(issue.nextActionDate(), '2026-11-05');
    assert.equal(Boolean(issue.core().projectItems), true);
});

test('asyncUpdateIssueBody: 戻りの updatedAt が、手元と同じでも、projectItems は消えない', async ()=> {
    const { sogh, issue } = withItems();

    await withFetch(fakeFetch([updateResponse({ updatedAt: T1 })]), ()=> sogh.asyncUpdateIssueBody('I_1', 'もとの本文'));

    assert.deepEqual(issue.projectV2Items().map(d=> d.id()), ['PVTI_1']);
    assert.equal(issue.dueDate(), '2026-11-20');
});

test('asyncUpdateIssueBody: 本文のほかの項目 (題名・番号) は、そのまま', async ()=> {
    const { sogh, issue } = withItems();

    await withFetch(fakeFetch([updateResponse()]), ()=> sogh.asyncUpdateIssueBody('I_1', '新しい本文'));

    assert.equal(issue.title(), '題名');
    assert.equal(issue.number(), 7);
});

test('asyncUpdateIssueBody: 失敗したら (GraphQL のエラー・HTTP のエラー・つながらない)、GitHubError を投げ、Pool の本文は変わらない', async ()=> {
    const errors = [{ message: 'Could not resolve to an Issue' }];

    for (const page of [{ json: { errors } }, { status: 401 }, { throws: new TypeError('fetch failed') }]) {
        const { sogh, issue } = withItems();

        await assert.rejects(withFetch(fakeFetch([page]), ()=> sogh.asyncUpdateIssueBody('I_1', '新しい本文')), (e)=> {
            assert.ok(e instanceof GitHubError);
            return true;
        });

        assert.equal(issue.body(), 'もとの本文');
    }
});

test('asyncUpdateIssueBody: 応答に issue が無い (null) ときも、GitHubError を投げる', async ()=> {
    const { sogh, issue } = withItems();

    await assert.rejects(
        withFetch(fakeFetch([{ json: { data: { updateIssue: { issue: null } } } }]), ()=> sogh.asyncUpdateIssueBody('I_1', 'x')),
        GitHubError);

    assert.equal(issue.body(), 'もとの本文');
});

test('本文を書き換えるメソッドは Promise の形で、コメントの追加・更新・削除 (asyncCreateIssueComment など) も、同じ形', ()=> {
    const sogh = new Sogh();

    for (const name of ['asyncUpdateIssueBody', 'asyncCreateIssueComment', 'asyncUpdateIssueComment', 'asyncDeleteIssueComment']) {
        assert.equal(typeof sogh[name], 'function', name);
        assert.equal(sogh[name].constructor.name, 'AsyncFunction', name);
    }

    // callbacks の形の古い名前は、無い。(yanqirenshi/SOGH.next#122)
    for (const name of ['updateIssueComment', 'createIssueComment', 'deleteIssueComment'])
        assert.equal(name in sogh, false, name);
});

/* ****************************************************************
 * 部品を読むしくみ (偽の React・MUI)
 * **************************************************************** */

const REACT_SRC = `
let hooks = [];
let index = 0;
export function __begin () { index = 0; }
export function __clear () { hooks = []; index = 0; }
export const createElement = (type, props, ...children)=> ({ type, props: props || {}, children });
export const useState = (init)=> {
    const i = index++;
    if (!(i in hooks)) hooks[i] = init;
    return [hooks[i], (v)=> { hooks[i] = v; }];
};
export const Fragment = 'Fragment';
export default { createElement, useState, Fragment };
`;

const data = (src)=> 'data:text/javascript;base64,' + Buffer.from(src).toString('base64');

const REACT_URL = data(REACT_SRC);

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

    const replaced = code.replace(/import\s+([^'"]+?)\s+from\s+['"]([^'"]+)['"]/g, (_all, clause, from)=> {
        if (from === 'react')
            return `import ${clause} from '${REACT_URL}'`;

        if (from.startsWith('.'))
            return `import ${clause} from '${urlOf(new URL(from, fileUrl))}'`;

        return `import ${clause} from '${NAME_STUB(from.split('/').pop())}'`;
    });

    const url = data(replaced);

    urls.set(key, url);

    return url;
}

const React = await import(REACT_URL);

const { default: FirstComment } = await import(urlOf(new URL('Issue/FirstComment.js', SRC)));

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
    React.__begin();

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
 * 本文の所 (Issue/FirstComment.js)
 * **************************************************************** */

// 呼ばれた関数を、順に覚える actions。
function makeActions () {
    const calls = [];

    const spy = (name)=> (...args)=> { calls.push([name, ...args]); };

    return {
        calls,
        issue: {
            description: { update: spy('description.update') },
            comment: { update: spy('comment.update'), delete: spy('comment.delete') },
        },
    };
}

const buttons = (tree)=> walk(tree).filter(n=> n.type === 'Button');
const buttonLabels = (tree)=> buttons(tree).map(text).map(s=> s.trim());
const click = (tree, label)=> buttons(tree).find(b=> text(b).trim() === label).props.onClick();
const editor = (tree)=> walk(tree).find(n=> n.type === 'react-md-editor');

function start (issue, actions) {
    React.__clear();

    const element = React.createElement(FirstComment, { issue, actions });

    return { element, draw: ()=> draw(element) };
}

test('本文の所: 更新 (Edit・Commit・Cancel) だけで、削除のボタンが無い', ()=> {
    const { issue } = withItems();
    const view = start(issue, makeActions());

    let tree = view.draw();

    assert.deepEqual(buttonLabels(tree), ['Edit']);
    assert.equal(editor(tree), undefined);

    click(tree, 'Edit');

    tree = view.draw();

    assert.deepEqual(buttonLabels(tree), ['Cancel', 'Commit']);
    assert.equal(buttonLabels(tree).includes('Delete'), false);
    assert.equal(walk(tree).some(n=> /Delete|delete/.test(text(n))), false);
});

test('本文の所: Commit で actions.issue.description.update(Issue の id, 書いた本文) を呼ぶ。comment の update・delete は呼ばない', ()=> {
    const { issue } = withItems();
    const actions = makeActions();
    const view = start(issue, actions);

    click(view.draw(), 'Edit');

    let tree = view.draw();

    assert.equal(editor(tree).props.value, 'もとの本文');

    editor(tree).props.onChange('書いた本文');

    tree = view.draw();

    assert.equal(editor(tree).props.value, '書いた本文');

    click(tree, 'Commit');

    assert.deepEqual(actions.calls, [['description.update', 'I_1', '書いた本文']]);
    assert.equal(actions.calls.some(c=> c[0] === 'comment.update' || c[0] === 'comment.delete'), false);

    // Commit のあと、表示に戻る。
    assert.deepEqual(buttonLabels(view.draw()), ['Edit']);
});

test('本文の所: 書き換えずに Commit すると、いまの本文を送る。本文が空の Issue でも、文字列 (空) を送る', ()=> {
    const actions = makeActions();

    const { issue } = withItems();
    const view = start(issue, actions);

    click(view.draw(), 'Edit');
    click(view.draw(), 'Commit');

    assert.deepEqual(actions.calls, [['description.update', 'I_1', 'もとの本文']]);

    // 本文が無い (null) Issue。
    const sogh = new Sogh();
    const empty = sogh.node2issue(issueNode({ id: 'I_2', body: null, bodyHTML: '' }));
    const actions2 = makeActions();
    const view2 = start(empty, actions2);

    click(view2.draw(), 'Edit');
    assert.equal(editor(view2.draw()).props.value, '');
    click(view2.draw(), 'Commit');

    assert.deepEqual(actions2.calls, [['description.update', 'I_2', '']]);
});

test('本文の所: Edit を押すと、いまの本文が入る。(Issue を取り直して本文が変わったあと)', async ()=> {
    const { sogh, issue } = withItems();
    const view = start(issue, makeActions());

    // 初めの描き。(本文は、もとの本文)
    view.draw();

    // 取り直して、本文が変わる。
    sogh.node2issue(issueNode({ body: '取り直した本文', bodyHTML: '<p>取り直した本文</p>', updatedAt: T2, projectItems: projectItems() }));

    assert.equal(issue.body(), '取り直した本文');

    click(view.draw(), 'Edit');

    assert.equal(editor(view.draw()).props.value, '取り直した本文');
});

test('本文の所: 書きかけて Cancel したあと、もう一度 Edit を押すと、書きかけは残らず、いまの本文が出る', ()=> {
    const { issue } = withItems();
    const actions = makeActions();
    const view = start(issue, actions);

    click(view.draw(), 'Edit');

    editor(view.draw()).props.onChange('書きかけ');

    assert.equal(editor(view.draw()).props.value, '書きかけ');

    click(view.draw(), 'Cancel');

    assert.deepEqual(buttonLabels(view.draw()), ['Edit']);

    click(view.draw(), 'Edit');

    assert.equal(editor(view.draw()).props.value, 'もとの本文');
    assert.deepEqual(actions.calls, []);
});

test('本文の所: 表示は、本文の HTML。空のときは、空だと伝える', ()=> {
    const { issue } = withItems();

    const tree = start(issue, makeActions()).draw();

    assert.equal(walk(tree).some(n=> n.type === 'div' && n.props.dangerouslySetInnerHTML.__html === '<p>もとの本文</p>'), true);

    const empty = new Sogh().node2issue(issueNode({ id: 'I_3', body: '', bodyHTML: '' }));

    assert.match(text(start(empty, makeActions()).draw()), /First Comment は空です/);
});

test('コメントの所 (IssueComment.js) は、これまでどおり、comment の update・delete を呼ぶ', ()=> {
    const src = fs.readFileSync(new URL('IssueComment.js', SRC), 'utf8');

    // commentActionsOf(actions) は actions.issue.comment。(呼び方と this は、test/issue-comments.test.mjs・test/issue-comment-edit.test.mjs が見る。yanqirenshi/SOGH.next#124)
    assert.match(src, /commentActionsOf\(actions\)\.update\(comment_id, value\)/);
    assert.match(src, /commentActionsOf\(actions\)\.delete\(comment_id\)/);

    const first = fs.readFileSync(new URL('Issue/FirstComment.js', SRC), 'utf8');

    assert.equal(/OperatorDelete|comment\.delete|comment\.update/.test(first), false);
    assert.match(first, /actions\.issue\.description\.update\(issue\.id\(\), /);
});
