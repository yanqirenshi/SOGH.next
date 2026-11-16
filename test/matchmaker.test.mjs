// Matchmaker (入れ子で来た関連の node を、モデルにして Pool に入れる動き) のテスト。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの node を Pool に入れて確かめる。
// 確かめる関連は、yanqirenshi/SOGH.next#29 の最後のコメントの表 (23 の関連)。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import * as model from '../src/js/models/index.js';

const T1 = '2026-11-01T09:00:00Z';

const user = (id, login)=> ({ __typename: 'User', id, login, updatedAt: T1 });
const org  = (id, login)=> ({ __typename: 'Organization', id, login, updatedAt: T1 });

/* ****************************************************************
 * Repository
 * **************************************************************** */

test('Repository の owner: User は User に、Organization は Organization にする', ()=> {
    const sogh = new Sogh();

    sogh.node2repository({ __typename: 'Repository', id: 'R_1', name: 'a', owner: user('U_1', 'octocat'), updatedAt: T1 });
    sogh.node2repository({ __typename: 'Repository', id: 'R_2', name: 'b', owner: org('O_1', 'acme'), updatedAt: T1 });

    assert.ok(sogh.user('U_1') instanceof model.User);
    assert.ok(sogh.organization('O_1') instanceof model.Organization);
    assert.equal(sogh.user('O_1'), null);
});

/* ****************************************************************
 * Issue
 * **************************************************************** */

test('Issue の 7 つの関連を、Pool に入れる', ()=> {
    const sogh = new Sogh();

    sogh.node2issue({
        __typename: 'Issue',
        id: 'I_1',
        title: 'issue',
        updatedAt: T1,
        assignees: { nodes: [user('U_1', 'a'), user('U_2', 'b')] },
        author: { __typename: 'Bot', id: 'B_1', login: 'dependabot', updatedAt: T1 },
        labels: { nodes: [{ __typename: 'Label', id: 'L_1', name: 'bug', updatedAt: null }] },
        milestone: { __typename: 'Milestone', id: 'MS_1', title: 'v1', updatedAt: T1 },
        repository: { __typename: 'Repository', id: 'R_1', name: 'repo', owner: org('O_1', 'acme'), updatedAt: T1 },
        projectItems: {
            edges: [
                { node: { __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1 } },
            ],
        },
        comments: {
            totalCount: 1,
            nodes: [
                { __typename: 'IssueComment', id: 'IC_1', body: 'hi', updatedAt: T1 },
            ],
        },
    });

    assert.ok(sogh.user('U_1'));
    assert.ok(sogh.user('U_2'));
    assert.ok(sogh.bot('B_1'));
    assert.ok(sogh.label('L_1'));
    assert.ok(sogh.milestone('MS_1'));
    assert.ok(sogh.repository('R_1'));
    assert.ok(sogh.organization('O_1'), '入れ子の、さらに中の関連 (repository の owner) も辿る');
    assert.ok(sogh.projectV2Item('PVTI_1'));
    assert.ok(sogh.issueComment('IC_1'));

    // 親の core には、入れ子の JSON をそのまま残す。
    assert.equal(sogh.issue('I_1').core().assignees.nodes.length, 2);
});

test('author の型が人の 5 つのどれでも、合うモデルにする', ()=> {
    const sogh = new Sogh();

    const cases = [
        ['User',                  'user'],
        ['Organization',          'organization'],
        ['Bot',                   'bot'],
        ['Mannequin',             'mannequin'],
        ['EnterpriseUserAccount', 'enterprise-user-account'],
    ];

    cases.forEach(([typename, code], i)=> {
        sogh.node2issue({
            __typename: 'Issue',
            id: `I_${i}`,
            updatedAt: T1,
            author: { __typename: typename, id: `A_${i}`, login: 'x', updatedAt: T1 },
        });

        assert.ok(sogh.pool(code).get(`A_${i}`), typename);
    });
});

test('関連が null・無い・id が無いときは、何も入れない', ()=> {
    const sogh = new Sogh();

    sogh.node2issue({
        __typename: 'Issue',
        id: 'I_1',
        updatedAt: T1,
        author: null,
        milestone: null,
        assignees: { nodes: [] },
        labels: { nodes: [null] },
        repository: { __typename: 'Repository', name: 'no-id' },
    });

    for (const code of ['user', 'label', 'milestone', 'repository'])
        assert.equal(sogh.pool(code).list().length, 0, code);
});

/* ****************************************************************
 * IssueComment
 * **************************************************************** */

