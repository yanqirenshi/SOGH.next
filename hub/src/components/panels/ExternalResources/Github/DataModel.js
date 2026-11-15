import React from 'react';

import { Section, P, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「4. データモデル」と「5. 取得する項目」。

// モデルの継承。(src/js/models/)
const CLASSES = [
    'GraphQLNode (id / createdAt / updatedAt / core / sogh)',
    '  ├─ Repository',
    '  ├─ User',
    '  ├─ Viewer           … User とほぼ同じ項目',
    '  ├─ Assignee         … User とほぼ同じ項目',
    '  ├─ Issue            … 本文の注釈 ($Point・$Owner など) を読み取る',
    '  ├─ IssueComment',
    '  ├─ PullRequest',
    '  ├─ Label',
    '  ├─ Milestone',
    '  ├─ ProjectV2        … README の注釈 ($Priority・$Plan など) を読み取る',
    '  ├─ ProjectV2Item    … fieldValues を、フィールドの名前で引く',
    '  └─ Project / Card / Column  … Projects (classic)。廃止予定',
].join('\n');

// Pool の種類。(src/js/Pooler.js)
const POOL_COLUMNS = [
    { code: 'code',   label: 'pool のコード', val: (r)=> <C>{r.code}</C> },
    { code: 'model',  label: 'モデル',        key: 'model' },
    { code: 'node2',  label: '入れるメソッド', val: (r)=> <C>{r.node2}</C> },
    { code: 'getter', label: '引くメソッド',   val: (r)=> <C>{r.getter}</C> },
];

const POOLS = [
    { code: 'repository',      model: 'Repository',    node2: 'node2repository(node)',    getter: 'repository(id)' },
    { code: 'user',            model: 'User',          node2: 'node2user(node)',          getter: 'user(id)' },
    { code: 'project-v2',      model: 'ProjectV2',     node2: 'node2projectV2(node)',     getter: 'projectV2(id)' },
    { code: 'project-v2-item', model: 'ProjectV2Item', node2: 'node2projectV2Item(node)', getter: 'projectV2Item(id)' },
    { code: 'issue',           model: 'Issue',         node2: 'node2issue(node)',         getter: 'issue(id)' },
    { code: 'issue-comment',   model: 'IssueComment',  node2: 'node2issueComment(node)',  getter: 'issueComment(id)' },
    { code: 'pull-request',    model: 'PullRequest',   node2: 'node2pullRequest(node)',   getter: 'pullRequest(id)' },
];

// 注釈。(本文・README・フィールドに書く決まりごと)
const ANNOTATION_COLUMNS = [
    { code: 'place', label: '書く場所',   key: 'place' },
    { code: 'keys',  label: 'キー',       val: (r)=> r.keys.map(k=> <span key={k}><C>{k}</C>{' '}</span>) },
    { code: 'note',  label: '補足',       key: 'note' },
];

const ANNOTATIONS = [
    { place: 'Issue の本文',
      keys: ['$Owner', '$Point.Plan', '$Point.Result', '$Date.Due', '$Due.Date', '$Date.Next'],
      note: '点数は「$Point.Result <人> <日付> <点>」の行を合計する' },
    { place: 'ProjectV2 の README',
      keys: ['$Priority', '$Owner', '$Type', '$Release', '$Plan', '$Result', '$Action', '$Backlog', '$Customer', '$Agency', '$Systems', '$Scenario', '$Progress'],
      note: '$Priority は s (緊急)・h (高い)・n (普通)・l (低い)' },
    { place: 'ProjectV2Item のフィールド (利用者が作る)',
      keys: ['Plan.Start', 'Plan.End', 'Plan.Points', 'Result.Points', 'Due.Date', 'NextAction.Date', 'Archived'],
      note: 'フィールドの名前で引く' },
    { place: 'ProjectV2Item のフィールド (標準)',
      keys: ['Title', 'Status', 'Assignees', 'Labels', 'Linked pull requests', 'Reviewers', 'Repository', 'Milestone'],
      note: 'フィールドの名前で引く' },
];

// クエリが取る属性。(src/js/queries/attributes.js)
const ATTRIBUTE_COLUMNS = [
    { code: 'kind',       label: '種類',       key: 'kind' },
    { code: 'attributes', label: '取る属性',   key: 'attributes' },
    { code: 'nested',     label: '入れ子で取るもの', key: 'nested' },
];

const ATTRIBUTES = [
    { kind: 'user',
      attributes: 'id, login, name, avatarUrl, url, email, company, createdAt, updatedAt',
      nested: '-' },
    { kind: 'repository',
      attributes: 'id, name, url, description, descriptionHTML, createdAt, updatedAt, pushedAt',
      nested: 'owner (id, login, resourcePath)' },
    { kind: 'issue',
      attributes: 'id, url, title, number, body, bodyHTML, createdAt, updatedAt, closedAt',
      nested: 'author, repository, milestone, assignees (10 件まで), labels (10 件まで)' },
    { kind: 'issue comment',
      attributes: 'id, url, body, bodyHTML, publishedAt, lastEditedAt, isMinimized, authorAssociation, createdAt, updatedAt ほか',
      nested: 'author, editor, pullRequest' },
    { kind: 'projectV2',
      attributes: 'id, number, url, public, title, readme, shortDescription, viewerCanUpdate, closed, createdAt, updatedAt, closedAt',
      nested: 'fields (10 件まで), creator, owner' },
    { kind: 'projectV2 item',
      attributes: 'id, type, isArchived, createdAt, updatedAt',
      nested: 'fieldValues (30 件まで), creator, content (Issue・PullRequest・DraftIssue)' },
];

// 型ごとの、項目の組。(同じ型を、何通りの項目の組で取っているか)
const FIELD_SET_COLUMNS = [
    { code: 'type',  label: '型',         key: 'type' },
    { code: 'count', label: '通り',       val: (r)=> r.sets.length },
    { code: 'sets',  label: '項目の組',   val: (r)=> r.sets.map(s=> <div key={s}>{s}</div>) },
];

const FIELD_SETS = [
    { type: 'User など (人)',
      sets: [
          'user()',
          'owner()',
          'actor()',
          'projectv2Creator()',
          'projectV2FieldValue_Creator()',
          'リポジトリの owner の直書き (repositories() の中)',
          'reviewers の直書き (id だけ)',
      ] },
    { type: 'PullRequest',
      sets: [
          'pull_request()',
          'projectV2ItemContentPullRequest()',
          'コメントの pullRequest の直書き (id・number・title・url)',
          'フィールドの値の pullRequests の直書き (id・url・title)',
      ] },
    { type: 'Repository',
      sets: [
          'repositories()',
          'フィールドの値の repository の直書き (name・id・url)',
          'repository クエリの直書き',
      ] },
    { type: 'Issue',
      sets: [
          'issue()',
          'projectV2ItemContentIssue()',
          'create_issue クエリの直書き',
      ] },
    { type: 'ProjectV2',
      sets: [
          'projectv2()',
          'Item の project の直書き (id・number・title・url・owner)',
      ] },
    { type: 'Label',     sets: ['label()'] },
    { type: 'Milestone', sets: ['milestone()'] },
];

export default function DataModel () {
    return (
        <>
          <Section title="データモデル" num="4." lev="4" sx={SX_MEMBER_TITLE}>

            <Section title="モデル" num="4.1" lev="5">
              <Plane sx={SX_PLANE}>{CLASSES}</Plane>
              <OL>
                <LI>すべてのモデルは、<C>GraphQLNode</C> を継承する。</LI>
                <LI><C>core()</C> に、GitHub から取った node (JSON) をそのまま持つ。</LI>
                <LI>モデルのメソッドは、core を読むだけの薄い窓。値が無いときは、多くのメソッドが null を返す。</LI>
                <LI>クラスごとの属性と振舞は、「クラス」のページを見る。</LI>
              </OL>
            </Section>

            <Section title="Pool (取得したモデルの置き場)" num="4.2" lev="5">
              <P>Pool は、種類ごとに 1 つあります。キーは、GitHub の node id です。</P>
              <Table columns={POOL_COLUMNS} rows={POOLS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>同じ id の node を入れ直すと、いまあるモデルの core を差し替える。(モデルは同じものが残る)</LI>
                <LI>無ければ、モデルを作って入れる。</LI>
                <LI><C>Issue</C> と <C>ProjectV2</C> は、core を差し替えると、注釈を読み取り直す。</LI>
                <LI><C>sogh.get(id)</C> は、すべての Pool を順に探す。(node id は、種類をまたいで重ならない)</LI>
                <LI>Pool から消す操作は無い。ページを開いている間は、貯まり続ける。</LI>
                <LI>Label・Milestone・Assignee・Project・Card・Column は、Pool を持たない。Issue や ProjectV2Item の core の中に、JSON のまま残る。</LI>
              </OL>
            </Section>

            <Section title="モデルどうしのつながり" num="4.3" lev="5">
              <OL>
                <LI>Repository の owner は、<C>Matchmaker</C> が User にして Pool に入れる。(Repository の core の owner は、JSON のまま残る)</LI>
                <LI>Issue の repository・author・milestone・assignees・labels は、core の中の JSON をそのまま返す。モデルにはしない。</LI>
                <LI>ProjectV2Item の content (Issue・PullRequest・DraftIssue) も、JSON のまま返す。</LI>
              </OL>
              <P>id でたどってモデルを得られるつながりは、Repository から User だけです。</P>
              <P>すべての関連をモデルにする仕様は、「7. 関連をモデルにする」に書いています。</P>
            </Section>

            <Section title="注釈" num="4.4" lev="5">
              <P>本文や README に書いた「$キー 値」を、正規表現で読み取って、モデルの属性にします。</P>
              <Table columns={ANNOTATION_COLUMNS} rows={ANNOTATIONS} ids={TABLE_IDS}/>
            </Section>

          </Section>

          <Section title="取得する項目" num="5." lev="4" sx={SX_MEMBER_TITLE}>

            <Section title="取る属性" num="5.1" lev="5">
              <P>それぞれの種類を、主に取るときの属性です。</P>
              <Table columns={ATTRIBUTE_COLUMNS} rows={ATTRIBUTES} ids={TABLE_IDS}/>
            </Section>

            <Section title="件数の上限" num="5.2" lev="5">
              <OL>
                <LI>一覧は、1 回に 100 件。(<C>attributes.page_nation()</C>)</LI>
                <LI>Issue の assignees と labels は、10 件まで。</LI>
                <LI>ProjectV2 の fields は、一覧のクエリで 10 件まで、Item のクエリで 30 件まで。</LI>
                <LI>ProjectV2Item の fieldValues は、クエリによって 20 件まで、または 30 件まで。その中のラベルとプルリクエストも同じ。</LI>
                <LI>入れ子の上限は、ページングしていない。
                  <UL>
                    <LI>上限を超えた分は、取れない。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

            <Section title="型ごとの、項目の組" num="5.3" lev="5">
              <P>同じ型でも、取る場所によって、取る項目の組が違います。</P>
              <Table columns={FIELD_SET_COLUMNS} rows={FIELD_SETS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>人の 7 通りのうち、<C>actor()</C> は id を取っていない。</LI>
                <LI>人の 7 通りのうち、updatedAt を取っているのは、<C>user()</C> だけ。</LI>
                <LI>名前に () が付いているものは、<C>queries/attributes.js</C> の項目の部品。「直書き」は、クエリに直に書いているもの。</LI>
              </OL>
            </Section>

          </Section>
        </>
    );
}
