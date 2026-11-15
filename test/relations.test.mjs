// 関連を返すメソッド (issue.assignees() など) が、モデルを返すことのテスト。
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

test('Repository の owner() は、User か Organization のモデルを返す', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2repository({ __typename: 'Repository', id: 'R_1', owner: user('U_1', 'octocat'), updatedAt: T1 });
    const b = sogh.node2repository({ __typename: 'Repository', id: 'R_2', owner: org('O_1', 'acme'), updatedAt: T1 });
    const c = sogh.node2repository({ __typename: 'Repository', id: 'R_3', updatedAt: T1 });

    assert.equal(a.owner(), sogh.user('U_1'));
    assert.ok(b.owner() instanceof model.Organization);
    assert.equal(b.owner().login(), 'acme');
    assert.equal(c.owner(), null);
});

/* ****************************************************************
 * Issue
 * **************************************************************** */

function issueNode () {
    return {
        __typename: 'Issue',
        id: 'I_1',
        updatedAt: T1,
        assignees: { nodes: [user('U_1', 'a'), user('U_2', 'b')] },
        author: { __typename: 'Mannequin', id: 'M_1', login: 'old', updatedAt: T1 },
        labels: { nodes: [{ __typename: 'Label', id: 'L_1', name: 'bug' }] },
        milestone: { __typename: 'Milestone', id: 'MS_1', title: 'v1' },
        repository: { __typename: 'Repository', id: 'R_1', name: 'repo' },
        projectItems: {
            edges: [
                {
                    node: {
                        __typename: 'ProjectV2Item',
                        id: 'PVTI_1',
                        updatedAt: T1,
                        project: { __typename: 'ProjectV2', id: 'PVT_1', number: 3, owner: user('U_9', 'owner'), updatedAt: T1 },
                        fieldValues: {
                            nodes: [
                                { __typename: 'ProjectV2ItemFieldDateValue', date: '2026-11-20', field: { name: 'NextAction.Date', dataType: 'DATE' } },
                            ],
                        },
                    },
                },
            ],
        },
        comments: { nodes: [{ __typename: 'IssueComment', id: 'IC_1', body: 'hi', updatedAt: T1 }] },
    };
}

test('Issue の関連を返すメソッドは、モデルを返す', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue(issueNode());

    assert.deepEqual(issue.assignees(), [sogh.user('U_1'), sogh.user('U_2')]);
    assert.equal(issue.assignees()[0].login(), 'a');

    assert.ok(issue.author() instanceof model.Mannequin);
    assert.equal(issue.author().login(), 'old');

    assert.deepEqual(issue.labels(), [sogh.label('L_1')]);
    assert.equal(issue.labels()[0].name(), 'bug');

    assert.equal(issue.milestone(), sogh.milestone('MS_1'));
    assert.equal(issue.milestoneId(), 'MS_1');

    assert.equal(issue.repository(), sogh.repository('R_1'));

    assert.deepEqual(issue.projectV2Items(), [sogh.projectV2Item('PVTI_1')]);
    assert.equal(issue.projectV2Item(), sogh.projectV2Item('PVTI_1'));
    assert.deepEqual(issue.projectsV2(), [sogh.projectV2('PVT_1')]);
    assert.equal(issue.projectV2(), sogh.projectV2('PVT_1'));
    assert.equal(issue.project(), sogh.projectV2('PVT_1'));

    assert.deepEqual(issue.comments(), [sogh.issueComment('IC_1')]);
});

test('Issue の関連が無いときは、空の配列か null を返す', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ __typename: 'Issue', id: 'I_1', updatedAt: T1 });

    assert.deepEqual(issue.assignees(), []);
    assert.deepEqual(issue.labels(), []);
    assert.deepEqual(issue.comments(), []);
    assert.deepEqual(issue.projectV2Items(), []);
    assert.deepEqual(issue.projectsV2(), []);
    assert.equal(issue.author(), null);
    assert.equal(issue.milestone(), null);
    assert.equal(issue.milestoneId(), null);
    assert.equal(issue.repository(), null);
    assert.equal(issue.projectV2(), null);
});

test('Issue の fieldValueContents() は、JSON のまま返す', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue(issueNode());

    const field = issue.fieldValueContents('NextAction.Date');

    assert.equal(field.item.id, 'PVTI_1');
    assert.equal(field.project.id, 'PVT_1');
    assert.deepEqual(field.value, { date: '2026-11-20' });
    assert.equal(issue.nextActionDate(), '2026-11-20');

    // projectItems を取得していないときは、null。(エラーにしない)
    const plain = sogh.node2issue({ __typename: 'Issue', id: 'I_2', updatedAt: T1 });

    assert.equal(plain.fieldItem(), null);
    assert.equal(plain.fieldValueContents('NextAction.Date'), null);
});