test('IssueComment の author・editor・pullRequest を、Pool に入れる', ()=> {
    const sogh = new Sogh();

    sogh.node2issueComment({
        __typename: 'IssueComment',
        id: 'IC_1',
        updatedAt: T1,
        author: user('U_1', 'a'),
        editor: { __typename: 'Mannequin', id: 'M_1', login: 'old', updatedAt: T1 },
        pullRequest: { __typename: 'PullRequest', id: 'PR_1', number: 1, updatedAt: T1 },
    });

    assert.ok(sogh.user('U_1'));
    assert.ok(sogh.mannequin('M_1'));
    assert.ok(sogh.pullRequest('PR_1'));
});

/* ****************************************************************
 * PullRequest (yanqirenshi/SOGH.next#49)
 * **************************************************************** */

test('PullRequest の assignees・repository・author を、Pool に入れる', ()=> {
    const sogh = new Sogh();

    sogh.node2pullRequest({
        __typename: 'PullRequest',
        id: 'PR_1',
        updatedAt: T1,
        assignees: { nodes: [user('U_1', 'a')] },
        repository: { __typename: 'Repository', id: 'R_1', name: 'repo', owner: org('O_1', 'acme'), updatedAt: T1 },
        author: { __typename: 'Bot', id: 'B_1', login: 'dependabot', updatedAt: T1 },
    });

    assert.ok(sogh.user('U_1'));
    assert.ok(sogh.repository('R_1'));
    assert.ok(sogh.organization('O_1'), '入れ子の、さらに中の関連 (repository の owner) も辿る');
    assert.ok(sogh.bot('B_1'));
});

test('PullRequest の repository・author が null・無い・id が無いときは、何も入れない', ()=> {
    const sogh = new Sogh();

    sogh.node2pullRequest({ __typename: 'PullRequest', id: 'PR_1', updatedAt: T1, repository: null, author: null });
    sogh.node2pullRequest({ __typename: 'PullRequest', id: 'PR_2', updatedAt: T1 });
    sogh.node2pullRequest({
        __typename: 'PullRequest', id: 'PR_3', updatedAt: T1,
        repository: { __typename: 'Repository', name: 'no-id' },
        author: { __typename: 'User', login: 'ghost' },
    });

    assert.equal(sogh.pool('repository').list().length, 0);
    assert.equal(sogh.pool('user').list().length, 0);
});

/* ****************************************************************
 * ProjectV2
 * **************************************************************** */

test('ProjectV2 の creator・owner・items を、Pool に入れる', ()=> {
    const sogh = new Sogh();

    sogh.node2projectV2({
        __typename: 'ProjectV2',
        id: 'PVT_1',
        updatedAt: T1,
        creator: user('U_1', 'a'),
        owner: org('O_1', 'acme'),
        items: {
            edges: [
                { node: { __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1 } },
                { node: { __typename: 'ProjectV2Item', id: 'PVTI_2', updatedAt: T1 } },
            ],
        },
    });

    assert.ok(sogh.user('U_1'));
    assert.ok(sogh.organization('O_1'));
    assert.ok(sogh.projectV2Item('PVTI_1'));
    assert.ok(sogh.projectV2Item('PVTI_2'));
});

test('ProjectV2 の owner が Issue・PullRequest のときは、Issue・PullRequest の Pool に入れる', ()=> {
    const sogh = new Sogh();

    sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1,
        owner: { __typename: 'Issue', id: 'I_1', number: 1, updatedAt: T1 },
    });
    sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_2', updatedAt: T1,
        owner: { __typename: 'PullRequest', id: 'PR_1', number: 2, updatedAt: T1 },
    });

    assert.ok(sogh.issue('I_1'));
    assert.ok(sogh.pullRequest('PR_1'));
});

/* ****************************************************************
 * ProjectV2Item
 * **************************************************************** */

test('ProjectV2Item の project・content・creator を、Pool に入れる', ()=> {
    const sogh = new Sogh();

    const contents = [
        [{ __typename: 'Issue',       id: 'I_1',  updatedAt: T1 }, 'issue'],
        [{ __typename: 'PullRequest', id: 'PR_1', updatedAt: T1 }, 'pull-request'],
        [{ __typename: 'DraftIssue',  id: 'DI_1', title: '下書き', updatedAt: T1 }, 'draft-issue'],
    ];

    contents.forEach(([content, code], i)=> {
        sogh.node2projectV2Item({
            __typename: 'ProjectV2Item',
            id: `PVTI_${i}`,
            updatedAt: T1,
            project: { __typename: 'ProjectV2', id: 'PVT_1', owner: user('U_9', 'owner'), updatedAt: T1 },
            content: content,
            creator: { __typename: 'EnterpriseUserAccount', id: `E_${i}`, login: 'e', updatedAt: T1 },
        });

        assert.ok(sogh.pool(code).get(content.id), content.__typename);
        assert.ok(sogh.enterpriseUserAccount(`E_${i}`));
    });

    assert.ok(sogh.projectV2('PVT_1'));
    assert.ok(sogh.user('U_9'), 'project の owner も辿る');
    assert.equal(sogh.pool('project-v2').list().length, 1);
});

