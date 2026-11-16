// ProjectV2 の Item を取り直したときに、外した Item を Pool から消すことのテスト。(yanqirenshi/SOGH.next#108)
//   - asyncFetchProjectV2ItemsByUserLoginProjectV2Number・ByOrg〜 は、最後のページまで取り終えたら、
//     その ProjectV2 の Item のうち、今回取れなかったものを、Pool から消す。
//   - 途中で失敗したときは、消さない。Item が 0 個になったときも、消す。
//   - 消すのは ProjectV2Item のモデルだけ。中身 (Issue など) と、ほかの ProjectV2 の Item は残す。
//   - 戻り値 (取った Item の id の配列) は、変わらない。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの fetch (test/fake-fetch.mjs) を使う。

import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import { fakeFetch, withFetch } from './fake-fetch.mjs';

const T1 = '2026-11-01T09:00:00Z';
const T2 = '2026-11-02T09:00:00Z';

const GRAPHQL_ERROR = { json: { data: null, errors: [{ type: 'INTERNAL', message: 'boom' }] } };

const projectRef = (id)=> ({ __typename: 'ProjectV2', id, number: 3, updatedAt: T1 });

// Item の node。(いまのクエリと同じく、project と content を持つ)
const itemNode = (id, project_id='PVT_1', t=T1)=> ({
    __typename: 'ProjectV2Item', id, type: 'ISSUE', isArchived: false, updatedAt: t,
    project: projectRef(project_id),
    content: { __typename: 'Issue', id: `I_${id}`, number: 1, updatedAt: t },
    fieldValues: { nodes: [] },
});

// 1 ページ分の応答。(owner は 'user' か 'organization')
function page (owner, ids, has_next=false, end_cursor=null, project_id='PVT_1', t=T2) {
    return {
        json: {
            data: {
                [owner]: {
                    projectV2: {
                        __typename: 'ProjectV2', id: project_id, number: 3, updatedAt: t,
                        items: {
                            nodes: ids.map(id=> itemNode(id, project_id, t)),
                            pageInfo: { endCursor: end_cursor, hasNextPage: has_next, hasPreviousPage: false, startCursor: null },
                        },
                    },
                },
            },
        },
    };
}

const METHODS = [
    ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', 'user'],
    ['asyncFetchProjectV2ItemsByOrgLoginProjectV2Number',  'organization'],
];

// 前に取った Item を、Pool に入れておく。(PVT_1 に PVTI_1〜3、PVT_2 に PVTI_9)
function prepare () {
    const sogh = new Sogh();

    for (const id of ['PVTI_1', 'PVTI_2', 'PVTI_3'])
        sogh.node2projectV2Item(itemNode(id));

    sogh.node2projectV2Item(itemNode('PVTI_9', 'PVT_2'));

    return sogh;
}

const poolIds = (sogh)=> sogh.pool('project-v2-item').list().map(i=> i.id()).sort();

