// fieldValueContents(name) の value のテスト。(yanqirenshi/SOGH.next#120)
//   - フィールドの値を取り出す処理は、src/js/models/fieldValue.js の fieldValueOf(field_item) の 1 か所。
//   - Issue と ProjectV2Item の fieldValueContents(name) は、12 の種類のそれぞれで、同じ value を返す。
//   - 知らない種類のときは、value だけを null にして返す。(エラーは投げない)
//   - その名前のフィールドの値が無いときは、いままでどおり、全体が null。
//   - 値は、フィールドの値の JSON から、そのまま取る。(JSON を変えない・モデルにしない)
//
// 動かし方:
//   npm test

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import Sogh from '../src/js/Sogh.js';
import { fieldValueOf } from '../src/js/models/fieldValue.js';

/* ****************************************************************
 * データ
 * **************************************************************** */

const T1 = '2026-11-01T09:00:00Z';

const owner = { __typename: 'User', id: 'U_1', login: 'octocat', url: 'https://example.test/octocat', avatarUrl: 'x', updatedAt: T1 };

const user = (id, login)=> ({ id, login, name: login, url: `https://example.test/${login}`, avatarUrl: 'x', updatedAt: T1 });

const field = (name, dataType)=> ({ id: `F_${name}`, name, dataType });

// [種類, フィールドの値の JSON (field を除く), 期待する value を JSON から作る関数]
const KINDS = [
    ['ASSIGNEES', {
        __typename: 'ProjectV2ItemFieldUserValue',
        users: { nodes: [ user('U_2', 'alice'), user('U_3', 'bob') ] },
    }, (j)=> ({ users: j.users })],
    ['REPOSITORY', {
        __typename: 'ProjectV2ItemFieldRepositoryValue',
        repository: { id: 'R_1', name: 'repo', url: 'https://example.test/r', updatedAt: T1 },
    }, (j)=> ({ repository: j.repository })],
    ['LABELS', {
        __typename: 'ProjectV2ItemFieldLabelValue',
        labels: { nodes: [ { id: 'L_1', name: 'bug', color: 'ff0000', updatedAt: T1 } ] },
    }, (j)=> ({ labels: j.labels })],
    ['TITLE', {
        __typename: 'ProjectV2ItemFieldTextValue', id: 'FV_TITLE',
        text: 'issue title', createdAt: T1, updatedAt: T1,
    }, (j)=> ({ text: j.text })],
    ['SINGLE_SELECT', {
        __typename: 'ProjectV2ItemFieldSingleSelectValue', id: 'FV_SS',
        name: 'Todo', nameHTML: 'Todo', optionId: 'opt_1', createdAt: T1, updatedAt: T1,
    }, (j)=> ({ optionId: j.optionId })],
    ['DATE', {
        __typename: 'ProjectV2ItemFieldDateValue', id: 'FV_DATE',
        date: '2026-11-30',
    }, (j)=> ({ date: j.date })],
    ['TEXT', {
        __typename: 'ProjectV2ItemFieldTextValue', id: 'FV_TEXT',
        text: 'memo', createdAt: T1, updatedAt: T1,
    }, (j)=> ({ text: j.text })],
    ['NUMBER', {
        __typename: 'ProjectV2ItemFieldNumberValue', id: 'FV_NUM',
        number: 3.5, createdAt: T1, updatedAt: T1,
    }, (j)=> ({ number: j.number })],
    ['ITERATION', {
        __typename: 'ProjectV2ItemFieldIterationValue', id: 'FV_IT',
        title: 'Sprint 1', titleHTML: 'Sprint 1', duration: 14, iterationId: 'it_1', startDate: '2026-11-02', createdAt: T1, updatedAt: T1,
    }, (j)=> ({ iterationId: j.iterationId })],
    ['MILESTONE', {
        __typename: 'ProjectV2ItemFieldMilestoneValue',
        milestone: { id: 'MI_1', title: 'v1', number: 1, url: 'https://example.test/m/1', updatedAt: T1 },
    }, (j)=> ({ milestone: j.milestone })],
    ['LINKED_PULL_REQUESTS', {
        __typename: 'ProjectV2ItemFieldPullRequestValue',
        pullRequests: { nodes: [ { id: 'PR_1', number: 10, title: 'fix', url: 'https://example.test/pr/10', updatedAt: T1 } ] },
    }, (j)=> ({ pullRequests: j.pullRequests })],
    ['REVIEWERS', {
        __typename: 'ProjectV2ItemFieldReviewerValue',
        reviewers: { nodes: [ user('U_4', 'carol') ] },
    }, (j)=> ({ reviewers: j.reviewers })],
];

