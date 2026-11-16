// ProjectV2Item の reviewers() に入る Team のテスト。(yanqirenshi/SOGH.next#39)
//   - reviewers のクエリは、Team の name・avatarUrl を別名 (teamName・teamAvatarUrl) で取り、url も取る。
//   - ほかのクエリが使う teamRef() は、変えない。
//   - 別名は、Pool に入れる前に、name・avatarUrl に戻る。(Pool の Team と、Item の core の中の、両方)
//   - Team のモデルは、name()・url()・avatarUrl()・slug() を持つ。login() は、持たない。
//   - reviewers() は、User・Team・Mannequin・Bot を返す。モデルにならないもの (id の無い空のもの) は、外れる。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import * as models from '../src/js/models/index.js';
import * as queries from '../src/js/queries/index.js';
import * as attr from '../src/js/queries/attributes.js';

const T1 = '2026-11-01T09:00:00Z';

const TEAM_URL = 'https://example.test/orgs/o/teams/core';

const user = ()=> ({ __typename: 'User', id: 'U_1', login: 'alice', name: 'Alice', url: 'https://example.test/alice', avatarUrl: 'https://example.test/alice.png', updatedAt: T1 });
const team = (extra={})=> ({ __typename: 'Team', id: 'T_1', slug: 'core', teamName: 'Core Team', teamAvatarUrl: 'https://example.test/core.png', url: TEAM_URL, updatedAt: T1, ...extra });
const mannequin = ()=> ({ __typename: 'Mannequin', id: 'M_1', login: 'mona', url: 'https://example.test/mona', avatarUrl: 'https://example.test/mona.png', updatedAt: T1 });
const bot = ()=> ({ __typename: 'Bot', id: 'B_1', login: 'robo', url: 'https://example.test/robo', avatarUrl: 'https://example.test/robo.png', updatedAt: T1 });

const item = (id, reviewers)=> ({
    __typename: 'ProjectV2Item', id, type: 'DRAFT_ISSUE', updatedAt: T1,
    fieldValues: { nodes: [
        { __typename: 'ProjectV2ItemFieldTextValue', field: { name: 'Title' }, text: `title ${id}` },
        ...(reviewers ? [{ __typename: 'ProjectV2ItemFieldReviewerValue', field: { name: 'Reviewers' }, reviewers: { nodes: reviewers } }] : []),
    ] },
});

/* ****************************************************************
 * クエリ
 * **************************************************************** */

test('reviewers のクエリは、Team の name・avatarUrl を別名で取り、url を取る', ()=> {
    let count = 0;

    for (const [code, { query }] of Object.entries(queries)) {
        if (!query.includes('reviewers(first:'))
            continue;

        count++;

        // reviewers(first: n) { nodes { ... } } の中の Team だけを見る。
        // (チームの ProjectV2 を取るクエリには、根の Team もある)
        const fragments = [...query.matchAll(/reviewers\(first: \d+\) \{\s*nodes \{([\s\S]*?)\n\s*\}\s*\}/g)]
              .flatMap(m=> [...m[1].matchAll(/\.\.\. on Team \{([^}]*)\}/g)].map(d=> d[1]));

        assert.equal(fragments.length > 0, true, code);

        for (const body of fragments) {
            assert.match(body, /teamName: name/, code);
            assert.match(body, /teamAvatarUrl: avatarUrl/, code);
            assert.match(body, /^url\s*$/m, code);

            // 別名の無い name・avatarUrl は、取らない。(User などと、型が違うため)
            assert.equal(/^name$/m.test(body), false, code);
            assert.equal(/^avatarUrl$/m.test(body), false, code);
        }
    }

    assert.ok(count >= 5, `reviewers を取るクエリ: ${count} 個`);
});

