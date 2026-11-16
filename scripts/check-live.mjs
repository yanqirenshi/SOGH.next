// GitHub に実際につないで、クエリと、node の重ね方を確かめる。
//
// 使い方:
//   npm run check:live
//
// トークンの置き場所 (どちらか):
//   1. リポジトリの直下の .env.local に、GITHUB_TOKEN=<トークン> と書く。(.env.local.template を写して作る)
//   2. 環境変数 GITHUB_TOKEN に入れる。(こちらが先に使われる)
// 環境変数 CHECK_ENV_FILE があれば、.env.local の代わりに、そのパスの設定ファイルを読む。(scripts/env-file.mjs)
//
// 確かめること:
//   A. クエリの確認 … 使用中のクエリを 1 回ずつ送り、GitHub がエラーを返さないかを見る。
//   B. 重ね方の確認 … Sogh で取得して、取り直しても値が消えないこと、変更が無ければ reload が入らないことを見る。
//   C. 関連の確認   … 関連を返すメソッドが、core の JSON にある関連の数だけ、モデルを返すかを見る。
//
// 安全のための決まり:
//   - 読むだけ。書き込み (コメントの追加・更新・削除) のクエリは、送らない。
//   - トークンは、どこにも表示しない。
//   - 表示するのは、クエリの名前・件数・エラーの文だけ。(取得した値そのものは表示しない)
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Sogh from '../src/js/Sogh.js';

import { envFilePath, makeGetter, warnMissingEnvFile } from './env-file.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = envFilePath(ROOT);

/* ****************************************************************
 * 設定
 * **************************************************************** */

function config () {
    warnMissingEnvFile(ENV_FILE);

    const get = makeGetter(ENV_FILE);

    return {
        token: get('GITHUB_TOKEN'),
        // org のクエリを確かめるときの対象。(無ければ、そのクエリは飛ばす)
        org: get('CHECK_ORG'),
        repo: get('CHECK_REPO'),
        issue_number: get('CHECK_ISSUE_NUMBER'),
        project_number: get('CHECK_PROJECT_NUMBER'),
        team_id: get('CHECK_TEAM_ID'),
    };
}

/* ****************************************************************
 * A. クエリの確認
 * **************************************************************** */

const results = [];

function record (code, state, note='') {
    results.push({ code, state, note });

    console.log(`${state.padEnd(4)} ${code}${note ? `  … ${note}` : ''}`);
}

// クエリを 1 回送る。
//   marks … 値の印の置き換え。({ '@id': 'xxx' })
//   count … 応答から、取れた件数を数える関数。(表示用)
// 成功したら応答の data を、失敗したら null を返す。
async function send (sogh, code, marks, count) {
    let query = sogh.query(code);

    for (const [mark, value] of Object.entries(marks || {}))
        query = query.replace(mark, value);

    // ページ送りの印を外す。(1 ページ目だけを取る)
    query = sogh.makeQuery(query, null);

    let response;

    try {
        response = await fetch(sogh.endpoint(), sogh.postData(query));
    } catch (e) {
        record(code, 'NG', `つながらない: ${e.message}`);
        return null;
    }

    if (!response.ok) {
        record(code, 'NG', `HTTP ${response.status}`);
        return null;
    }

    const json = await response.json();

    if (json.errors) {
        const messages = [...new Set(json.errors.map(e=> e.message))];

        record(code, 'NG', `${messages.slice(0, 3).join(' / ')}${messages.length > 3 ? ` ほか ${messages.length - 3} 件` : ''}`);
        return null;
    }

    record(code, 'OK', count ? count(json.data) : '');

    return json.data;
}

function skip (code, reason) {
    record(code, '飛ばす', reason);
}

const n = (label, list)=> `${label} ${list ? list.length : 0} 件`;