// 種類ごとに、フィールドの名前を変える。(名前は「Kind.<種類>」)
const nameOf = (kind)=> `Kind.${kind}`;

const valueNode = (kind, json)=> ({ ...json, field: field(nameOf(kind), kind) });

// 知らない種類。(GitHub が、あとで種類を足したとき)
const UNKNOWN = valueNode('TRACKS', { __typename: 'ProjectV2ItemFieldUnknownValue', id: 'FV_UNKNOWN', something: 1 });

const projectNode = { __typename: 'ProjectV2', id: 'PVT_A', number: 1, title: 'Project A', url: 'https://example.test/p/1', updatedAt: T1, owner };

const itemNode = ()=> ({
    __typename: 'ProjectV2Item', id: 'PVTI_A', type: 'ISSUE', updatedAt: T1,
    project: projectNode,
    content: { __typename: 'Issue', id: 'I_1', number: 7, updatedAt: T1 },
    fieldValues: { nodes: [ ...KINDS.map(([kind, json])=> valueNode(kind, json)), UNKNOWN ] },
});

const issueNode = ()=> ({
    __typename: 'Issue', id: 'I_1', number: 7, title: 'issue', url: 'https://example.test/i/7', body: '', bodyHTML: '', updatedAt: T1,
    repository: { __typename: 'Repository', id: 'R_1', name: 'repo', url: 'https://example.test/r', updatedAt: T1, owner },
    author: owner,
    projectItems: { edges: [ { node: itemNode() } ] },
});

// Issue と、その最初の Item のモデル。
function models () {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());
    const item = sogh.projectV2Item('PVTI_A');

    assert.ok(item, 'Item が Pool に入っている');

    return { issue, item };
}

/* ****************************************************************
 * 12 の種類
 * **************************************************************** */

test('12 の種類のそれぞれで、Issue と ProjectV2Item は、同じ value を返す', ()=> {
    const { issue, item } = models();

    for (const [kind, json, expected] of KINDS) {
        const a = issue.fieldValueContents(nameOf(kind));
        const b = item.fieldValueContents(nameOf(kind));

        assert.ok(a, `Issue: ${kind}`);
        assert.ok(b, `ProjectV2Item: ${kind}`);

        assert.deepEqual(Object.keys(a).sort(), ['field_item', 'item', 'project', 'value'], kind);
        assert.deepEqual(Object.keys(b).sort(), ['field_item', 'item', 'project', 'value'], kind);

        // value は、フィールドの値の JSON から取った値。
        assert.deepEqual(a.value, expected(json), `Issue: ${kind}`);
        assert.deepEqual(b.value, expected(json), `ProjectV2Item: ${kind}`);
        assert.deepEqual(a.value, b.value, kind);

        // 種類ごとに、キーは 1 つ。
        assert.equal(Object.keys(a.value).length, 1, kind);

        // 値の JSON を変えていない。(field_item は、渡した JSON と同じ中身)
        assert.deepEqual(a.field_item, valueNode(kind, json), `Issue: ${kind}`);
        assert.deepEqual(b.field_item, valueNode(kind, json), `ProjectV2Item: ${kind}`);
    }
});

