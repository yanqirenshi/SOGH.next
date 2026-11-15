import React from 'react';

import { Section, P, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「3. 取得の仕様」。

// クエリの例。(queries/issue_comments_by_issue_id.js に、項目の部品を埋め込んだあとの形)
const QUERY_EXAMPLE = [
    '{',
    '  node(id: "@id") {                             ← 値の印',
    '    ... on Issue {',
    '      comments(after: "", first: 100) {         ← ページ送りの印 (page_nation)',
    '        nodes {                                 ← ここから下の nodes の中は、項目の部品 (issueCommentNode)',
    '          __typename id url body updatedAt ...  ← IssueComment の項目 (issue_comment)',
    '          pullRequest {',
    '            __typename id number updatedAt ...  ← PullRequest の参照の組 (pullRequestRef)',
    '          }',
    '          author {                              ← 型が複数ある場所 (actor)',
    '            __typename login url ...',
    '            ... on User { id updatedAt ... }    ← 型ごとに、id と updatedAt を取る',
    '            ... on Bot { id updatedAt ... }',
    '          }',
    '        }',
    '        pageInfo { endCursor hasNextPage ... }  ← 項目の部品 (page_info)',
    '      }',
    '    }',
    '  }',
    '}',
].join('\n');

// 値の渡し方。
const VALUE_COLUMNS = [
    { code: 'how',     label: '渡し方',           key: 'how' },
    { code: 'queries', label: '使っているクエリ', key: 'queries' },
    { code: 'syntax',  label: '書き方',           val: (r)=> r.syntax.map(s=> <div key={s}><C>{s}</C></div>) },
];

const VALUES = [
    { how: '印を、文字列で置き換える',
      queries: '取得のクエリ',
      syntax: ['node(id: "@id")', ".replace('@id', id)"] },
    { how: 'GraphQL の variables で渡す',
      queries: 'コメントの追加・更新・削除 (3 個)',
      syntax: ['mutation ($id: ID!, $body: String!)', 'postData(query, { id, body })'] },
    { how: 'オブジェクトを文字列にして、埋め込む',
      queries: 'Issue の作成・本文の更新 (2 個。いまは使われていない)',
      syntax: ['createIssue(input:@issue-data)', 'makeGraphQLData(data)'] },
];

// Sogh のメソッドから使われていないクエリ。
const UNUSED_QUERIES = [
    'assignees_by_repository',
    'labels_by_repository',
    'milestones_by_repository',
    'projects_by_repository',
    'project_by_id',
    'repository',
    'issues_by_repository',
    'issues_by_milestone',
    'issues_by_report_label',
    'issues_open_by_label',
    'issues_open_by_project_column',
    'issues_open_by_repository',
    'search_issues',
    'create_issue',
    'update_issue_body',
];

// クエリを検査するコマンド。
const CHECK_COMMAND = [
    '# 検査する',
    'npm run check:queries -- --schema <schema.docs.graphql の場所>',
    '',
    '# クエリを直す前に、取っている項目を書き出しておく',
    'npm run check:queries -- --schema <...> --dump before.json',
    '',
    '# クエリを直したあとに、前と比べる',
    'npm run check:queries -- --schema <...> --compare before.json',
].join('\n');

// いまのクエリを検査した結果。(37 個)
const CHECK_COLUMNS = [
    { code: 'kind',    label: '種類',   key: 'kind' },
    { code: 'count',   label: '個数',   key: 'count' },
    { code: 'queries', label: 'クエリ', val: (r)=> r.queries.map(q=> <div key={q}><C>{q}</C></div>) },
    { code: 'note',    label: '内容',   key: 'note' },
];

const CHECKS = [
    { kind: 'NG (使用中)',
      count: 1,
      queries: ['projects_next_items_by_id'],
      note: 'ProjectNextItem という型が、GitHub のスキーマから無くなっている。このクエリがあるので、検査は終了コード 1 で終わる' },
    { kind: 'NG (未使用)',
      count: 2,
      queries: ['create_issue', 'update_issue_body'],
      note: '入力の印 (@issue-data) を、検査のために空のオブジェクトに置き換えているため。クエリの間違いではない' },
    { kind: '注意',
      count: 7,
      queries: [
          'projectsv2_items_by_projects_v2',
          'projectsv2_with_items_by_team',
          'projectv2_by_org_login_projectv2_number',
          'projectv2item_by_id',
          'projectv2items_by_org_login_projectv2_number',
          'projectv2items_by_user_login_projectv2_number',
          'search_issues',
      ],
      note: 'ProjectV2Item の content で、Issue の state と PullRequest の state を取っている。型が違う (IssueState と PullRequestState) ので、GraphQL の決まりでは正しくない。GitHub は受け付ける (「3.8 GitHub につないで確かめる」を見る)' },
    { kind: 'キー (使用中)',
      count: 0,
      queries: [],
      note: '使用中のクエリは、データモデルになる型のすべてで、id と updatedAt を取っている' },
    { kind: 'キー (未使用)',
      count: 2,
      queries: ['issues_by_milestone', 'issues_by_report_label'],
      note: '項目を直に書いていて、updatedAt を取っていない所がある' },
];

// GitHub につないで確かめるコマンド。
const LIVE_COMMAND = [
    '# トークンの置き場所を作る (1 回だけ)',
    'cp .env.local.template .env.local',
    '',
    '# 確かめる',
    'npm run check:live',
].join('\n');

// GitHub につないで確かめた結果。(2026-11-15)
const LIVE_COLUMNS = [
    { code: 'kind',    label: '結果',   key: 'kind' },
    { code: 'count',   label: '個数',   key: 'count' },
    { code: 'queries', label: 'クエリ', val: (r)=> r.queries.map(q=> <div key={q}><C>{q}</C></div>) },
    { code: 'note',    label: '内容',   key: 'note' },
];

const LIVES = [
    { kind: 'OK',
      count: 12,
      queries: [
          'viwer',
          'user_by_id',
          'repositories_by_viewer',
          'issues_by_viwer',
          'issue_by_id',
          'issue_comments_by_issue_id',
          'projectsv2_by_user',
          'projects_next_by_id',
          'projectv2_by_user_login_projectv2_number',
          'projectsv2_items_by_projects_v2',
          'projectv2items_by_user_login_projectv2_number',
          'projectv2item_by_id',
      ],
      note: 'GitHub が、エラーを返さなかった。検査で「注意」になる 3 つ (Issue と PullRequest の state を同じ場所で取るもの) も、GitHub は受け付けた。issue_by_id は、はじめは NG で、projectCards (Projects classic) を外して OK になった' },
    { kind: 'NG',
      count: 0,
      queries: [],
      note: '-' },
    { kind: '送っていない (対象を決めていない)',
      count: 6,
      queries: [
          'issue_by_org_repo_issue_number',
          'issue_comments_by_org_repo_issue_number',
          'projectv2_by_org_login_projectv2_number',
          'projectv2items_by_org_login_projectv2_number',
          'projectsv2_by_team',
          'projectsv2_with_items_by_team',
      ],
      note: '組織 (org) とチームのクエリ。.env.local に対象を書くと、送る' },
    { kind: '送らない',
      count: 4,
      queries: [
          'create_issue_comment',
          'update_issue_comment',
          'delete_issue_comment',
          'projects_next_items_by_id',
      ],
      note: '上の 3 つは、書き込みのため。projects_next_items_by_id は、スキーマの検査で NG のため' },
];

// 取得メソッドの一覧。(src/js/Sogh.js)
const COLUMNS = [
    { code: 'target',  label: '取得するもの', key: 'target' },
    { code: 'methods', label: 'メソッド',     val: (r)=> r.methods.map(m=> <div key={m}><C>{m}</C></div>) },
    { code: 'style',   label: '形式',         key: 'style' },
    { code: 'paging',  label: 'ページング',   key: 'paging' },
    { code: 'returns', label: '戻り値',       key: 'returns' },
];

const CALLBACK = 'コールバック';
const ASYNC = 'async';

const METHODS = [
    { target: 'viewer',                     methods: ['connect'],                                                                                                  style: CALLBACK, paging: '-',        returns: 'User' },
    { target: 'viewer',                     methods: ['asyncFetchViewer'],                                                                                         style: ASYNC,    paging: '-',        returns: 'Viewer' },
    { target: 'viewer のリポジトリ',        methods: ['asyncFetchRepositoriesByViewer'],                                                                           style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'viewer のリポジトリ',        methods: ['fetchRepositoriesByViewer'],                                                                                style: CALLBACK, paging: '1 ページ', returns: '{ contents, pageInfo }' },
    { target: 'User',                       methods: ['fetchUserByID'],                                                                                            style: CALLBACK, paging: '-',        returns: '{ contents }' },
    { target: 'Issue (id)',                 methods: ['asyncFetchIssueByID', 'asyncFetchItemByID'],                                                                style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'Issue (org・repo・番号)',    methods: ['asyncFetchIssueByOrgRepoIssueNumber'],                                                                      style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'viewer の Issue (OPEN)',     methods: ['asyncFetchIssueByViewer'],                                                                                  style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'Issue のコメント',           methods: ['asyncFetchIssueCommentsByID', 'asyncFetchIssueCommentsByOrgRepoIssueNumber'],                               style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'コメントの追加・更新・削除', methods: ['createIssueComment', 'updateIssueComment', 'deleteIssueComment'],                                           style: CALLBACK, paging: '-',        returns: '-' },
    { target: 'ProjectV2 (viewer)',         methods: ['asyncFetchProjectsV2ByViewer'],                                                                             style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'ProjectV2 (team)',           methods: ['asyncFetchProjectsV2ByTeam', 'asyncFetchProjectsV2WithItemsByTeam'],                                        style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'ProjectV2 (1 件)',           methods: ['asyncFetchProjectV2ByUserLoginProjectV2Number', 'asyncFetchProjectV2ByOrgLoginProjectV2Number'],            style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'ProjectV2 の Item',          methods: ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', 'asyncFetchProjectV2ItemsByOrgLoginProjectV2Number'],  style: ASYNC,    paging: '1 ページ', returns: 'id の配列' },
    { target: 'ProjectV2 の Item (1 件)',   methods: ['asyncFetchProjectV2ItemByID'],                                                                              style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'ProjectV2 の Item (旧)',     methods: ['fetchProjectV2ItemsByProjectNext'],                                                                         style: CALLBACK, paging: '1 ページ', returns: '{ contents, fields, pageInfo }' },
];

export default function Fetching () {
    return (
        <Section title="取得の仕様" num="3." lev="4" sx={SX_MEMBER_TITLE}>

          <Section title="クエリの作り方" num="3.1" lev="5">
            <P>クエリは、3 つの層で組み立てます。</P>
            <OL>
              <LI>項目の部品。(<C>queries/attributes.js</C>)
                <UL>
                  <LI>「この型からは、この項目を取る」という文字列を返す関数。57 個ある。</LI>
                  <LI>型ごとの部品と、その決まりは、「5.3 型ごとの、項目の部品」を見る。</LI>
                </UL>
              </LI>
              <LI>クエリの本体。(src/js/queries/ の 1 ファイルに 1 クエリ)
                <UL>
                  <LI>GraphQL の形 (どこから、何を入れ子で取るか) を書いた文字列。37 個ある。</LI>
                  <LI>項目のところに、項目の部品を埋め込む。</LI>
                </UL>
              </LI>
              <LI>取得メソッド。(<C>Sogh.js</C>)
                <UL>
                  <LI>クエリに、値とページ送りの位置を入れて送る。</LI>
                  <LI>応答から、必要な部分を取り出す。</LI>
                </UL>
              </LI>
            </OL>

            <P>例: Issue のコメントを取るクエリ。(項目の部品を埋め込んだあとの形)</P>
            <Plane sx={SX_PLANE}>{QUERY_EXAMPLE}</Plane>

            <P>組み立ての流れは、次のとおりです。(<C>asyncFetchIssueCommentsByID(id)</C> の例)</P>
            <OL>
              <LI>読み込んだときに 1 回だけ、クエリのファイルが、項目の部品を埋め込んだ文字列を作る。</LI>
              <LI>呼んだときに、<C>query('issue_comments_by_issue_id')</C> で、クエリの文字列を名前で引く。</LI>
              <LI><C>{".replace('@id', id)"}</C> で、値の印を値に置き換える。</LI>
              <LI><C>makeQuery(query, cursor)</C> で、ページ送りの印を置き換える。</LI>
              <LI><C>postData(query)</C> で、リクエストの本文にして送る。</LI>
              <LI>応答から、<C>d.data.node.comments</C> を取り出す。</LI>
              <LI><C>pageInfo.hasNextPage</C> が true なら、ページ送りの印の置き換えに戻る。</LI>
            </OL>

            <P>値の渡し方は、3 通りあります。</P>
            <Table columns={VALUE_COLUMNS} rows={VALUES} ids={TABLE_IDS}/>
          </Section>

          <Section title="ページング" num="3.2" lev="5">
            <OL>
              <LI>一覧のクエリには、<C>{'after: "", first: 100'}</C> という印が入っている。
                <UL>
                  <LI><C>attributes.page_nation()</C> で入れているクエリが、9 個。</LI>
                  <LI>クエリに直に書いているクエリが、11 個。</LI>
                </UL>
              </LI>
              <LI><C>makeQuery(query, cursor)</C> が、<C>{'after: "",'}</C> を書き換える。
                <UL>
                  <LI>cursor があれば、<C>{'after: "<cursor>",'}</C> にする。</LI>
                  <LI>無ければ、消す。</LI>
                </UL>
              </LI>
              <LI>書き換えるのは、最初に見つかった 1 か所だけ。
                <UL>
                  <LI>ページ送りできるのは、1 つのクエリにつき 1 か所になる。</LI>
                  <LI>入れ子の一覧 (assignees など) は、件数を直に書いている。(<C>first: 10</C> など)</LI>
                </UL>
              </LI>
              <LI>asyncFetch〜 は、<C>pageInfo.hasNextPage</C> が false になるまで繰り返して、全件を集める。</LI>
              <LI>fetch〜 (古い形) は、1 ページ目しか取らない。</LI>
            </OL>
          </Section>

          <Section title="取得メソッドの一覧" num="3.3" lev="5">
            <Table columns={COLUMNS} rows={METHODS} ids={TABLE_IDS}/>
            <P sx={SX_AFTER_TABLE}>async のメソッドは、モデルではなく id を返します。モデルは、id で Pool から引きます。(<C>sogh.issue(id)</C> など)</P>
          </Section>

          <Section title="コールバックの決まり" num="3.4" lev="5">
            <OL>
              <LI>fetch〜 (古い形) は、<C>success(out)</C> と <C>error(out)</C> を呼ぶ。</LI>
              <LI>更新と、一部の asyncFetch〜 は、<C>{'callbacks = { start, successed, failed, fetched }'}</C> を受け取る。</LI>
              <LI>はじめに <C>start</C> を呼び、終わったら <C>successed</C> か <C>failed</C> を呼ぶ。</LI>
              <LI><C>fetched</C> は、1 ページ取るたびに呼ぶ。(team の ProjectV2 だけ)</LI>
            </OL>
          </Section>

          <Section title="エラーの扱い" num="3.5" lev="5">
            <OL>
              <LI>HTTP のステータスが 2xx でなければ、<C>text2json(r)</C> が失敗 (reject) にする。</LI>
              <LI>HTTP 200 でも、レスポンスに errors があれば、<C>json2response(r, getData)</C> が Error を投げる。(message を改行でつなぐ)</LI>
              <LI>投げた Error は、<C>error2response(error)</C> で <C>{"{ type: 'error', data: error }"}</C> にする。</LI>
              <LI>失敗したときの戻り値は、メソッドごとに違う。(「6. 気づいた点」を見る)</LI>
            </OL>
          </Section>

          <Section title="クエリの使われ方" num="3.6" lev="5">
            <P>クエリは 37 個あり、Sogh のメソッドから使われているのは 22 個です。</P>
            <OL>
              <LI>使われているもの。(22 個)
                <UL>
                  <LI>viewer・リポジトリ・Issue・コメント・ProjectV2・ProjectV2Item のクエリ。</LI>
                </UL>
              </LI>
              <LI>使われていないもの。(15 個)
                <UL>
                  <LI>{UNUSED_QUERIES.map(q=> <span key={q}><C>{q}</C>{' '}</span>)}</LI>
                  <LI>iHub のコア (ihub.core) からも、名前で引いている場所は無い。</LI>
                  <LI>多くは Projects (classic) のころのもので、項目を、部品を使わずに直に書いている。</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="クエリの検査" num="3.7" lev="5">
            <P>クエリは、GitHub が公開している GraphQL のスキーマで検査できます。GitHub にはつながず、トークンも要りません。</P>
            <Plane sx={SX_PLANE}>{CHECK_COMMAND}</Plane>
            <OL>
              <LI>スキーマのファイル (<C>schema.docs.graphql</C>) は、GitHub のドキュメントのサイトから取る。(リポジトリには入れていない)
                <UL>
                  <LI>https://docs.github.com/public/fpt/schema.docs.graphql</LI>
                </UL>
              </LI>
              <LI>検査すること。
                <UL>
                  <LI>クエリが、GraphQL として読めるか。</LI>
                  <LI>スキーマに無い型・項目を使っていないか。(NG)</LI>
                  <LI>型の違う項目を、同じ名前で、同じ場所に取っていないか。(注意)</LI>
                  <LI>データモデルになる型の項目を取る場所で、id と updatedAt を取っているか。(キー)</LI>
                </UL>
              </LI>
              <LI><C>--dump</C> で「取っている項目」の一覧を書き出し、<C>--compare</C> で前後を比べられる。
                <UL>
                  <LI>クエリを直したときに、項目が減っていないことを確かめるために使う。</LI>
                </UL>
              </LI>
              <LI>スクリプトは、<C>scripts/check-queries.mjs</C>。</LI>
            </OL>

            <P>いまのクエリを検査した結果は、次のとおりです。</P>
            <Table columns={CHECK_COLUMNS} rows={CHECKS} ids={TABLE_IDS}/>
          </Section>

          <Section title="GitHub につないで確かめる" num="3.8" lev="5">
            <P>使用中のクエリを、GitHub に実際に送って確かめられます。読むだけで、書き込みのクエリは送りません。</P>
            <Plane sx={SX_PLANE}>{LIVE_COMMAND}</Plane>
            <OL>
              <LI>トークンは、リポジトリの直下の <C>.env.local</C> に、<C>GITHUB_TOKEN</C> として書く。
                <UL>
                  <LI><C>.env.local.template</C> を写して作る。</LI>
                  <LI><C>.env.local</C> は、git に入らない。画面のビルドにも入らない。</LI>
                  <LI>読むだけなので、読み取りの権限で足りる。(classic のトークンでは、repo・read:org・read:project・read:user・user:email)</LI>
                </UL>
              </LI>
              <LI>確かめること。
                <UL>
                  <LI>クエリを 1 回ずつ送り、GitHub がエラーを返さないか。</LI>
                  <LI>Sogh で取得して、取り直しても値が消えないか。変更が無ければ、reload が入らないか。</LI>
                </UL>
              </LI>
              <LI>viewer・リポジトリ・Issue・ProjectV2 のクエリは、viewer のデータから、対象を自動で選ぶ。</LI>
              <LI>組織 (org) とチームのクエリは、<C>.env.local</C> に対象 (<C>CHECK_ORG</C> など) を書いたときだけ送る。</LI>
              <LI>トークンと、取得した値は、表示しない。(表示するのは、クエリの名前・件数・エラーの文)</LI>
              <LI>スクリプトは、<C>scripts/check-live.mjs</C>。</LI>
            </OL>

            <P>2026-11-15 に確かめた結果は、次のとおりです。</P>
            <Table columns={LIVE_COLUMNS} rows={LIVES} ids={TABLE_IDS}/>
          </Section>

        </Section>
    );
}