async function checkQueries (sogh, conf) {
    console.log('== A. クエリの確認 ==');

    // viewer
    const viewer_data = await send(sogh, 'viwer');

    if (!viewer_data)
        return false;

    const viewer = viewer_data.viewer;

    await send(sogh, 'user_by_id', { '@id': viewer.id });

    // リポジトリ
    await send(sogh, 'repositories_by_viewer', null, d=> n('リポジトリ', d.viewer.repositories.nodes));

    // Issue
    const issues_data = await send(sogh, 'issues_by_viwer', null, d=> n('Issue', d.viewer.issues.nodes));
    const issue = issues_data && issues_data.viewer.issues.nodes[0];

    if (issue) {
        await send(sogh, 'issue_by_id', { '@id': issue.id });
        await send(sogh, 'issue_comments_by_issue_id', { '@id': issue.id }, d=> n('コメント', d.node.comments.nodes));
    } else {
        skip('issue_by_id', 'viewer が作った OPEN の Issue が無い');
        skip('issue_comments_by_issue_id', 'viewer が作った OPEN の Issue が無い');
    }

    // ProjectV2 (viewer)
    const projects_data = await send(sogh, 'projectsv2_by_user', { '@login': viewer.login }, d=> n('ProjectV2', d.user.projectsV2.nodes));
    const project = projects_data && projects_data.user.projectsV2.nodes[0];

    if (project) {
        await send(sogh, 'projects_next_by_id', { '@id': project.id });
        await send(sogh, 'projectv2_by_user_login_projectv2_number', { '@user-login': viewer.login, '@projectv2-number': project.number });

        const items_data = await send(sogh, 'projectsv2_items_by_projects_v2', { '@id': project.id }, d=> n('Item', d.node.items.nodes));
        const item = items_data && items_data.node.items.nodes[0];

        await send(sogh, 'projectv2items_by_user_login_projectv2_number',
                   { '@user-login': viewer.login, '@projectv2-number': project.number },
                   d=> n('Item', d.user.projectV2.items.nodes));

        if (item)
            await send(sogh, 'projectv2item_by_id', { '@id': item.id });
        else
            skip('projectv2item_by_id', 'ProjectV2 に Item が無い');
    } else {
        for (const code of ['projects_next_by_id', 'projectv2_by_user_login_projectv2_number', 'projectsv2_items_by_projects_v2', 'projectv2items_by_user_login_projectv2_number', 'projectv2item_by_id'])
            skip(code, 'viewer の ProjectV2 が無い');
    }

    // org の Issue
    if (conf.org && conf.repo && conf.issue_number) {
        const marks = { '@login': conf.org, '@name': conf.repo, '@number': conf.issue_number };

        await send(sogh, 'issue_by_org_repo_issue_number', marks);
        await send(sogh, 'issue_comments_by_org_repo_issue_number', marks, d=> n('コメント', d.organization.repository.issue.comments.nodes));
    } else {
        skip('issue_by_org_repo_issue_number', 'CHECK_ORG・CHECK_REPO・CHECK_ISSUE_NUMBER が無い');
        skip('issue_comments_by_org_repo_issue_number', 'CHECK_ORG・CHECK_REPO・CHECK_ISSUE_NUMBER が無い');
    }

    // org の ProjectV2
    if (conf.org && conf.project_number) {
        const marks = { '@user-login': conf.org, '@projectv2-number': conf.project_number };

        await send(sogh, 'projectv2_by_org_login_projectv2_number', marks);
        await send(sogh, 'projectv2items_by_org_login_projectv2_number', marks, d=> n('Item', d.organization.projectV2.items.nodes));
    } else {
        skip('projectv2_by_org_login_projectv2_number', 'CHECK_ORG・CHECK_PROJECT_NUMBER が無い');
        skip('projectv2items_by_org_login_projectv2_number', 'CHECK_ORG・CHECK_PROJECT_NUMBER が無い');
    }

    // team の ProjectV2
    if (conf.team_id) {
        await send(sogh, 'projectsv2_by_team', { '@team-id': conf.team_id }, d=> n('ProjectV2', d.node.projectsV2.edges));
        await send(sogh, 'projectsv2_with_items_by_team', { '@team-id': conf.team_id }, d=> n('ProjectV2', d.node.projectsV2.edges));
    } else {
        skip('projectsv2_by_team', 'CHECK_TEAM_ID が無い');
        skip('projectsv2_with_items_by_team', 'CHECK_TEAM_ID が無い');
    }

    // 送らないもの
    skip('projects_next_items_by_id', 'ProjectNextItem という型が、GitHub から無くなっている (スキーマの検査で NG)');
    skip('create_issue_comment', '書き込みなので、送らない');
    skip('update_issue_comment', '書き込みなので、送らない');
    skip('delete_issue_comment', '書き込みなので、送らない');

    return true;
}

