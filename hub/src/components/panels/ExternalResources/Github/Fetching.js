import React from 'react';

import { Section, P, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「3. 取得の仕様」。

// クエリの例。(queries/issue_comments_by_issue_id.js に、項目の部品を埋め込んだあとの形)
const QUERY_EXAMPLE = [
    'query ($id: ID!, $after: String) {              ← 変数の宣言 (値は、variables で渡す)',
    '  node(id: $id) {                               ← 変数 $id を使う',
    '    ... on Issue {',
    '      comments(after: $after, first: 100) {     ← ページ送り (pagination)',
    '        nodes {                                 ← ここから下の nodes の中は、項目の部品 (issueCommentNode)',
    '          __typename id url body updatedAt ...  ← IssueComment の項目 (issueComment)',
    '          pullRequest {',
    '            __typename id number updatedAt ...  ← PullRequest の参照の組 (pullRequestRef)',
    '          }',
    '          author {                              ← 型が複数ある場所 (actor)',
    '            __typename login url ...',
    '            ... on User { id updatedAt ... }    ← 型ごとに、id と updatedAt を取る',
    '            ... on Bot { id updatedAt ... }',
    '          }',
    '        }',
    '        pageInfo { endCursor hasNextPage ... }  ← 項目の部品 (pageInfo)',
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
    { how: 'GraphQL の variables で渡す',
      queries: '取得のクエリ (15 個。viewer は、変数が無い)・コメントの追加・更新・削除 (3 個)・Issue の本文の書き換え (1 個)',
      syntax: ['query ($id: ID!, $after: String)', 'request(query, { id, after })', 'mutation ($id: ID!, $body: String!)', 'postData(query, { id, body })'] },
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

// いまのクエリを検査した結果。(19 個)
const CHECK_COLUMNS = [
    { code: 'kind',    label: '種類',   key: 'kind' },
    { code: 'count',   label: '個数',   key: 'count' },
    { code: 'queries', label: 'クエリ', val: (r)=> r.queries.map(q=> <div key={q}><C>{q}</C></div>) },
    { code: 'note',    label: '内容',   key: 'note' },
];

const CHECKS = [
    { kind: 'NG (使用中)',
      count: 0,
      queries: [],
      note: 'ProjectNextItem という型が GitHub のスキーマから無くなっていて NG だった projects_next_items_by_id は、0.5.0 で消した。検査は、終了コード 0 で終わる' },
    { kind: 'NG (未使用)',
      count: 0,
      queries: [],
      note: '使われていないクエリは、無い。(0.5.0 で消した)' },
    { kind: '注意',
      count: 0,
      queries: [],
      note: 'ProjectV2Item の content で、Issue の state と PullRequest の state (型が IssueState と PullRequestState で違う) を同じ場所で取っていた 5 個は、0.5.0 で、PullRequest の state を別名 pullRequestState で取るようにした。(yanqirenshi/SOGH.next#68。Pool に入れる前に、Pooler の node2projectV2Item(node) が Item の content を、node2pullRequest(node) が PullRequest を、state に戻す)' },
    { kind: 'キー (使用中)',
      count: 0,
      queries: [],
      note: '使用中のクエリは、データモデルになる型のすべてで、id と updatedAt を取っている' },
    { kind: 'キー (未使用)',
      count: 0,
      queries: [],
      note: '使われていないクエリは、無い。(0.5.0 で消した)' },
];

// GitHub につないで確かめるコマンド。
const LIVE_COMMAND = [
    '# トークンの置き場所を作る (1 回だけ)',
    'cp .env.local.template .env.local',
    '',
    '# 確かめる',
    'npm run check:live',
].join('\n');

// updatedAt が、どの変更で動くかを確かめるコマンド。
const UPDATED_AT_COMMAND = [
    '# 対象の Issue を、.env.local に書く (owner/repo#番号)',
    '# CHECK_UPDATED_AT_ISSUE=octocat/hello-world#1',
    '',
    '# いまの状態を覚える',
    'npm run check:updated-at',
    '',
    '# GitHub の画面で、操作を 1 つ行ってから、前との違いを見る (操作ごとに繰り返す)',
    'npm run check:updated-at',
    '',
    '# 比べずに、覚え直す',
    'npm run check:updated-at -- --reset',
].join('\n');

// パッケージに入るファイルを確かめるコマンド。
const PACK_COMMAND = [
    '# 先にビルドする (dist/ を空にしてから作る)',
    'npm run transpile',
    '',
    '# パッケージに入るファイルを確かめる (パッケージは作らない)',
    'npm run check:pack',
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
          'update_issue_body',
          'update_issue_comment',
          'delete_issue_comment',
      ],
      note: '書き込みのため。(このときは projects_next_items_by_id も、スキーマの検査で NG のため送らなかった。0.5.0 で消した。update_issue_body は、この記録のあとに、飛ばす一覧へ足した。check:live は、書き込みのクエリを、名前を挙げて飛ばす)' },
];