test('ProjectV2Item の fieldValues の中の関連を、Pool に入れる。fieldValues の箱と creator は入れない', ()=> {
    const sogh = new Sogh();

    sogh.node2projectV2Item({
        __typename: 'ProjectV2Item',
        id: 'PVTI_1',
        updatedAt: T1,
        fieldValues: {
            nodes: [
                {
                    __typename: 'ProjectV2ItemFieldTextValue',
                    id: 'FV_1', text: 'title', updatedAt: T1,
                    creator: user('U_CREATOR', 'c'),
                },
                { __typename: 'ProjectV2ItemFieldUserValue', users: { nodes: [user('U_1', 'a')] } },
                { __typename: 'ProjectV2ItemFieldLabelValue', labels: { nodes: [{ __typename: 'Label', id: 'L_1', name: 'bug' }] } },
                { __typename: 'ProjectV2ItemFieldMilestoneValue', milestone: { __typename: 'Milestone', id: 'MS_1', title: 'v1' } },
                { __typename: 'ProjectV2ItemFieldRepositoryValue', repository: { __typename: 'Repository', id: 'R_1', name: 'repo' } },
                { __typename: 'ProjectV2ItemFieldPullRequestValue', pullRequests: { nodes: [{ __typename: 'PullRequest', id: 'PR_1' }] } },
                {
                    __typename: 'ProjectV2ItemFieldReviewerValue',
                    reviewers: {
                        nodes: [
                            user('U_2', 'b'),
                            { __typename: 'Team', id: 'T_1', slug: 'core' },
                            { __typename: 'Mannequin', id: 'M_1', login: 'old' },
                            { __typename: 'Bot', id: 'B_1', login: 'bot' },
                        ],
                    },
                },
                {},
            ],
        },
    });

    assert.ok(sogh.user('U_1'));
    assert.ok(sogh.label('L_1'));
    assert.ok(sogh.milestone('MS_1'));
    assert.ok(sogh.repository('R_1'));
    assert.ok(sogh.pullRequest('PR_1'));
    assert.ok(sogh.user('U_2'));
    assert.ok(sogh.team('T_1'));
    assert.ok(sogh.mannequin('M_1'));
    assert.ok(sogh.bot('B_1'));

    assert.equal(sogh.get('FV_1'), null, 'fieldValues の箱は、モデルにしない');
    assert.equal(sogh.user('U_CREATOR'), null, '箱の creator は、モデルにしない');
});

/* ****************************************************************
 * 重ね方
 * **************************************************************** */

test('入れ子で先に入ったモデルに、あとから来た親の node が重なる', ()=> {
    const sogh = new Sogh();

    // ProjectV2Item の project として、項目の少ない ProjectV2 が先に入る。
    sogh.node2projectV2Item({
        __typename: 'ProjectV2Item',
        id: 'PVTI_1',
        updatedAt: T1,
        project: { __typename: 'ProjectV2', id: 'PVT_1', title: 'p', updatedAt: T1 },
    });

    const project = sogh.projectV2('PVT_1');

    // あとから、同じ ProjectV2 の項目の多い node が来る。
    sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', title: 'p', public: true, updatedAt: T1 });

    assert.equal(sogh.projectV2('PVT_1'), project);
    assert.equal(project.core().public, true);
});

/* ****************************************************************
 * 入れ子で来た node と reload (yanqirenshi/SOGH.next#34)
 * **************************************************************** */

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const T2 = '2026-11-02T09:00:00Z';

test('入れ子で来た node で、初めてモデルを作ったときは、reload に日時を入れる', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({
        __typename: 'Issue', id: 'I_1', updatedAt: T1,
        assignees: { nodes: [user('U_1', 'alice')] },
        repository: { __typename: 'Repository', id: 'R_1', name: 'hello', updatedAt: T1, owner: org('O_1', 'acme') },
    });

    assert.equal(issue.reload(), null, '主に取った node には、入れない');
    assert.match(sogh.user('U_1').reload(), ISO);
    assert.match(sogh.repository('R_1').reload(), ISO);
    assert.match(sogh.organization('O_1').reload(), ISO, '入れ子の中の入れ子にも、入れる');
});

test('入れ子で来た node でも、すでにモデルがあるときは、reload を入れない', ()=> {
    const sogh = new Sogh();

    // 先に、主に取った User がある。
    const alice = sogh.node2user(user('U_1', 'alice'));

    // 同じ User が、同じ日時で、入れ子で来る。
    sogh.node2issue({ __typename: 'Issue', id: 'I_1', updatedAt: T1, assignees: { nodes: [user('U_1', 'alice')] } });

    assert.equal(alice.reload(), null);
});