/* ****************************************************************
 * B. 重ね方の確認
 * **************************************************************** */

const checks = [];

function check (label, ok, note='') {
    checks.push({ label, ok });

    console.log(`${ok ? 'OK  ' : 'NG  '} ${label}${note ? `  … ${note}` : ''}`);
}

// Pool のモデルの core を、文字列にして覚える。(取り直しの前後で、変わっていないかを比べるため)
const snapshot = (models)=> new Map(models.map(m=> [m.id(), JSON.stringify(m.core())]));

function changed (before, models) {
    return models.filter(m=> before.get(m.id()) !== JSON.stringify(m.core())).length;
}

async function checkMerge (token) {
    console.log('');
    console.log('== B. 重ね方の確認 ==');

    const sogh = new Sogh();

    // viewer を、User として Pool に入れる。(connect と同じ)
    await sogh.connect(token);

    const viewer = sogh.viewer();

    if (!viewer) {
        check('connect で viewer を取得できる', false);
        return;
    }

    check('connect で viewer を取得できる', true);

    // 値そのものは表示しないので、「値が入っているか」だけを覚える。
    const has = ()=> ({ name: viewer.name()!==null, email: viewer.email()!==null, company: viewer.company()!==null });
    const before = has();

    // リポジトリを取る。(owner として、viewer の項目の少ない node が来る)
    const repository_ids = await sogh.asyncFetchRepositoriesByViewer();
    const repositories = repository_ids.map(id=> sogh.repository(id));
    // owner() は、Pool のモデルを返す。viewer が owner なら、viewer と同じモデルになる。
    const owned = repositories.filter(r=> r.owner() === viewer).length;

    console.log(`     リポジトリ ${repositories.length} 件。うち、viewer が owner のもの ${owned} 件。`);

    const after = has();

    check('リポジトリを取っても、viewer の name・email・company が消えない',
          before.name === after.name && before.email === after.email && before.company === after.company,
          `前 ${JSON.stringify(before)} → 後 ${JSON.stringify(after)}`);

    check('リポジトリを取っても、viewer の reload は入らない (GitHub 側の変更が無いので)', viewer.reload() === null);

    // 同じものを取り直す。(GitHub 側の変更が無ければ、何も変わらないはず)
    const repository_cores = snapshot(repositories);

    await sogh.asyncFetchRepositoriesByViewer();

    check('リポジトリを取り直しても、core が変わらない',
          changed(repository_cores, repositories) === 0,
          `変わったもの ${changed(repository_cores, repositories)} 件`);

    check('リポジトリを取り直しても、reload が入らない',
          repositories.filter(r=> r.reload() !== null).length === 0,
          `reload が入ったもの ${repositories.filter(r=> r.reload() !== null).length} 件`);

    // ProjectV2 も同じ。
    const project_ids = await sogh.asyncFetchProjectsV2ByViewer();
    const projects = project_ids.map(id=> sogh.projectV2(id));

    console.log(`     ProjectV2 ${projects.length} 件。`);

    if (projects.length > 0) {
        const project_cores = snapshot(projects);

        await sogh.asyncFetchProjectsV2ByViewer();

        check('ProjectV2 を取り直しても、core が変わらない',
              changed(project_cores, projects) === 0,
              `変わったもの ${changed(project_cores, projects)} 件`);

        check('ProjectV2 を取り直しても、reload が入らない',
              projects.filter(p=> p.reload() !== null).length === 0);
    }

    // どのモデルも、id と updatedAt を持っている。
    const models = [viewer, ...repositories, ...projects];
    const no_updated_at = models.filter(m=> !m.updatedAt()).length;

    check('取得したモデルが、updatedAt を持っている', no_updated_at === 0, `持っていないもの ${no_updated_at} 件 / ${models.length} 件`);

    await checkRelations(sogh, repositories, projects);
}

/* ****************************************************************
 * C. 関連の確認
 * **************************************************************** */