test('Issue の issueData2requestData() は、モデルの id も読める', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue(issueNode());

    const data = issue.issueData2requestData({
        repository: issue.repository(),
        title: 't',
        description: '',
        projects: [],
        milestone: issue.milestone(),
        labels: issue.labels(),
        assignees: [...issue.assignees(), 'U_3'],
    });

    assert.equal(data.repositoryId, 'R_1');
    assert.equal(data.milestoneId, 'MS_1');
    assert.deepEqual(data.labelIds, ['L_1']);
    assert.deepEqual(data.assigneeIds, ['U_1', 'U_2', 'U_3']);
});

/* ****************************************************************
 * IssueComment
 * **************************************************************** */

test('IssueComment の author()・editor()・pullRequest() は、モデルを返す', ()=> {
    const sogh = new Sogh();

    const comment = sogh.node2issueComment({
        __typename: 'IssueComment',
        id: 'IC_1',
        updatedAt: T1,
        author: user('U_1', 'a'),
        editor: { __typename: 'Bot', id: 'B_1', login: 'bot', updatedAt: T1 },
        pullRequest: { __typename: 'PullRequest', id: 'PR_1', number: 1, updatedAt: T1 },
    });

    assert.equal(comment.author(), sogh.user('U_1'));
    assert.equal(comment.editor(), sogh.bot('B_1'));
    assert.equal(comment.pullRequest(), sogh.pullRequest('PR_1'));

    const plain = sogh.node2issueComment({ __typename: 'IssueComment', id: 'IC_2', updatedAt: T1, editor: null });

    assert.equal(plain.author(), null);
    assert.equal(plain.editor(), null);
    assert.equal(plain.pullRequest(), null);
});

/* ****************************************************************
 * PullRequest
 * **************************************************************** */

test('PullRequest の assignees() は、User の配列を返す。無いときは空の配列', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2pullRequest({
        __typename: 'PullRequest', id: 'PR_1', updatedAt: T1,
        assignees: { edges: [{ node: user('U_1', 'a') }] },
    });
    const b = sogh.node2pullRequest({ __typename: 'PullRequest', id: 'PR_2', updatedAt: T1 });

    assert.deepEqual(a.assignees(), [sogh.user('U_1')]);
    assert.deepEqual(b.assignees(), []);
});

/* ****************************************************************
 * ProjectV2
 * **************************************************************** */

test('ProjectV2 の creator()・ownerNode()・items() は、モデルを返す。owner() は README の $Owner のまま', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({
        __typename: 'ProjectV2',
        id: 'PVT_1',
        number: 3,
        readme: '$Owner: yanqirenshi',
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

    assert.equal(project.creator(), sogh.user('U_1'));
    assert.equal(project.ownerNode(), sogh.organization('O_1'));
    assert.equal(project.owner(), 'yanqirenshi');
    assert.deepEqual(project.items(), [sogh.projectV2Item('PVTI_1'), sogh.projectV2Item('PVTI_2')]);
    assert.deepEqual(project.itemsWith2ProjectV2Item(), project.items());
});

test('ProjectV2 の ownerNode() は、Issue・PullRequest のモデルも返す', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1,
        owner: { __typename: 'Issue', id: 'I_1', number: 1, updatedAt: T1 },
    });
    const b = sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_2', updatedAt: T1,
        owner: { __typename: 'PullRequest', id: 'PR_1', number: 2, updatedAt: T1 },
    });

    assert.equal(a.ownerNode(), sogh.issue('I_1'));
    assert.equal(b.ownerNode(), sogh.pullRequest('PR_1'));
});

test('Sogh の href("project-v2") は、creator() のモデルの login() を読む', ()=> {
    const sogh = new Sogh();

    sogh.routes({ 'project-v2': '/projects/:login/:number' });

    const project = sogh.node2projectV2({
        __typename: 'ProjectV2', id: 'PVT_1', number: 3, updatedAt: T1,
        creator: user('U_1', 'octocat'),
    });

    assert.equal(sogh.href('project-v2', project), '/projects/octocat/3');
});

/* ****************************************************************
 * ProjectV2Item
 * **************************************************************** */