test('value の中身は、フィールドの値の JSON そのもの (モデルにしない・写しを作らない)', ()=> {
    const { issue, item } = models();

    for (const [kind] of KINDS) {
        for (const [label, contents] of [['Issue', issue.fieldValueContents(nameOf(kind))], ['ProjectV2Item', item.fieldValueContents(nameOf(kind))]]) {
            const [key] = Object.keys(contents.value);
            const value = contents.value[key];

            // field_item の、同じキーの値と、同じもの。(TITLE・TEXT は text)
            assert.equal(value, contents.field_item[key], `${label}: ${kind}`);

            // モデル (GraphQLNode) ではない。
            assert.equal(value !== null && typeof value === 'object' && typeof value.core === 'function', false, `${label}: ${kind}`);
        }
    }
});

test('いまの 6 つの種類の value の形は、変わらない', ()=> {
    const { issue } = models();

    const shapes = {
        ASSIGNEES: ['users'],
        REPOSITORY: ['repository'],
        LABELS: ['labels'],
        TITLE: ['text'],
        SINGLE_SELECT: ['optionId'],
        DATE: ['date'],
    };

    for (const [kind, keys] of Object.entries(shapes))
        assert.deepEqual(Object.keys(issue.fieldValueContents(nameOf(kind)).value), keys, kind);
});

/* ****************************************************************
 * 知らない種類・値が無いとき
 * **************************************************************** */

test('知らない種類のときは、エラーを投げず、value だけを null にして返す', ()=> {
    const { issue, item } = models();

    for (const [label, model] of [['Issue', issue], ['ProjectV2Item', item]]) {
        let contents;

        assert.doesNotThrow(()=> { contents = model.fieldValueContents(nameOf('TRACKS')); }, label);

        assert.ok(contents, label);
        assert.equal(contents.value, null, label);
        assert.deepEqual(contents.field_item, UNKNOWN, label);
        assert.equal(contents.item.id, 'PVTI_A', label);
        assert.equal(contents.project.id, 'PVT_A', label);
    }
});

test('その名前のフィールドの値が無いときは、全体が null', ()=> {
    const { issue, item } = models();

    assert.equal(issue.fieldValueContents('Status'), null);
    assert.equal(item.fieldValueContents('Status'), null);

    // Item の無い Issue・fieldValues の無い Item も、null。
    const sogh = new Sogh();
    const plain = sogh.node2issue({ ...issueNode(), id: 'I_2', number: 8, projectItems: undefined });
    const bare = sogh.node2projectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_X', updatedAt: T1 });

    assert.equal(plain.fieldValueContents(nameOf('DATE')), null);
    assert.equal(bare.fieldValueContents(nameOf('DATE')), null);
});

test('Issue の fieldValueContents(name) は、いままでどおり、最初の Item だけを読む', ()=> {
    const sogh = new Sogh();

    const second = {
        ...itemNode(), id: 'PVTI_B',
        project: { ...projectNode, id: 'PVT_B', number: 2 },
        fieldValues: { nodes: [ valueNode('NUMBER', { __typename: 'ProjectV2ItemFieldNumberValue', id: 'FV_NUM_B', number: 99 }) ] },
    };

    const issue = sogh.node2issue({ ...issueNode(), projectItems: { edges: [ { node: itemNode() }, { node: second } ] } });

    assert.deepEqual(issue.fieldValueContents(nameOf('NUMBER')).value, { number: 3.5 });
    assert.equal(issue.fieldValueContents(nameOf('NUMBER')).item.id, 'PVTI_A');
});

/* ****************************************************************
 * fieldValueOf(field_item)
 * **************************************************************** */

test('fieldValueOf(field_item): 種類が読めないときも、エラーを投げず null', ()=> {
    for (const node of [null, undefined, {}, { field: null }, { field: {} }, { field: { dataType: null } }])
        assert.equal(fieldValueOf(node), null, JSON.stringify(node));
});

// 入口は画面の部品 (JSX) も読むので、ここでは import せず、文字で確かめる。(入口の中身は test/entry.test.mjs)
test('fieldValueOf(field_item) は、パッケージの入口 (src/index.js)・モデルの index からは出さない', ()=> {
    for (const path of ['../src/index.js', '../src/js/models/index.js'])
        assert.equal(/fieldValue/.test(fs.readFileSync(new URL(path, import.meta.url), 'utf8')), false, path);
});
