// ProjectV2 の itemsInPool() と、ProjectV2Item の fieldValues の守りのテスト。
//   - itemsInPool() は、items() (中身に入っている Item) と、別に取って Pool に入った Item を合わせて返す。(yanqirenshi/SOGH.next#102)
//   - itemsWith2ProjectV2Item() は、消した。(yanqirenshi/SOGH.next#104)
//   - ProjectV2Item の fieldValues() は、fieldValues が無いとき・nodes が配列でないときは、空の配列。(yanqirenshi/SOGH.next#103)
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。

import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import * as model from '../src/js/models/index.js';

const T1 = '2026-11-01T09:00:00Z';

const projectRef = (id, number)=> ({ __typename: 'ProjectV2', id, number, updatedAt: T1 });
const itemNode = (id, project)=> ({ __typename: 'ProjectV2Item', id, updatedAt: T1, project, fieldValues: { nodes: [] } });

/* ****************************************************************
 * itemsInPool (yanqirenshi/SOGH.next#102)
 * **************************************************************** */

test('itemsInPool() は、items() を先に、その順で。別に取った Item を、Pool に入った順で、あとに並べる', ()=> {
    const sogh = new Sogh();

    // 別に取った Item。(ProjectV2 より先に Pool に入った)
    sogh.node2projectV2Item(itemNode('PVTI_7', projectRef('PVT_1', 1)));

    const project = sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', number: 1, readme: '', updatedAt: T1,
        items: { edges: [
            { node: itemNode('PVTI_2', projectRef('PVT_1', 1)) },
            { node: itemNode('PVTI_1', projectRef('PVT_1', 1)) },
        ] },
    });

    // 別に取った Item。(あとから Pool に入った)
    sogh.node2projectV2Item(itemNode('PVTI_5', projectRef('PVT_1', 1)));

    assert.deepEqual(project.items().map(i=> i.id()), ['PVTI_2', 'PVTI_1']);
    assert.deepEqual(project.itemsInPool().map(i=> i.id()), ['PVTI_2', 'PVTI_1', 'PVTI_7', 'PVTI_5']);
});

test('itemsInPool() は、同じ Item を 1 回だけ返す (中身にもあり、別にも取ったとき)', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', number: 1, readme: '', updatedAt: T1,
        items: { edges: [ { node: itemNode('PVTI_1', projectRef('PVT_1', 1)) } ] },
    });

    // 同じ Item を、別に取り直した。
    sogh.node2projectV2Item(itemNode('PVTI_1', projectRef('PVT_1', 1)));

    const items = project.itemsInPool();

    assert.deepEqual(items.map(i=> i.id()), ['PVTI_1']);
    assert.equal(items[0], sogh.projectV2Item('PVTI_1'));
});

test('itemsInPool() に、ほかの ProjectV2 の Item と、project の無い Item は入らない', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', number: 1, readme: '', updatedAt: T1 });

    sogh.node2projectV2Item(itemNode('PVTI_1', projectRef('PVT_1', 1)));
    sogh.node2projectV2Item(itemNode('PVTI_2', projectRef('PVT_2', 2)));
    sogh.node2projectV2Item(itemNode('PVTI_3', undefined));
    sogh.node2projectV2Item(itemNode('PVTI_4', null));

    assert.deepEqual(project.items(), []);
    assert.deepEqual(project.itemsInPool().map(i=> i.id()), ['PVTI_1']);
});

test('itemsInPool() は、items() の意味を変えない (中身に入っている Item だけ)', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', number: 1, readme: '', updatedAt: T1 });

    sogh.node2projectV2Item(itemNode('PVTI_1', projectRef('PVT_1', 1)));

    assert.deepEqual(project.items(), []);
    assert.equal(project.itemsInPool().length, 1);
});

test('itemsInPool() は、sogh が入っていないモデルでも、落ちずに [] を返す', ()=> {
    const project = new model.ProjectV2({
        __typename: 'ProjectV2', id: 'PVT_1', number: 1, readme: '', updatedAt: T1,
        items: { edges: [ { node: itemNode('PVTI_1', projectRef('PVT_1', 1)) } ] },
    });

    assert.deepEqual(project.items(), []);
    assert.deepEqual(project.itemsInPool(), []);
});

test('itemsWith2ProjectV2Item() は無い (yanqirenshi/SOGH.next#104)', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1 });

    assert.equal(typeof project.itemsWith2ProjectV2Item, 'undefined');
    assert.equal(typeof project.itemsInPool, 'function');
});

/* ****************************************************************
 * ProjectV2Item の fieldValues の守り (yanqirenshi/SOGH.next#103)
 * **************************************************************** */

const NO_FIELD_VALUES = [
    ['fieldValues が無い',              {}],
    ['fieldValues が null',             { fieldValues: null }],
    ['nodes が無い',                    { fieldValues: {} }],
    ['nodes が配列でない',              { fieldValues: { nodes: 'x' } }],
];

test('fieldValues が無い Item でも、読むメソッドは落ちずに、null か空の値を返す', ()=> {
    for (const [name, extra] of NO_FIELD_VALUES) {
        const sogh = new Sogh();

        const item = sogh.node2projectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_1', type: 'ISSUE', updatedAt: T1, ...extra });

        assert.deepEqual(item.fieldValues(), [], name);
        assert.equal(item.getFieldValueByName('Title'), null, name);

        for (const method of ['title', 'status', 'dueDate', 'nextActionDate', 'planStart', 'planEnd', 'planTerm', 'planPoints', 'resultPoints', 'archived', 'repository', 'milestone'])
            assert.equal(item[method](), null, `${name}: ${method}`);

        for (const method of ['assignees', 'labels', 'linkedPullRequests', 'reviewers'])
            assert.deepEqual(item[method](), [], `${name}: ${method}`);

        assert.equal(item.planPointsSummary(), 0, name);
        assert.deepEqual(item.resultPointsSummary(), { total: 0, detail: {} }, name);

        // type() は fieldValues ではなく core の type を読む。
        assert.equal(item.type(), 'ISSUE', name);
    }
});

test('getFieldValueByName(name) は、null と、field の無いものを飛ばす', ()=> {
    const sogh = new Sogh();

    const item = sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1,
        fieldValues: { nodes: [
            null,
            {},
            { __typename: 'ProjectV2ItemFieldTextValue', text: 'no field' },
            { __typename: 'ProjectV2ItemFieldTextValue', field: { name: 'Title' }, text: 'ok' },
        ] },
    });

    assert.equal(item.title(), 'ok');
    assert.equal(item.status(), null);
    assert.equal(item.getFieldValueByName('Title').text, 'ok');
});