function itemNode () {
    const field = (name)=> ({ name: name, dataType: 'X' });

    return {
        __typename: 'ProjectV2Item',
        id: 'PVTI_1',
        updatedAt: T1,
        project: { __typename: 'ProjectV2', id: 'PVT_1', number: 3, owner: { __typename: 'User', id: 'U_9', login: 'owner' }, updatedAt: T1 },
        content: { __typename: 'DraftIssue', id: 'DI_1', title: '下書き', updatedAt: T1 },
        creator: { __typename: 'EnterpriseUserAccount', id: 'E_1', login: 'ent', updatedAt: T1 },
        fieldValues: {
            nodes: [
                { __typename: 'ProjectV2ItemFieldTextValue', text: 'title', field: field('Title'), creator: user('U_C', 'c') },
                { __typename: 'ProjectV2ItemFieldUserValue', field: field('Assignees'), users: { nodes: [user('U_1', 'a')] } },
                { __typename: 'ProjectV2ItemFieldLabelValue', field: field('Labels'), labels: { nodes: [{ __typename: 'Label', id: 'L_1', name: 'bug' }] } },
                { __typename: 'ProjectV2ItemFieldMilestoneValue', field: field('Milestone'), milestone: { __typename: 'Milestone', id: 'MS_1', title: 'v1' } },
                { __typename: 'ProjectV2ItemFieldRepositoryValue', field: field('Repository'), repository: { __typename: 'Repository', id: 'R_1', name: 'repo' } },
                { __typename: 'ProjectV2ItemFieldPullRequestValue', field: field('Linked pull requests'), pullRequests: { nodes: [{ __typename: 'PullRequest', id: 'PR_1' }] } },
                {
                    __typename: 'ProjectV2ItemFieldReviewerValue',
                    field: field('Reviewers'),
                    reviewers: {
                        nodes: [
                            user('U_2', 'b'),
                            { __typename: 'Team', id: 'T_1', slug: 'core' },
                            { __typename: 'Mannequin', id: 'M_1', login: 'old' },
                            { __typename: 'Bot', id: 'B_1', login: 'bot' },
                        ],
                    },
                },
            ],
        },
    };
}

test('ProjectV2Item の関連を返すメソッドは、モデルを返す', ()=> {
    const sogh = new Sogh();

    const item = sogh.node2projectV2Item(itemNode());

    assert.equal(item.project(), sogh.projectV2('PVT_1'));
    assert.equal(item.content(), sogh.draftIssue('DI_1'));
    assert.equal(item.content().title(), '下書き');
    assert.equal(item.contentTypename(), 'DraftIssue');
    assert.equal(item.creator(), sogh.enterpriseUserAccount('E_1'));

    assert.deepEqual(item.assignees(), [sogh.user('U_1')]);
    assert.deepEqual(item.labels(), [sogh.label('L_1')]);
    assert.equal(item.milestone(), sogh.milestone('MS_1'));
    assert.equal(item.repository(), sogh.repository('R_1'));
    assert.deepEqual(item.linkedPullRequests(), [sogh.pullRequest('PR_1')]);
    assert.deepEqual(item.reviewers(), [sogh.user('U_2'), sogh.team('T_1'), sogh.mannequin('M_1'), sogh.bot('B_1')]);
});

test('ProjectV2Item の fieldValues() と、箱の creator は、JSON のまま', ()=> {
    const sogh = new Sogh();

    const item = sogh.node2projectV2Item(itemNode());

    assert.equal(item.title(), 'title');
    assert.equal(item.getFieldValueByName('Title').creator.login, 'c');
    assert.equal(item.getFieldValueByName('Assignees').users.nodes[0].login, 'a');
    assert.equal(item.projectNumber(), 3);
    assert.equal(item.projectOwnerLogin(), 'owner');
});

test('ProjectV2Item の関連が無いときは、空の配列か null を返す', ()=> {
    const sogh = new Sogh();

    const item = sogh.node2projectV2Item({
        __typename: 'ProjectV2Item', id: 'PVTI_1', updatedAt: T1, fieldValues: { nodes: [] },
    });

    assert.equal(item.project(), null);
    assert.equal(item.content(), null);
    assert.equal(item.contentTypename(), null);
    assert.equal(item.creator(), null);
    assert.deepEqual(item.assignees(), []);
    assert.deepEqual(item.labels(), []);
    assert.equal(item.milestone(), null);
    assert.equal(item.repository(), null);
    assert.deepEqual(item.linkedPullRequests(), []);
    assert.deepEqual(item.reviewers(), []);
});

/* ****************************************************************
 * 重ね方
 * **************************************************************** */

test('関連のモデルは、あとから重なった値を返す', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue(issueNode());

    // 同じ User の、項目の多い node があとから来る。
    sogh.node2user({ __typename: 'User', id: 'U_1', login: 'a', name: 'Alice', updatedAt: T1 });

    assert.equal(issue.assignees()[0].name(), 'Alice');
});
