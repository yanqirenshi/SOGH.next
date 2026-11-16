// Issue の画面の部品 (PanelIssue = src/components/Issue.js) のテスト。(yanqirenshi/SOGH.next#114)
//   - プロジェクトの情報が無いとき (projectItems の無い Issue・Item を Pool から消したあと) も、落ちずに描ける。(副題のプロジェクトの所を出さない)
//   - item (ProjectV2Item のモデル) を渡したときは、副題のプロジェクトと、期限・次の行動の日を、その Item から読む。
//   - item を渡さないときは、いままでどおり、Issue から読む。
//   - 書き換えに要る情報が作れないときは、日付を変えても落ちず、利用側の関数を呼ばない。
//   - コメントを書く所は、情報が作れないときも、次の行動の日の情報を付けずに送る。
//   - ProjectV2Item の fieldValueContents(name) は、Issue のものと同じ形を返す。
//
// 動かし方:
//   npm test
//
// 部品は JSX なので、Node でそのまま読めない。
// このテストの中で、@babel/preset-react で JSX だけを変換し、src/components の部品は本物を読む。
// React は、createElement と useState だけを持つ偽物に、MUI は名前だけの偽物に差し替える。

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

    const replaced = code.replace(/import\s+(\w+)\s+from\s+'([^']+)'/g, (_all, name, from)=> {
        if (from === 'react')
            return `import ${name} from '${REACT_URL}'`;

        if (from.startsWith('.'))
            return `import ${name} from '${urlOf(new URL(from, fileUrl))}'`;

        return `import ${name} from '${NAME_STUB(name)}'`;
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

const { default: PanelIssue } = await load('Issue.js');
const { default: CreateComment } = await load('CreateComment.js');

/* ****************************************************************
 * データ
 * **************************************************************** */

const T1 = '2026-11-01T09:00:00Z';

const owner = { __typename: 'User', id: 'U_1', login: 'octocat', url: 'https://example.test/octocat', avatarUrl: 'x', updatedAt: T1 };

const dateValue = (name, date)=> ({ __typename: 'ProjectV2ItemFieldDateValue', id: `FV_${name}`, date, field: { id: `F_${name}`, name, dataType: 'DATE' } });

const projectNode = (id, title, number)=> ({ __typename: 'ProjectV2', id, number, title, url: `https://example.test/p/${number}`, updatedAt: T1, owner });

const itemNode = (id, project, dates)=> ({
    __typename: 'ProjectV2Item', id, type: 'ISSUE', updatedAt: T1,
    project,
    content: { __typename: 'Issue', id: 'I_1', number: 7, updatedAt: T1 },
    fieldValues: { nodes: dates.map(([n, d])=> dateValue(n, d)) },
});

const issueNode = (extra={})=> ({
    __typename: 'Issue', id: 'I_1', number: 7, title: 'issue', url: 'https://example.test/i/7', body: '', bodyHTML: '', updatedAt: T1,
    repository: { __typename: 'Repository', id: 'R_1', name: 'repo', url: 'https://example.test/r', updatedAt: T1, owner },
    author: owner,
    ...extra,
});

// asyncFetchIssueByOrgRepoIssueNumber の形。(projectItems に、プロジェクト A の Item)
const withProjectItems = ()=> issueNode({ projectItems: { edges: [ { node: itemNode('PVTI_A', projectNode('PVT_A', 'Project A', 1), [['Due.Date', '2026-11-30'], ['NextAction.Date', '2026-11-05']]) } ] } });

// 利用側の関数を、呼ばれた順に覚える。
function recorder () {
    const calls = [];
    const fn = (name)=> (...args)=> calls.push([name, args]);

    const actions = {
        issue: {
            due_date: { change: fn('due_date.change') },
            next_action_date: { change: fn('next_action_date.change') },
            refresh: fn('refresh'),
            comment: { create: fn('comment.create') },
        },
        project: { click: fn('project.click') },
    };

    return { calls, actions };
}

const draw = (props)=> render(React.createElement(PanelIssue, props));

// 副題のプロジェクトの所 (onClick を持つ span)。
const projectTitle = (tree)=> walk(tree).find(n=> n.type === 'span' && typeof n.props.onClick === 'function');

const dateFields = (tree)=> Object.fromEntries(walk(tree).filter(n=> n.type === 'TextField').map(n=> [n.props.label, n]));