// 関連を返すメソッドが、core の JSON にある関連の数だけ、モデルを返すかを見る。
// (Matchmaker が、入れ子の node を Pool に入れていれば、数が合う)
async function checkRelations (sogh, repositories, projects) {
    console.log('');
    console.log('== C. 関連の確認 ==');

    const count = (connection)=> {
        if (!connection) return 0;
        if (Array.isArray(connection.nodes)) return connection.nodes.filter(n=> n && n.id).length;
        if (Array.isArray(connection.edges)) return connection.edges.filter(e=> e && e.node && e.node.id).length;
        return 0;
    };
    const one = (node)=> (node && node.id) ? 1 : 0;
    const isModel = (obj)=> obj !== null && typeof obj.id === 'function';

    // 合わなかった関連の数を、名前ごとに数える。
    const misses = {};
    let total = 0;
    const expect = (name, expected, got)=> {
        total++;
        if (expected !== got)
            misses[name] = (misses[name] || 0) + 1;
    };
    const expectOne = (name, node, obj)=> expect(name, one(node), isModel(obj) ? 1 : 0);
    const expectList = (name, connection, list)=> expect(name, count(connection), list.filter(isModel).length);

    for (const r of repositories)
        expectOne('Repository.owner', r.core().owner, r.owner());

    for (const p of projects) {
        expectOne('ProjectV2.creator', p.core().creator, p.creator());
        expectOne('ProjectV2.owner', p.core().owner, p.ownerNode());
        expectList('ProjectV2.items', p.core().items, p.items());
    }

    const issue_ids = await sogh.asyncFetchIssueByViewer();
    const issues = issue_ids.map(id=> sogh.issue(id));

    console.log(`     viewer の Issue ${issues.length} 件。`);

    for (const i of issues) {
        const core = i.core();

        expectList('Issue.assignees', core.assignees, i.assignees());
        expectOne('Issue.author', core.author, i.author());
        expectList('Issue.labels', core.labels, i.labels());
        expectOne('Issue.milestone', core.milestone, i.milestone());
        expectOne('Issue.repository', core.repository, i.repository());
    }

    const items = sogh.pool('project-v2-item').list();

    for (const item of items) {
        const core = item.core();

        expectOne('ProjectV2Item.project', core.project, item.project());
        expectOne('ProjectV2Item.content', core.content, item.content());
        expectOne('ProjectV2Item.creator', core.creator, item.creator());
    }

    console.log(`     ProjectV2Item ${items.length} 件。`);

    const counts = ['user', 'organization', 'bot', 'mannequin', 'enterprise-user-account', 'team', 'draft-issue', 'label', 'milestone']
          .map(code=> `${code} ${sogh.pool(code).list().length}`)
          .join('・');

    console.log(`     Pool の件数: ${counts}`);

    check('関連を返すメソッドが、core の JSON にある数だけモデルを返す',
          Object.keys(misses).length === 0,
          `合わなかったもの ${JSON.stringify(misses)} / 調べた関連 ${total} 個`);
}

/* ****************************************************************
 * main
 * **************************************************************** */

async function main () {
    const conf = config();

    if (!conf.token) {
        console.error('トークンがありません。');
        console.error(`${ENV_FILE} に GITHUB_TOKEN=<トークン> と書くか、環境変数 GITHUB_TOKEN に入れてください。`);
        console.error('(.env.local.template を、.env.local という名前で写して使えます)');
        process.exitCode = 2;
        return;
    }

    const sogh = new Sogh();

    sogh.token(conf.token);

    const connected = await checkQueries(sogh, conf);

    if (connected)
        await checkMerge(conf.token);

    const ng = results.filter(r=> r.state === 'NG').length;
    const ok = results.filter(r=> r.state === 'OK').length;
    const skipped = results.filter(r=> r.state === '飛ばす').length;
    const check_ng = checks.filter(c=> !c.ok).length;

    console.log('');
    console.log(`クエリ: OK ${ok} 個・NG ${ng} 個・飛ばした ${skipped} 個。`);
    console.log(`重ね方・関連: OK ${checks.length - check_ng} 個・NG ${check_ng} 個。`);

    // process.exit() は使わない。(Windows で、通信を閉じている途中に呼ぶと、Node が異常終了するため)
    process.exitCode = ng === 0 && check_ng === 0 ? 0 : 1;
}

main();