test('teamRef() は、変えない。(チームの ProjectV2 を取るクエリの、根の Team)', ()=> {
    const ref = attr.teamRef();

    assert.deepEqual(ref.split('\n'), ['__typename', 'id', 'slug', 'createdAt', 'updatedAt']);

    for (const code of ['projectsv2_by_team']) {
        const query = queries[code].query;

        assert.equal(query.includes('teamName'), false, code);
        assert.equal(query.includes('teamAvatarUrl'), false, code);
    }
});

/* ****************************************************************
 * Pooler: 別名を、元の名前に戻す
 * **************************************************************** */

test('node2team は、別名 teamName・teamAvatarUrl を、name・avatarUrl に戻す', ()=> {
    const sogh = new Sogh();

    const node = team();

    const obj = sogh.node2team(node);
    const core = obj.core();

    assert.equal(core.name, 'Core Team');
    assert.equal(core.avatarUrl, 'https://example.test/core.png');
    assert.equal('teamName' in core, false);
    assert.equal('teamAvatarUrl' in core, false);

    // 渡した node は、変えない。
    assert.equal(node.teamName, 'Core Team');
    assert.equal('name' in node, false);

    // 別名の無い Team は、そのまま。
    const plain = sogh.node2team({ __typename: 'Team', id: 'T_2', slug: 'dev', name: 'Dev', updatedAt: T1 });

    assert.equal(plain.name(), 'Dev');
});

test('Team のモデルは、name()・url()・avatarUrl()・slug() を持ち、login() は持たない', ()=> {
    const sogh = new Sogh();

    const obj = sogh.node2team(team());

    assert.equal(obj instanceof models.Team, true);
    assert.equal(obj.typename(), 'Team');
    assert.equal(obj.slug(), 'core');
    assert.equal(obj.name(), 'Core Team');
    assert.equal(obj.url(), TEAM_URL);
    assert.equal(obj.avatarUrl(), 'https://example.test/core.png');
    assert.equal(typeof obj.login, 'undefined');
});

test('Team に avatarUrl が無い (null・来ていない) とき、avatarUrl() は null', ()=> {
    const sogh = new Sogh();

    const none = sogh.node2team(team({ id: 'T_2', teamAvatarUrl: null }));

    assert.equal(none.avatarUrl(), null);
    assert.equal(none.core().avatarUrl, null);
    assert.equal(none.name(), 'Core Team');

    const { teamAvatarUrl, ...rest } = team({ id: 'T_3' });

    const missing = sogh.node2team(rest);

    assert.equal(missing.avatarUrl(), null);
    assert.equal('avatarUrl' in missing.core(), false);

    // name も url も無いとき。
    const bare = sogh.node2team({ __typename: 'Team', id: 'T_4', slug: 'bare', updatedAt: T1 });

    assert.equal(bare.name(), null);
    assert.equal(bare.url(), null);
    assert.equal(bare.slug(), 'bare');
});

test('Item の core の fieldValues の中の、reviewers の Team も、name・avatarUrl に戻る。元の node は変えない', ()=> {
    const sogh = new Sogh();

    const node = item('PVTI_1', [user(), team(), mannequin(), bot()]);

    const obj = sogh.node2projectV2Item(node);

    const reviewers = obj.core().fieldValues.nodes[1].reviewers.nodes;
    const t = reviewers.find(d=> d.__typename === 'Team');

    assert.equal(t.name, 'Core Team');
    assert.equal(t.avatarUrl, 'https://example.test/core.png');
    assert.equal('teamName' in t, false);
    assert.equal('teamAvatarUrl' in t, false);
    assert.equal(t.url, TEAM_URL);
    assert.equal(t.slug, 'core');

    // Team 以外は、そのまま。
    assert.deepEqual(reviewers.find(d=> d.__typename === 'User'), user());
    assert.deepEqual(reviewers.find(d=> d.__typename === 'Bot'), bot());

    // 渡した node は、変えない。
    assert.equal(node.fieldValues.nodes[1].reviewers.nodes[1].teamName, 'Core Team');
    assert.equal('name' in node.fieldValues.nodes[1].reviewers.nodes[1], false);

    // Pool の Team も、同じ。
    assert.equal(sogh.team('T_1').name(), 'Core Team');
    assert.equal('teamName' in sogh.team('T_1').core(), false);
});