// 取得メソッドの一覧。(src/js/Sogh.js)
const COLUMNS = [
    { code: 'target',  label: '取得するもの', key: 'target' },
    { code: 'methods', label: 'メソッド',     val: (r)=> r.methods.map(m=> <div key={m}><C>{m}</C></div>) },
    { code: 'style',   label: '形式',         key: 'style' },
    { code: 'paging',  label: 'ページング',   key: 'paging' },
    { code: 'returns', label: '戻り値',       key: 'returns' },
    { code: 'failed',  label: '失敗したとき', key: 'failed' },
];

const CALLBACK = 'コールバック';
const ASYNC = 'async';

const THROW = 'GitHubError を投げる';
const THROW_AFTER_FAILED = 'failed を呼んでから、GitHubError を投げる';
const FAILED = 'failed を呼ぶ';

const METHODS = [
    { target: 'viewer',                     methods: ['connect'],                                                                                                  style: CALLBACK, paging: '-',        returns: 'User',      failed: FAILED },
    { target: 'viewer',                     methods: ['asyncFetchViewer'],                                                                                         style: ASYNC,    paging: '-',        returns: 'User',      failed: THROW },
    { target: 'viewer のリポジトリ',        methods: ['asyncFetchRepositoriesByViewer'],                                                                           style: ASYNC,    paging: '全件',     returns: 'id の配列', failed: THROW },
    { target: 'Issue (id)',                 methods: ['asyncFetchIssueByID', 'asyncFetchItemByID'],                                                                style: ASYNC,    paging: '-',        returns: 'id',        failed: THROW },
    { target: 'Issue (org・repo・番号)',    methods: ['asyncFetchIssueByOrgRepoIssueNumber'],                                                                      style: ASYNC,    paging: '-',        returns: 'id',        failed: THROW },
    { target: 'viewer の Issue (OPEN)',     methods: ['asyncFetchIssueByViewer'],                                                                                  style: ASYNC,    paging: '全件',     returns: 'id の配列', failed: THROW },
    { target: 'Issue のコメント',           methods: ['asyncFetchIssueCommentsByID', 'asyncFetchIssueCommentsByOrgRepoIssueNumber'],                               style: ASYNC,    paging: '全件',     returns: 'id の配列', failed: THROW },
    { target: 'Issue の本文の書き換え',    methods: ['asyncUpdateIssueBody'],                                                                                     style: ASYNC,    paging: '-',        returns: 'id',        failed: THROW },
    { target: 'コメントの追加・更新・削除', methods: ['asyncCreateIssueComment', 'asyncUpdateIssueComment', 'asyncDeleteIssueComment'],                                           style: ASYNC,    paging: '-',        returns: 'id',        failed: THROW },
    { target: 'ProjectV2 (viewer)',         methods: ['asyncFetchProjectsV2ByViewer'],                                                                             style: ASYNC,    paging: '全件',     returns: 'id の配列', failed: THROW },
    { target: 'ProjectV2 (team)',           methods: ['asyncFetchProjectsV2ByTeam', 'asyncFetchProjectsV2WithItemsByTeam'],                                        style: ASYNC,    paging: '全件',     returns: 'id の配列', failed: THROW_AFTER_FAILED },
    { target: 'ProjectV2 (1 件)',           methods: ['asyncFetchProjectV2ByUserLoginProjectV2Number', 'asyncFetchProjectV2ByOrgLoginProjectV2Number'],            style: ASYNC,    paging: '-',        returns: 'id',        failed: THROW_AFTER_FAILED },
    { target: 'ProjectV2 の Item',          methods: ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', 'asyncFetchProjectV2ItemsByOrgLoginProjectV2Number'],  style: ASYNC,    paging: '全件',     returns: 'id の配列', failed: THROW },
    { target: 'ProjectV2 の Item (1 件)',   methods: ['asyncFetchProjectV2ItemByID'],                                                                              style: ASYNC,    paging: '-',        returns: 'id',        failed: THROW },
];

export default function Fetching () {
    return (
        <Section title="取得の仕様" num="3." lev="4" sx={SX_MEMBER_TITLE}>

          <Section title="クエリの作り方" num="3.1" lev="5">
            <P>クエリは、3 つの層で組み立てます。</P>
            <OL>
              <LI>項目の部品。(<C>queries/attributes.js</C>)
                <UL>
                  <LI>「この型からは、この項目を取る」という文字列を返す関数。52 個ある。(ほかに、入れ子の件数の上限 <C>NESTED_LIMIT</C>)</LI>
                  <LI>型ごとの部品と、その決まりは、「5.2 型ごとの、項目の部品」を見る。</LI>
                </UL>
              </LI>
              <LI>クエリの本体。(src/js/queries/ の 1 ファイルに 1 クエリ)
                <UL>
                  <LI>GraphQL の形 (どこから、何を入れ子で取るか) を書いた文字列。19 個ある。</LI>
                  <LI>クエリの頭で、変数 (<C>$id: ID!</C> など) を宣言する。値は、GraphQL の variables で渡す。</LI>
                  <LI>項目のところに、項目の部品を埋め込む。</LI>
                  <LI>ファイルは、クエリの文字列 <C>query</C> と、応答の data から取り出す値を返す関数 <C>pick</C> を、<C>{'{ query, pick }'}</C> の形で export する。(<C>yanqirenshi/SOGH.next#65</C>)</LI>
                </UL>
              </LI>
              <LI>取得メソッド。(<C>Sogh.js</C>)
                <UL>
                  <LI>クエリに、値とページ送りの位置を variables で渡して送る。(<C>fetchNode(code, variables)</C>・<C>fetchPages(code, variables, onPage)</C>)</LI>
                  <LI>応答から、クエリの <C>pick</C> で、必要な部分を取り出す。</LI>
                </UL>
              </LI>
            </OL>

            <P>例: Issue のコメントを取るクエリ。(項目の部品を埋め込んだあとの形)</P>
            <Plane sx={SX_PLANE}>{QUERY_EXAMPLE}</Plane>

            <P>組み立ての流れは、次のとおりです。(<C>asyncFetchIssueCommentsByID(id)</C> の例)</P>
            <OL>
              <LI>読み込んだときに 1 回だけ、クエリのファイルが、項目の部品を埋め込んだ文字列を作る。</LI>
              <LI>呼んだときに、<C>{"fetchPages('issue_comments_by_issue_id', { id }, onPage)"}</C> を呼ぶ。</LI>
              <LI><C>fetchNode</C> が、<C>queryDefinition(code)</C> で、クエリの定義 <C>{'{ query, pick }'}</C> を名前で引く。</LI>
              <LI><C>{'request(query, { id, after })'}</C> で送る。(1 ページめは、after が null。値は、<C>postData(query, variables)</C> が、リクエストの本文の variables に入れる)</LI>
              <LI>応答の data から、<C>pick</C> で <C>data.node.comments</C> を取り出す。</LI>
              <LI><C>onPage(connection)</C> で、<C>connection2ids(connection, make)</C> が、コメントをモデルにして Pool に入れる。</LI>
              <LI><C>pageInfo.hasNextPage</C> が true なら、after に <C>pageInfo.endCursor</C> を入れて、送るところに戻る。</LI>
            </OL>

            <P>値の渡し方は、1 通りです。(GraphQL の variables だけ)</P>
            <Table columns={VALUE_COLUMNS} rows={VALUES} ids={TABLE_IDS}/>
            <OL sx={SX_AFTER_TABLE}>
              <LI>取得のクエリの値を、クエリの文字列に置き換えで埋め込む渡し方は、0.5.0 で無くした。(取得のクエリも、variables にした。<C>yanqirenshi/SOGH.next#63</C>)</LI>
              <LI>オブジェクトを文字列にして、クエリに埋め込む渡し方も、0.5.0 で無くした。(使うクエリ (Issue の作成・本文の更新の 2 個) は先に消していた。Loader と Issue に残っていた、データを作るメソッドも消した。<C>yanqirenshi/SOGH.next#83</C>)</LI>
              <LI>番号 (Issue の番号・ProjectV2 の番号) は、数値にしてから送る。(クエリの変数の型は <C>Int!</C>。メソッドには、これまでどおり文字列でも渡せる)</LI>
            </OL>
          </Section>

          <Section title="ページング" num="3.2" lev="5">
            <OL>
              <LI>一覧のクエリは、変数 <C>$after: String</C> を宣言し、一覧の引数に <C>{'after: $after, first: 100'}</C> を入れている。
                <UL>
                  <LI><C>attributes.pagination()</C> で入れているクエリが、9 個。(1 回の件数は、<C>projectsv2_with_items_by_team</C> だけ 10)</LI>
                </UL>
              </LI>
              <LI><C>fetchPages(code, variables, onPage)</C> が、変数 after を入れて送る。
                <UL>
                  <LI>1 ページめは、null。</LI>
                  <LI>2 ページめからは、前のページの <C>pageInfo.endCursor</C>。</LI>
                  <LI>クエリの文字列は、書き換えない。(書き換えてページ送りする形は、0.5.0 で無くした。<C>yanqirenshi/SOGH.next#63</C>)</LI>
                </UL>
              </LI>
              <LI>ページ送りできるのは、1 つのクエリにつき 1 か所。
                <UL>
                  <LI>クエリの <C>pick</C> が取り出す一覧の <C>pageInfo</C> で、次のページを決める。</LI>
                  <LI>ProjectV2 の Item を取る 2 つ (<C>projectv2items_by_〜</C>) は、<C>pick</C> が ProjectV2 (id と items) を返す。<C>fetchPages</C> の 4 つめの引数 <C>connectionOf</C> で、ページ送りする一覧 (items) を指す。(0.5.0 から。Item が 0 個のときも、どの ProjectV2 かが分かるように。<C>yanqirenshi/SOGH.next#108</C>)</LI>
                  <LI>入れ子の一覧 (assignees など) は、件数を書いている。(<C>first: 10</C> など。「5.5 件数の上限」を見る)</LI>
                </UL>
              </LI>
              <LI>asyncFetch〜 は、<C>pageInfo.hasNextPage</C> が false になるまで繰り返して、全件を集める。</LI>
              <LI>ProjectV2 の Item を取る 2 つ (<C>asyncFetchProjectV2ItemsByUserLoginProjectV2Number</C>・<C>asyncFetchProjectV2ItemsByOrgLoginProjectV2Number</C>) は、最後のページまで取り終えたら、その ProjectV2 の Item のうち、今回取れなかったものを、Pool から消す。(0.5.0 から。<C>yanqirenshi/SOGH.next#108</C>)
                <UL>
                  <LI>途中で失敗したときは、消さない。Item が 0 個になったときも、消す。</LI>
                  <LI>消すのは ProjectV2Item のモデルだけ。中身 (Issue など) と、ほかの ProjectV2 の Item は残す。</LI>
                  <LI>ほかの取得 (チームの Item 付き・組織の番号の ProjectV2) は、取る数に上限があるので、消さない。</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="取得メソッドの一覧" num="3.3" lev="5">
            <Table columns={COLUMNS} rows={METHODS} ids={TABLE_IDS}/>
            <P sx={SX_AFTER_TABLE}>async のメソッドは、モデルではなく id を返します。モデルは、id で Pool から引きます。(<C>sogh.issue(id)</C> など)</P>
            <P>async のメソッドは、失敗したときに、例外 <C>GitHubError</C> を投げます。(0.5.0 から。「3.5 エラーの扱い」を見る)</P>
          </Section>

          <Section title="コールバックの決まり" num="3.4" lev="5">
            <OL>
              <LI>更新と、一部の asyncFetch〜 は、<C>{'callbacks = { start, successed, failed, fetched }'}</C> を受け取る。</LI>
              <LI>はじめに <C>start</C> を呼び、終わったら <C>successed</C> か <C>failed</C> を呼ぶ。</LI>
              <LI><C>fetched</C> は、1 ページ取るたびに呼ぶ。(team の ProjectV2 だけ)</LI>
              <LI>無い項目や、関数でない項目は、呼ばない。</LI>
              <LI>asyncFetch〜 の <C>failed</C> は、1 つめの引数が、投げる <C>GitHubError</C>。<C>failed</C> を呼んでから、投げる。
                <UL>
                  <LI>team の 2 つは、<C>failed(error, それまでの id の配列)</C>。</LI>
                  <LI>ProjectV2 の 2 つ (<C>asyncFetchProjectV2By〜LoginProjectV2Number</C>) は、<C>failed(error, login, number)</C>。</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="エラーの扱い" num="3.5" lev="5">
            <OL>
              <LI>asyncFetch〜 は、Loader の <C>request(query, variables)</C> で送り、失敗したときは、例外 <C>GitHubError</C> を投げる。(0.5.0 から。<C>yanqirenshi/SOGH.next#61</C>)
                <UL>
                  <LI>つながらない … <C>status</C> は null。<C>cause</C> に、元の例外。</LI>
                  <LI>HTTP のステータスが 2xx でない … <C>status</C> に、HTTP の状態コード。<C>response</C> に、fetch の Response。</LI>
                  <LI>HTTP 200 でも、レスポンスに errors がある … <C>errors</C> に、GitHub の errors (配列)。message は、errors の message を改行でつないだもの。</LI>
                  <LI>応答に、取り出す値が無い (<C>pick</C> の値が null など) … <C>fetchNode(code, variables)</C> が投げる。(<C>status</C> は 200)</LI>
                </UL>
              </LI>
              <LI>途中のページで失敗したときも、投げる。途中まで集めた分は、返さない。</LI>
              <LI>成功したときの戻り値 (id か、id の配列。<C>asyncFetchViewer()</C> は User) は、0.5.0 の前と変わらない。</LI>
              <LI><C>GitHubError</C> は、パッケージの入口から、名前付きで export している。(<C>{"import { GitHubError } from 'sogh'"}</C>。<C>e instanceof GitHubError</C> で見分ける)</LI>
              <LI>コメントの追加・更新・削除は、Promise の形 (<C>asyncCreateIssueComment</C>・<C>asyncUpdateIssueComment</C>・<C>asyncDeleteIssueComment</C>)。失敗したときは、<C>GitHubError</C> を投げる。(0.5.0 から。callbacks の形の <C>createIssueComment</C> などは、消した。<C>yanqirenshi/SOGH.next#122</C>)</LI>
              <LI><C>connect</C> は、例外を投げない。
                <UL>
                  <LI><C>connect</C> は、<C>fetchX</C> で送り、失敗したときは <C>{"failed({ status: 'error', error })"}</C> を呼ぶ。</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="クエリの使われ方" num="3.6" lev="5">
            <P>クエリは 19 個あり、どれも Sogh のメソッドから使われています。</P>
            <OL>
              <LI>viewer・リポジトリ・Issue・コメント・ProjectV2・ProjectV2Item のクエリ。
                <UL>
                  <LI>Sogh のメソッドは、名前でクエリを引く。(<C>query</C>・<C>queryDefinition</C>・<C>fetchNode</C>・<C>fetchPages</C>・<C>fetchProjectsV2OfTeam</C> に名前を渡す)</LI>
                  <LI>名前のつづりは、0.5.0 で直した。(<C>viewer</C>・<C>issues_by_viewer</C>。<C>yanqirenshi/SOGH.next#73</C>)</LI>
                  <LI>Issue の本文を書き換える <C>update_issue_body</C> は、<C>asyncUpdateIssueBody(id, body)</C> が使う。(中身は、0.5.0 で作り直した。値を variables で渡し、Projects (classic) の項目を取らず、戻りの項目は <C>issue_by_id</C> と同じ。<C>yanqirenshi/SOGH.next#119</C>)</LI>
                </UL>
              </LI>
              <LI>使われていなかったクエリ (17 個) は、0.5.0 で消した。(<C>yanqirenshi/SOGH.next#66</C>)
                <UL>
                  <LI>消したクエリの名前は、<C>CHANGELOG.md</C> の「0.5.0」を見る。</LI>
                  <LI>項目の部品のうち、どのクエリからも使われなくなった 7 個も、消した。(Projects (classic) 用と、古い Projects 用)</LI>
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
              <LI>クエリは、定義の <C>query</C> を、そのまま GraphQL として読む。(値は variables で渡すので、置き換えずに読める)</LI>
              <LI>使用中かどうかは、<C>Sogh.js</C> の <C>{"this.query('…')"}</C>・<C>queryDefinition</C>・<C>fetchNode</C>・<C>fetchPages</C>・<C>fetchProjectsV2OfTeam</C> に渡している名前から数える。</LI>
              <LI>スクリプトは、<C>scripts/check-queries.mjs</C>。</LI>
            </OL>

            <P>いまのクエリを検査した結果は、次のとおりです。</P>
            <Table columns={CHECK_COLUMNS} rows={CHECKS} ids={TABLE_IDS}/>
            <OL sx={SX_AFTER_TABLE}>
              <LI>0.5.0 で、取得のクエリを variables の形に書き直した。<C>--dump</C> で前後を比べると、取っている項目 (道順) は、18 個とも、書き直す前と同じ。
                <UL>
                  <LI>PullRequest の state に別名を付けても、道順は、項目の本当の名前で数えるので、変わらない。</LI>
                </UL>
              </LI>
            </OL>
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
                  <LI>関連を返すメソッドが、core の JSON にある数だけ、モデルを返すか。</LI>
                </UL>
              </LI>
              <LI>viewer・リポジトリ・Issue・ProjectV2 のクエリは、viewer のデータから、対象を自動で選ぶ。</LI>
              <LI>組織 (org) とチームのクエリは、<C>.env.local</C> に対象 (<C>CHECK_ORG</C> など) を書いたときだけ送る。</LI>
              <LI>トークンと、取得した値は、表示しない。(表示するのは、クエリの名前・件数・エラーの文)</LI>
              <LI>スクリプトは、<C>scripts/check-live.mjs</C>。</LI>
            </OL>

            <P>2026-11-15 に確かめた結果は、次のとおりです。</P>
            <Table columns={LIVE_COLUMNS} rows={LIVES} ids={TABLE_IDS}/>
            <OL sx={SX_AFTER_TABLE}>
              <LI>関連をモデルにしたあと (sogh 0.4.0) に、もう一度確かめた。クエリの結果は、同じ。</LI>
              <LI>重ね方と関連の確認は、9 個すべて OK。
                <UL>
                  <LI>関連 2,497 個で、core の JSON にある数だけ、モデルが返った。</LI>
                  <LI>調べた ProjectV2Item は、0 件だった。ProjectV2Item の関連は、テストでだけ確かめている。</LI>
                </UL>
              </LI>
              <LI>取り直しの重ね方を直したあと (sogh 0.4.1。2026-11-16) にも、確かめた。結果は、同じ。
                <UL>
                  <LI>GitHub 側で値を変えてから取り直す確認は、していない。(読むだけのため。テストで、にせの node を使って確かめている)</LI>
                </UL>
              </LI>
              <LI>記録のあとで、OK だった <C>user_by_id</C>・<C>projects_next_by_id</C>・<C>projectsv2_items_by_projects_v2</C> は、0.5.0 で消した。(いまのスクリプトは、残した 18 個のクエリを、すべて送るか、飛ばす)</LI>
              <LI>記録のあとで、クエリの名前を <C>viewer</C>・<C>issues_by_viewer</C> に直した。(0.5.0。<C>yanqirenshi/SOGH.next#73</C>)</LI>
              <LI>0.5.0 で、スクリプトは、値を variables で送るようにした。(ページ送りするクエリは、after を null にして、1 ページめだけを取る)</LI>
              <LI>0.5.0 で、Sogh で取得して確かめる部分の途中で、<C>asyncFetch〜</C> が例外を投げたときは、NG として数えて、続きを飛ばす。</LI>
            </OL>
          </Section>

          <Section title="updatedAt が動く変更を確かめる" num="3.9" lev="5">
            <P>Pool は、同じ id の node が来たとき、updatedAt を比べて、重ねるかどうかを決めます。関連は、親の core の JSON に持っているので、「関連が変わったのに、親の updatedAt が動かない」変更があると、取り直しても、反映されません。そういう変更があるかどうかを、GitHub で実際に確かめるスクリプトです。(<C>yanqirenshi/SOGH.next#51</C>)</P>
            <Plane sx={SX_PLANE}>{UPDATED_AT_COMMAND}</Plane>
            <OL>
              <LI>進め方。
                <UL>
                  <LI>試す Issue を 1 つ決めて、<C>CHECK_UPDATED_AT_ISSUE</C> に <C>owner/repo#番号</C> の形で書く。(owner は、ユーザーでも組織でもよい)</LI>
                  <LI>スクリプトを動かして、いまの状態を覚える。</LI>
                  <LI>GitHub の画面で、操作を 1 つ行う。(ラベルを付ける、担当者を変える、コメントを足す、プロジェクトに足す、Item のフィールドの値を変える、など)</LI>
                  <LI>スクリプトを動かして、前との違いを見る。操作ごとに、これを繰り返す。</LI>
                  <LI>プロジェクトに足したときの ProjectV2 の動きを見るには、プロジェクトに入っている Issue で、先に外してから、足す。(足す前の ProjectV2 は、Issue から見えないので、比べられない。外した回に覚えた ProjectV2 なら、足したときに比べられる)</LI>
                </UL>
              </LI>
              <LI>確かめること。対象ごとに、updatedAt が動いたかと、関連が変わったかを出す。
                <UL>
                  <LI>Issue … 関連は assignees・labels・milestone・comments・projectItems。</LI>
                  <LI>Issue の ProjectV2Item … 関連は fieldValues (フィールドごとの値)。</LI>
                  <LI>その ProjectV2 … 関連は items。</LI>
                  <LI>Repository・Milestone・新しい順のコメント (5 件) … updatedAt だけ。</LI>
                  <LI>関連が変わったのに、updatedAt が動いていない対象には、印を付ける。(これが、見つけたいもの)</LI>
                  <LI>Item・ProjectV2 が増えた・減ったこと、コメントの数の増減、Milestone が付いた・外れたことも出す。</LI>
                </UL>
              </LI>
              <LI>覚えるもの。
                <UL>
                  <LI>対象ごとの updatedAt と、関連の中身のダイジェスト (SHA-256)。id は、SHA-256 にした鍵にする。</LI>
                  <LI>ProjectV2 の id だけは、そのまま覚える。Issue をプロジェクトから外すと、Issue から辿れなくなるので、次の回に、id で読み直すため。</LI>
                  <LI>置き場所は、OS の一時フォルダの <C>sogh-check-updated-at.json</C>。(リポジトリの中には作らない)</LI>
                  <LI>対象の Issue が前の回と違うときは、比べずに、覚え直す。</LI>
                </UL>
              </LI>
              <LI>トークンと対象は、<C>check:live</C> と同じく、環境変数か <C>.env.local</C> から読む。環境変数 <C>CHECK_ENV_FILE</C> で、別の設定ファイルも指せる。</LI>
              <LI>安全のための決まり。
                <UL>
                  <LI>読むだけ。書き込みのクエリ (mutation) は、送らない。</LI>
                  <LI>トークンは、表示しない。</LI>
                  <LI>取得した値そのもの (id・題名・login・日時・本文など) は、表示しない。表示するのは、種類の名前・件数・順番の番号・「動いた／動かない」「変わった／変わらない」・エラーの文だけ。</LI>
                  <LI>GitHub のエラーは、type があるもの (NOT_FOUND・FORBIDDEN など) は、type だけを出す。(message には、対象の owner/repo や番号が入るため)</LI>
                </UL>
              </LI>
              <LI>スクリプトは、<C>scripts/check-updated-at.mjs</C>。比べる部分は <C>scripts/updated-at.mjs</C> にあり、テストで、にせのスナップショットを使って確かめている。</LI>
            </OL>

            <P>2026-11-16 に、試すための Issue で、操作を 1 つずつ行って調べた結果、「関連が変わったのに、親の updatedAt が動かない」のは、Issue をプロジェクトに足す・外す (Issue の projectItems) の 1 種類だけでした。0.4.2 で、Issue の projectItems を、日時が同じときも、中身が違えば重ねるようにしました。くわしくは「7.5 (1) updatedAt が動かない変更」を見てください。</P>
          </Section>

          <Section title="パッケージに入るファイルを確かめる" num="3.10" lev="5">
            <P>npm に公開するパッケージに、入れるつもりの無いファイルが入っていないかを確かめるスクリプトです。(<C>yanqirenshi/SOGH.next#54</C>)</P>
            <Plane sx={SX_PLANE}>{PACK_COMMAND}</Plane>
            <OL>
              <LI>パッケージに入れるものは、<C>package.json</C> の <C>files</C> に書いてある。(<C>dist</C> と <C>CHANGELOG.md</C>。<C>package.json</C>・<C>README.org</C>・<C>LICENSE</C> は、npm がいつも入れる)</LI>
              <LI>確かめること。(どれかがあれば、失敗にする)
                <UL>
                  <LI>入ってよいもの (<C>dist/</C> の下・<C>package.json</C>・<C>README.org</C>・<C>LICENSE</C>・<C>CHANGELOG.md</C>) のほかが、入っている。</LI>
                  <LI>名前に <C>.env</C> を含むファイルが、入っている。(<C>dist/</C> の下でも)</LI>
                  <LI><C>dist/index.js</C> が、入っていない。(ビルドしていない)</LI>
                </UL>
              </LI>
              <LI>いつ動くか: <C>npm publish</C> のとき、<C>prepublishOnly</C> が「ビルド → check:pack」の順に動かす。失敗したら、公開は止まる。</LI>
              <LI><C>npm pack --dry-run --json</C> の結果を読むだけで、パッケージは作らず、ファイルの中身も読まない。表示するのは、入るファイルの数と、問題のあったファイルの名前だけ。</LI>
              <LI>スクリプトは、<C>scripts/check-pack.mjs</C>。入ってよいかを決める部分は <C>scripts/pack-files.mjs</C> にあり、テストで、にせのファイルの一覧を使って確かめている。</LI>
            </OL>
          </Section>

        </Section>
    );
}