test('入れ子を辿り終わったら、入れ子の扱いは終わる。(途中で例外が出ても)', ()=> {
    const sogh = new Sogh();

    sogh.node2issue({ __typename: 'Issue', id: 'I_1', updatedAt: T1, assignees: { nodes: [user('U_1', 'alice')] } });

    assert.equal(sogh.matchmaker.isNesting(), false);

    assert.throws(()=> sogh.matchmaker.nest(()=> { throw new Error('x'); }));

    assert.equal(sogh.matchmaker.isNesting(), false);
    assert.equal(sogh.node2user(user('U_2', 'bob')).reload(), null);
});

test('入れ子で先に入ったモデルに、同じ日時の親の node が来たら、手元にある項目も重ねる', ()=> {
    const sogh = new Sogh();

    // ProjectV2Item の project として、項目の少ない ProjectV2 が先に入る。(reload が入る)
    sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1,
        project: { __typename: 'ProjectV2', id: 'PVT_1', title: 'ref', updatedAt: T1 },
    });

    // 同じ日時の、項目の多い node が来る。
    sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', title: 'full', readme: '$Owner: foo', updatedAt: T1 });

    const project = sogh.projectV2('PVT_1');

    assert.equal(project.title(), 'full');
    assert.equal(project.readmeOwner(), 'foo');
});

/* ****************************************************************
 * 取り直し (yanqirenshi/SOGH.next#34 の 3 つの場合)
 * **************************************************************** */

test('ProjectV2 を Item 付きで取り直すと、README の属性と items() が新しくなる', ()=> {
    const sogh = new Sogh();

    // ProjectV2 → items → Item → project で、同じ ProjectV2 (項目が少ない) に戻る。
    const node = (t, readme, item_ids)=> ({
        __typename: 'ProjectV2', id: 'PVT_1', number: 1, title: 'p', readme, updatedAt: t,
        items: { edges: item_ids.map(id=> ({ node: {
            __typename: 'ProjectV2Item', id, updatedAt: t,
            project: { __typename: 'ProjectV2', id: 'PVT_1', number: 1, title: 'p', updatedAt: t },
        } })) },
    });

    const project = sogh.node2projectV2(node(T1, '$Owner: alice', ['PVTI_1']));

    assert.equal(project.readmeOwner(), 'alice');
    assert.equal(project.items().length, 1);

    // GitHub で README が変わり、Item が 1 つ増えた。
    sogh.node2projectV2(node(T2, '$Owner: bob', ['PVTI_1', 'PVTI_2']));

    assert.equal(project.readmeOwner(), 'bob');
    assert.equal(project.items().length, 2);
});

test('Item の一覧を取り直したあとで、Issue を取り直すと、本文と担当者が新しくなる', ()=> {
    const sogh = new Sogh();

    const node = (t, body, logins)=> ({
        __typename: 'Issue', id: 'I_1', number: 1, title: 't', body, updatedAt: t,
        assignees: { nodes: logins.map(login=> user('U_' + login, login)) },
    });
    // Item の content として、本文の無い Issue が来る。
    const item = (t)=> ({
        __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: t,
        content: { __typename: 'Issue', id: 'I_1', number: 1, title: 't', updatedAt: t },
    });

    const issue = sogh.node2issue(node(T1, 'old body', ['alice']));

    // GitHub で本文と担当者が変わった。先に Item の一覧を、そのあとで Issue を取り直す。
    sogh.node2projectV2Item(item(T2));
    sogh.node2issue(node(T2, 'new body', ['alice', 'bob']));

    assert.equal(issue.body(), 'new body');
    assert.deepEqual(issue.assignees().map(a=> a.login()), ['alice', 'bob']);
});

test('Issue が、自分の参照を入れ子に持っていても、取り直すと、本文が新しくなる', ()=> {
    const sogh = new Sogh();

    // Issue → projectItems → Item → content で、同じ Issue (本文が無い) に戻る。
    const node = (t, body)=> ({
        __typename: 'Issue', id: 'I_1', number: 1, title: 't', body, updatedAt: t,
        projectItems: { edges: [{ node: {
            __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: t,
            content: { __typename: 'Issue', id: 'I_1', number: 1, title: 't', updatedAt: t },
        } }] },
    });

    const issue = sogh.node2issue(node(T1, 'old body'));

    assert.equal(issue.body(), 'old body');

    sogh.node2issue(node(T2, 'new body'));

    assert.equal(issue.body(), 'new body');
});

/* ****************************************************************
 * Viewer
 * **************************************************************** */

test('viewer は User にして、user の Pool に入れる', ()=> {
    const sogh = new Sogh();

    const viewer = sogh.node2viewer(user('U_1', 'octocat'));

    assert.ok(viewer instanceof model.User);
    assert.equal(sogh.user('U_1'), viewer);
    assert.equal(viewer.login(), 'octocat');

    assert.equal(sogh.node2viewer(null), null);
});