test('ProjectV2 の items から来た Item も、reviewers の Team は、name・avatarUrl に戻る', ()=> {
    const sogh = new Sogh();

    sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1,
        items: { edges: [ { node: item('PVTI_2', [team({ id: 'T_9', teamAvatarUrl: null })]) } ] },
    });

    const t = sogh.projectV2Item('PVTI_2').core().fieldValues.nodes[1].reviewers.nodes[0];

    assert.equal(t.name, 'Core Team');
    assert.equal(t.avatarUrl, null);
    assert.equal('teamAvatarUrl' in t, false);
    assert.equal(sogh.team('T_9').name(), 'Core Team');
});

test('fieldValues が無い・nodes が配列でない・null が混ざる・reviewers が無い Item でも、落ちない', ()=> {
    const sogh = new Sogh();

    const nodes = [
        { __typename: 'ProjectV2Item', id: 'PVTI_A', updatedAt: T1 },
        { __typename: 'ProjectV2Item', id: 'PVTI_B', updatedAt: T1, fieldValues: null },
        { __typename: 'ProjectV2Item', id: 'PVTI_C', updatedAt: T1, fieldValues: { nodes: null } },
        { __typename: 'ProjectV2Item', id: 'PVTI_D', updatedAt: T1, fieldValues: { nodes: [ null, { __typename: 'ProjectV2ItemFieldTextValue' } ] } },
        { __typename: 'ProjectV2Item', id: 'PVTI_E', updatedAt: T1, fieldValues: { nodes: [ { __typename: 'ProjectV2ItemFieldReviewerValue', field: { name: 'Reviewers' }, reviewers: null } ] } },
        { __typename: 'ProjectV2Item', id: 'PVTI_F', updatedAt: T1, fieldValues: { nodes: [ { __typename: 'ProjectV2ItemFieldReviewerValue', field: { name: 'Reviewers' }, reviewers: { nodes: [ null ] } } ] } },
        item('PVTI_G', []),
    ];

    for (const node of nodes) {
        const obj = sogh.node2projectV2Item(node);

        assert.deepEqual(obj.reviewers(), [], node.id);
    }
});

test('別名の無い Item は、core を作り直さずに、そのまま Pool に入る', ()=> {
    const sogh = new Sogh();

    const node = item('PVTI_1', [user(), mannequin()]);

    const obj = sogh.node2projectV2Item(node);

    assert.equal(obj.core(), node);
});

/* ****************************************************************
 * reviewers()
 * **************************************************************** */

test('reviewers() は、User・Team・Mannequin・Bot のモデルを返す。id の無い空のもの (EnterpriseTeam など) は、外れる', ()=> {
    const sogh = new Sogh();

    // EnterpriseTeam は、クエリで取らないので、id の無い空の node で来る。
    const obj = sogh.node2projectV2Item(item('PVTI_1', [user(), team(), {}, mannequin(), bot()]));

    const reviewers = obj.reviewers();

    assert.deepEqual(reviewers.map(d=> d.typename()), ['User', 'Team', 'Mannequin', 'Bot']);
    assert.equal(reviewers[0] instanceof models.User, true);
    assert.equal(reviewers[1] instanceof models.Team, true);
    assert.equal(reviewers[2] instanceof models.Mannequin, true);
    assert.equal(reviewers[3] instanceof models.Bot, true);

    assert.equal(reviewers[1].name(), 'Core Team');
    assert.equal(reviewers[1].url(), TEAM_URL);
});

test('レビュアーの無い Item は、reviewers() が空の配列', ()=> {
    const sogh = new Sogh();

    assert.deepEqual(sogh.node2projectV2Item(item('PVTI_1', null)).reviewers(), []);
});