for (const [method, owner] of METHODS) {
    test(`${method}: 取り直して外れた Item は、Pool から消え、itemsInPool() に出ない`, async ()=> {
        const sogh = prepare();

        // ProjectV2 の中身 (core の items) にも、前の Item がある。
        const project = sogh.node2projectV2({
            __typename: 'ProjectV2', id: 'PVT_1', number: 3, updatedAt: T1,
            items: { nodes: ['PVTI_1', 'PVTI_2', 'PVTI_3'].map(id=> itemNode(id)) },
        });

        const ids = await withFetch(fakeFetch([page(owner, ['PVTI_1', 'PVTI_3', 'PVTI_4'])]), ()=> sogh[method]('octocat', 3));

        // 戻り値は、取った Item の id の配列。(前と同じ)
        assert.deepEqual(ids, ['PVTI_1', 'PVTI_3', 'PVTI_4']);

        // PVTI_2 が消えた。ほかの ProjectV2 の PVTI_9 は残る。
        assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_3', 'PVTI_4', 'PVTI_9']);
        assert.equal(sogh.projectV2Item('PVTI_2'), null);

        // 中身の Issue は残る。
        assert.ok(sogh.issue('I_PVTI_2'));

        // core の items に PVTI_2 の id が残っていても、items()・itemsInPool() には出ない。
        assert.equal(project.core().items.nodes.some(n=> n.id === 'PVTI_2'), true);
        assert.deepEqual(project.items().map(i=> i.id()), ['PVTI_1', 'PVTI_3']);
        assert.deepEqual(project.itemsInPool().map(i=> i.id()), ['PVTI_1', 'PVTI_3', 'PVTI_4']);
    });

    test(`${method}: Item が 0 個になったときも、その ProjectV2 の Item を消す`, async ()=> {
        const sogh = prepare();

        const ids = await withFetch(fakeFetch([page(owner, [])]), ()=> sogh[method]('octocat', 3));

        assert.deepEqual(ids, []);
        assert.deepEqual(poolIds(sogh), ['PVTI_9']);

        for (const id of ['PVTI_1', 'PVTI_2', 'PVTI_3'])
            assert.ok(sogh.issue(`I_${id}`), `I_${id}`);
    });

    test(`${method}: 2 ページ以上のときは、全ページの Item が残り、どのページにも無い Item だけ消える`, async ()=> {
        const sogh = prepare();

        const ids = await withFetch(fakeFetch([
            page(owner, ['PVTI_1'], true, 'C1'),
            page(owner, ['PVTI_3'], true, 'C2'),
            page(owner, ['PVTI_5'], false, null),
        ]), ()=> sogh[method]('octocat', 3));

        assert.deepEqual(ids, ['PVTI_1', 'PVTI_3', 'PVTI_5']);
        assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_3', 'PVTI_5', 'PVTI_9']);
    });

    test(`${method}: 途中のページで失敗したときは、何も消さない`, async ()=> {
        const sogh = prepare();

        await assert.rejects(withFetch(fakeFetch([page(owner, ['PVTI_1'], true, 'C1'), GRAPHQL_ERROR]), ()=> sogh[method]('octocat', 3)));

        assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_9']);
    });

    test(`${method}: 1 ページめで失敗したときも、何も消さない`, async ()=> {
        const sogh = prepare();

        await assert.rejects(withFetch(fakeFetch([GRAPHQL_ERROR]), ()=> sogh[method]('octocat', 3)));

        assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_9']);
    });

    test(`${method}: ProjectV2 が無い (null) ときは、GitHubError を投げ、何も消さない`, async ()=> {
        const sogh = prepare();

        await assert.rejects(withFetch(fakeFetch([{ json: { data: { [owner]: { projectV2: null } } } }]), ()=> sogh[method]('octocat', 3)), (e)=> e.name === 'GitHubError');

        assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_9']);
    });
}

/* ****************************************************************
 * pick の形
 * **************************************************************** */

test('Item を取る 2 つのクエリの pick は、ProjectV2 (id と items を持つ) を返す', ()=> {
    const sogh = new Sogh();

    const project = { id: 'PVT_1', items: { nodes: [] } };

    assert.equal(sogh.queryDefinition('projectv2items_by_user_login_projectv2_number').pick({ user: { projectV2: project } }), project);
    assert.equal(sogh.queryDefinition('projectv2items_by_org_login_projectv2_number').pick({ organization: { projectV2: project } }), project);
});

/* ****************************************************************
 * Pooler の projectV2ItemsOf・removeProjectV2ItemsExcept
 * **************************************************************** */

test('projectV2ItemsOf(project_id) は、その ProjectV2 の Item を、Pool に入った順に返す (project の無い Item は入らない)', ()=> {
    const sogh = prepare();

    sogh.node2projectV2Item({ __typename: 'ProjectV2Item', id: 'PVTI_X', updatedAt: T1 });

    assert.deepEqual(sogh.projectV2ItemsOf('PVT_1').map(i=> i.id()), ['PVTI_1', 'PVTI_2', 'PVTI_3']);
    assert.deepEqual(sogh.projectV2ItemsOf('PVT_2').map(i=> i.id()), ['PVTI_9']);
    assert.deepEqual(sogh.projectV2ItemsOf(null), []);
});

test('removeProjectV2ItemsExcept(project_id, ids) は、消した id を返す。project_id が無いときは、何も消さない', ()=> {
    const sogh = prepare();

    assert.deepEqual(sogh.removeProjectV2ItemsExcept(null, []), []);
    assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_9']);

    assert.deepEqual(sogh.removeProjectV2ItemsExcept('PVT_1', ['PVTI_2']), ['PVTI_1', 'PVTI_3']);
    assert.deepEqual(poolIds(sogh), ['PVTI_2', 'PVTI_9']);
});

/* ****************************************************************
 * ほかの取得は、消さない
 * **************************************************************** */

test('ProjectV2 を取る取得 (組織の番号) は、Item を消さない', async ()=> {
    const sogh = prepare();

    const response = { json: { data: { organization: { projectV2: {
        __typename: 'ProjectV2', id: 'PVT_1', number: 3, updatedAt: T2,
        items: { edges: [ { node: itemNode('PVTI_1', 'PVT_1', T2) } ] },
    } } } } };

    await withFetch(fakeFetch([response]), ()=> sogh.asyncFetchProjectV2ByOrgLoginProjectV2Number('acme', 3));

    assert.deepEqual(poolIds(sogh), ['PVTI_1', 'PVTI_2', 'PVTI_3', 'PVTI_9']);
});