/* ****************************************************************
 * プロジェクトの情報が無いとき (案 C)
 * **************************************************************** */

test('projectItems の無い Issue (asyncFetchIssueByID の形) でも、落ちずに描ける。プロジェクトの所は出さない', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    const tree = draw({ data: issue, actions: recorder().actions });

    assert.equal(projectTitle(tree), undefined);

    const dates = dateFields(tree);

    assert.equal(dates['Due Date'].props.value, null);
    assert.equal(dates['Next Action Date'].props.value, null);
});

test('Item を Pool から消したあとの Issue でも、落ちずに描ける (yanqirenshi/SOGH.next#108)', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(withProjectItems());

    assert.ok(projectTitle(draw({ data: issue, actions: recorder().actions })), '消す前は、プロジェクトの所が出る');

    sogh.removeProjectV2ItemsExcept('PVT_A', []);

    assert.equal(issue.projectV2(), null);
    assert.equal(projectTitle(draw({ data: issue, actions: recorder().actions })), undefined);
});

/* ****************************************************************
 * item を渡さないとき (いままでどおり)
 * **************************************************************** */

test('item を渡さないときは、副題と日付を、Issue から読む (いままでどおり)', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(withProjectItems());

    const { calls, actions } = recorder();
    const tree = draw({ data: issue, actions });

    assert.equal(text(projectTitle(tree)), 'Project A');

    const dates = dateFields(tree);

    assert.equal(dates['Due Date'].props.value, '2026-11-30');
    assert.equal(dates['Next Action Date'].props.value, '2026-11-05');

    dates['Due Date'].props.onChange({ target: { value: '2026-12-31' } });

    assert.equal(calls.length, 1);

    const [name, args] = calls[0];
    const expected = issue.fieldValueContents('Due.Date');

    assert.equal(name, 'due_date.change');
    assert.deepEqual(args, ['2026-12-31', expected.project, expected.item, expected.field_item, expected.value]);
});

/* ****************************************************************
 * item を渡したとき (案 A3)
 * **************************************************************** */

test('item を渡したときは、副題のプロジェクトと日付を、その Item から読む', ()=> {
    const sogh = new Sogh();

    // Issue は、プロジェクト A の Item 付き。見ている Item は、プロジェクト B のもの。
    const issue = sogh.node2issue(withProjectItems());
    const item = sogh.node2projectV2Item(itemNode('PVTI_B', projectNode('PVT_B', 'Project B', 2), [['Due.Date', '2027-01-31'], ['NextAction.Date', '2027-01-10']]));

    const { calls, actions } = recorder();
    const tree = draw({ data: issue, item, actions });

    assert.equal(text(projectTitle(tree)), 'Project B');
    assert.equal(walk(tree).find(n=> n.type === 'a' && n.props.href === 'https://example.test/p/2') !== undefined, true);

    // プロジェクトを押すと、Item の ProjectV2 の owner と番号。
    projectTitle(tree).props.onClick();

    assert.deepEqual(calls.at(-1), ['project.click', ['octocat', 2]]);

    const dates = dateFields(tree);

    assert.equal(dates['Due Date'].props.value, '2027-01-31');
    assert.equal(dates['Next Action Date'].props.value, '2027-01-10');

    dates['Next Action Date'].props.onChange({ target: { value: '2027-02-01' } });

    const [name, args] = calls.at(-1);
    const expected = item.fieldValueContents('NextAction.Date');

    assert.equal(name, 'next_action_date.change');
    assert.deepEqual(args, ['2027-02-01', expected.project, expected.item, expected.field_item, expected.value]);
    assert.equal(args[2].id, 'PVTI_B');
    assert.equal(args[1].id, 'PVT_B');

    // Issue のモデルの動きは、変わらない。(最初の Item = プロジェクト A)
    assert.equal(issue.dueDate(), '2026-11-30');
});

test('item を渡しても、その Item の ProjectV2 が Pool に無いときは、プロジェクトの所を出さない', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());
    const item = sogh.node2projectV2Item(itemNode('PVTI_B', null, [['Due.Date', '2027-01-31']]));

    assert.equal(item.project(), null);

    const tree = draw({ data: issue, item, actions: recorder().actions });

    assert.equal(projectTitle(tree), undefined);
    assert.equal(dateFields(tree)['Due Date'].props.value, '2027-01-31');
});

