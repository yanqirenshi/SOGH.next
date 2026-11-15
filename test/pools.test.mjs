// Pool と、__typename でモデルを選ぶ動き (Pooler の node2model) のテスト。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの node を Pool に入れて確かめる。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import * as model from '../src/js/models/index.js';

const T1 = '2026-11-01T09:00:00Z';

test('Pool は 15 ある', ()=> {
    const sogh = new Sogh();

    const codes = [
        'repository',
        'user',
        'project-v2',
        'project-v2-item',
        'issue',
        'issue-comment',
        'pull-request',
        'organization',
        'bot',
        'mannequin',
        'enterprise-user-account',
        'draft-issue',
        'team',
        'label',
        'milestone',
    ];

    assert.equal(Object.keys(sogh._pools).length, 15);

    for (const code of codes)
        assert.ok(sogh.pool(code), code);
});

test('__typename に合うモデルを作って、その Pool に入れる', ()=> {
    const sogh = new Sogh();

    const cases = [
        ['User',                  model.User,                  'user'],
        ['Organization',          model.Organization,          'organization'],
        ['Bot',                   model.Bot,                   'bot'],
        ['Mannequin',             model.Mannequin,             'mannequin'],
        ['EnterpriseUserAccount', model.EnterpriseUserAccount, 'enterprise-user-account'],
        ['Team',                  model.Team,                  'team'],
        ['DraftIssue',            model.DraftIssue,            'draft-issue'],
        ['Label',                 model.Label,                 'label'],
        ['Milestone',             model.Milestone,             'milestone'],
        ['Repository',            model.Repository,            'repository'],
        ['Issue',                 model.Issue,                 'issue'],
        ['IssueComment',          model.IssueComment,          'issue-comment'],
        ['PullRequest',           model.PullRequest,           'pull-request'],
        ['ProjectV2',             model.ProjectV2,             'project-v2'],
        ['ProjectV2Item',         model.ProjectV2Item,         'project-v2-item'],
    ];

    for (const [typename, klass, code] of cases) {
        const id = `ID_${typename}`;

        const obj = sogh.node2model({ __typename: typename, id: id, updatedAt: T1 });

        assert.ok(obj instanceof klass, typename);
        assert.equal(sogh.pool(code).get(id), obj, typename);
        assert.equal(sogh.get(id), obj, typename);
        assert.equal(obj.sogh(), sogh, typename);
    }
});

test('同じ id の node は、同じモデルに重なる', ()=> {
    const sogh = new Sogh();

    const a = sogh.node2model({ __typename: 'Organization', id: 'O_1', login: 'acme', updatedAt: T1 });
    const b = sogh.node2model({ __typename: 'Organization', id: 'O_1', name: 'ACME', updatedAt: T1 });

    assert.equal(a, b);
    assert.equal(a.login(), 'acme');
    assert.equal(a.name(), 'ACME');
    assert.equal(sogh.pool('organization').list().length, 1);
});

test('node が無い・id が無い・知らない型のときは、null を返して、Pool に入れない', ()=> {
    const sogh = new Sogh();

    assert.equal(sogh.node2model(null), null);
    assert.equal(sogh.node2model(undefined), null);
    assert.equal(sogh.node2model({ __typename: 'User', login: 'ghost' }), null);
    assert.equal(sogh.node2model({ __typename: 'Unknown', id: 'X_1' }), null);
    assert.equal(sogh.node2model({ id: 'X_2' }), null);

    assert.equal(sogh.get('X_1'), null);
    assert.equal(sogh.get('X_2'), null);
});

test('新しいモデルは、core の値を読める', ()=> {
    const sogh = new Sogh();

    const org = sogh.node2organization({
        id: 'O_1', login: 'acme', name: 'ACME', email: 'a@example.com',
        url: 'https://github.com/acme', avatarUrl: 'https://example.com/a.png', resourcePath: '/acme',
    });
    assert.equal(org.login(), 'acme');
    assert.equal(org.name(), 'ACME');
    assert.equal(org.email(), 'a@example.com');
    assert.equal(org.url(), 'https://github.com/acme');
    assert.equal(org.avatarUrl(), 'https://example.com/a.png');
    assert.equal(org.resourcePath(), '/acme');

    const bot = sogh.node2bot({ id: 'B_1', login: 'dependabot', url: 'u', avatarUrl: 'a', resourcePath: 'r' });
    assert.equal(bot.login(), 'dependabot');
    assert.equal(bot.resourcePath(), 'r');

    const mannequin = sogh.node2mannequin({ id: 'M_1', login: 'old', email: 'o@example.com' });
    assert.equal(mannequin.login(), 'old');
    assert.equal(mannequin.email(), 'o@example.com');

    const account = sogh.node2enterpriseUserAccount({ id: 'E_1', login: 'ent', name: 'Ent' });
    assert.equal(account.login(), 'ent');
    assert.equal(account.name(), 'Ent');

    const draft = sogh.node2draftIssue({ id: 'D_1', title: '下書き' });
    assert.equal(draft.title(), '下書き');

    const team = sogh.node2team({ id: 'T_1', slug: 'core' });
    assert.equal(team.slug(), 'core');

    const label = sogh.node2label({ id: 'L_1', name: 'bug', color: 'd73a4a' });
    assert.equal(label.name(), 'bug');
    assert.equal(sogh.label('L_1'), label);

    const milestone = sogh.node2milestone({ id: 'MS_1', title: 'v1', number: 1 });
    assert.equal(milestone.title(), 'v1');
    assert.equal(sogh.milestone('MS_1'), milestone);
});