/* ****************************************************************
 * 書き換えに要る情報が作れないとき (案 D の守り)
 * **************************************************************** */

test('書き換えに要る情報が作れないときは、日付を変えても落ちず、利用側の関数を呼ばない', ()=> {
    const cases = [
        ['Issue に Item が無い', ()=> { const sogh = new Sogh(); return { data: sogh.node2issue(issueNode()) }; }],
        ['Item に、その日付の値が無い', ()=> {
            const sogh = new Sogh();
            return { data: sogh.node2issue(issueNode()), item: sogh.node2projectV2Item(itemNode('PVTI_B', projectNode('PVT_B', 'B', 2), [])) };
        }],
    ];

    for (const [label, make] of cases) {
        const { calls, actions } = recorder();
        const tree = draw({ ...make(), actions });
        const dates = dateFields(tree);

        assert.doesNotThrow(()=> dates['Due Date'].props.onChange({ target: { value: '2027-01-01' } }), label);
        assert.doesNotThrow(()=> dates['Next Action Date'].props.onChange({ target: { value: '2027-01-01' } }), label);
        assert.deepEqual(calls, [], label);
    }
});

/* ****************************************************************
 * コメントを書く所
 * **************************************************************** */

// コメントを書く所の、送るボタンに渡る関数。(タブの部品 (TabFinishToday など) の onClick)
function sendOf (props, editor_type) {
    const tabs = {
        selected: 'tab',
        list: [ { code: 'tab', label: 't', editor: { type: editor_type }, contents: 'hello', parson: 'alice', next_action_date: '2027-01-20' } ],
    };

    const sent = [];
    const element = CreateComment({ ...props, tabs, members: [], onChange: ()=> {}, onClick: (data)=> sent.push(data) });

    const tab = walk(element).find(n=> typeof n.type === 'function' && typeof n.props.onClick === 'function');

    return { send: ()=> tab.props.onClick(), sent };
}

test('コメントを書く所: 情報が作れないときも、次の行動の日の情報を付けずに送る', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    for (const [editor_type, expected] of [
        ['MdNad',    { type: 'tab', contents: 'hello' }],
        ['MdNadAss', { type: 'tab', to_parson: 'alice', contents: 'hello' }],
        ['Md',       { type: 'tab', contents: 'hello' }],
    ]) {
        const { send, sent } = sendOf({ issue }, editor_type);

        assert.doesNotThrow(send, editor_type);
        assert.deepEqual(sent, [expected], editor_type);
    }
});

test('コメントを書く所: 情報が作れるときは、Item (渡したとき) の、次の行動の日の情報を付けて送る', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(withProjectItems());
    const item = sogh.node2projectV2Item(itemNode('PVTI_B', projectNode('PVT_B', 'B', 2), [['NextAction.Date', '2027-01-10']]));

    for (const [props, item_id] of [[{ issue }, 'PVTI_A'], [{ issue, item }, 'PVTI_B']]) {
        const { send, sent } = sendOf(props, 'MdNad');

        send();

        const field = (props.item || issue).fieldValueContents('NextAction.Date');

        assert.deepEqual(sent, [{
            type: 'tab', contents: 'hello',
            project: field.project, item: field.item, field_item: field.field_item, next_action_date: '2027-01-20',
        }]);
        assert.equal(sent[0].item.id, item_id);
    }
});

/* ****************************************************************
 * ProjectV2Item の fieldValueContents(name)
 * **************************************************************** */

test('ProjectV2Item の fieldValueContents(name) は、Issue のものと同じ形を返す。値が無いときは null', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(withProjectItems());
    const item = sogh.projectV2Item('PVTI_A');

    for (const name of ['Due.Date', 'NextAction.Date']) {
        const a = issue.fieldValueContents(name);
        const b = item.fieldValueContents(name);

        assert.deepEqual(Object.keys(b).sort(), ['field_item', 'item', 'project', 'value']);
        assert.deepEqual(b.value, a.value, name);
        assert.deepEqual(b.field_item, a.field_item, name);
        assert.equal(b.item.id, a.item.id, name);
        assert.equal(b.project.id, a.project.id, name);
    }

    assert.equal(item.fieldValueContents('Status'), null);

    // fieldValues の無い Item でも、null。
    const bare = sogh.node2projectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_X', updatedAt: T1 });

    assert.equal(bare.fieldValueContents('Due.Date'), null);
});
