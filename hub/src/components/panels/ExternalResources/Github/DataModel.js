import React from 'react';

import { Section, P, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「4. データモデル」と「5. 取得する項目」。

// モデルの継承。(src/js/models/)
const CLASSES = [
    'GraphQLNode (id / createdAt / updatedAt / core / sogh)',
    '  ├─ Repository',
    '  ├─ User             … viewer と assignees も、User',
    '  ├─ Organization     … 人 (0.4.0 で足した)',
    '  ├─ Bot              … 人 (0.4.0 で足した)',
    '  ├─ Mannequin        … 人 (0.4.0 で足した)',
    '  ├─ EnterpriseUserAccount  … 人 (0.4.0 で足した)',
    '  ├─ Team             … ProjectV2Item の reviewers に入る (0.4.0 で足した)',
    '  ├─ Issue            … 本文の注釈 ($Point・$Owner など) を読み取る',
    '  ├─ IssueComment',
    '  ├─ PullRequest',
    '  ├─ DraftIssue       … ProjectV2Item の content に入る (0.4.0 で足した)',
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
    { code: 'organization',    model: 'Organization',  node2: 'node2organization(node)',  getter: 'organization(id)' },
    { code: 'bot',             model: 'Bot',           node2: 'node2bot(node)',           getter: 'bot(id)' },
    { code: 'mannequin',       model: 'Mannequin',     node2: 'node2mannequin(node)',     getter: 'mannequin(id)' },
    { code: 'enterprise-user-account', model: 'EnterpriseUserAccount', node2: 'node2enterpriseUserAccount(node)', getter: 'enterpriseUserAccount(id)' },
    { code: 'draft-issue',     model: 'DraftIssue',    node2: 'node2draftIssue(node)',    getter: 'draftIssue(id)' },
    { code: 'team',            model: 'Team',          node2: 'node2team(node)',          getter: 'team(id)' },
    { code: 'label',           model: 'Label',         node2: 'node2label(node)',         getter: 'label(id)' },
    { code: 'milestone',       model: 'Milestone',     node2: 'node2milestone(node)',     getter: 'milestone(id)' },
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

// 型ごとの、項目の部品。(src/js/queries/attributes.js)
// 項目の多い型は、参照の組 (〜Ref) と、全部の組 (無印) を持つ。
const PART_COLUMNS = [
    { code: 'type',   label: '型',     key: 'type' },
    { code: 'kind',   label: '組',     key: 'kind' },
    { code: 'part',   label: '部品',   val: (r)=> <C>{r.part}</C> },
    { code: 'fields', label: '取る項目', key: 'fields' },
];

const REF = '参照';
const FULL = '全部';
const ONE = '1 つ';

const PARTS = [
    { type: 'User',          kind: REF,  part: 'userRef()',        fields: '__typename, id, login, name, avatarUrl, url, resourcePath, createdAt, updatedAt' },
    { type: 'User',          kind: FULL, part: 'user()',           fields: '参照の組 + email, company' },
    { type: 'Repository',    kind: REF,  part: 'repositoryRef()',  fields: '__typename, id, name, url, createdAt, updatedAt' },
    { type: 'Repository',    kind: FULL, part: 'repositories()',   fields: '参照の組 + description, descriptionHTML, pushedAt, owner' },
    { type: 'Issue',         kind: REF,  part: 'issueRef()',       fields: '__typename, id, url, number, title, state, createdAt, updatedAt, closedAt' },
    { type: 'Issue',         kind: FULL, part: 'issue()',          fields: '参照の組 + body, bodyHTML' },
    { type: 'PullRequest',   kind: REF,  part: 'pullRequestRef()', fields: '__typename, id, number, url, title, state, closed, createdAt, updatedAt, closedAt' },
    { type: 'PullRequest',   kind: FULL, part: 'pull_request()',   fields: '参照の組 + body, bodyHTML' },
    { type: 'ProjectV2',     kind: REF,  part: 'projectV2Ref()',   fields: '__typename, id, number, url, title, closed, createdAt, updatedAt' },
    { type: 'ProjectV2',     kind: FULL, part: 'projectv2()',      fields: '参照の組 + public, readme, resourcePath, shortDescription, viewerCanUpdate, closedAt' },
    { type: 'IssueComment',  kind: ONE,  part: 'issue_comment()',  fields: '__typename, id, url, body, bodyHTML, resourcePath, publishedAt, lastEditedAt, minimizedReason, isMinimized, includesCreatedEdit, databaseId, createdViaEmail, authorAssociation, createdAt, updatedAt' },
    { type: 'ProjectV2Item', kind: ONE,  part: 'ProjectV2Item()',  fields: '__typename, id, type, isArchived, createdAt, updatedAt' },
    { type: 'Label',         kind: ONE,  part: 'label()',          fields: '__typename, id, name, url, color, createdAt, updatedAt' },
    { type: 'Milestone',     kind: ONE,  part: 'milestone()',      fields: '__typename, id, url, title, state, number, dueOn, createdAt, updatedAt' },
    { type: 'DraftIssue',    kind: ONE,  part: 'draftIssue()',     fields: '__typename, id, title, createdAt, updatedAt' },
    { type: 'Organization',  kind: REF,  part: 'organizationRef()', fields: '__typename, id, login, name, avatarUrl, url, resourcePath, email, createdAt, updatedAt' },
    { type: 'Bot',           kind: REF,  part: 'botRef()',         fields: '__typename, id, login, avatarUrl, url, resourcePath, createdAt, updatedAt' },
    { type: 'Mannequin',     kind: REF,  part: 'mannequinRef()',   fields: '__typename, id, login, avatarUrl, url, resourcePath, email, createdAt, updatedAt' },
    { type: 'EnterpriseUserAccount', kind: REF, part: 'enterpriseUserAccountRef()', fields: '__typename, id, login, name, avatarUrl, url, resourcePath, createdAt, updatedAt' },
    { type: 'Team',          kind: REF,  part: 'teamRef()',        fields: '__typename, id, slug, createdAt, updatedAt' },
];

// 型が複数ある場所の、項目の部品。
const UNION_COLUMNS = [
    { code: 'part',  label: '部品',     val: (r)=> <C>{r.part}</C> },
    { code: 'where', label: '使う場所', key: 'where' },
    { code: 'how',   label: '取り方',   val: (r)=> r.how.map(s=> <div key={s}>{s}</div>) },
];

const UNIONS = [
    { part: 'actor()',
      where: 'Issue の author、IssueComment の author と editor、ProjectV2 と ProjectV2Item の creator、フィールドの値の creator',
      how: [
          '共通: __typename, login, url, avatarUrl, resourcePath',
          'User は userRef()',
          'Organization は organizationRef()',
          'Bot は botRef()',
          'Mannequin は mannequinRef()',
          'EnterpriseUserAccount は enterpriseUserAccountRef()',
      ] },
    { part: 'repositoryOwner()',
      where: 'Repository の owner',
      how: [
          '共通: __typename, id, login, avatarUrl, url, resourcePath',
          'User は userRef()',
          'Organization は organizationRef()',
      ] },
    { part: 'projectv2Owner()',
      where: 'ProjectV2 の owner',
      how: [
          '共通: __typename, id',
          'User は userRef()',
          'Organization は organizationRef()',
          'Issue・PullRequest は id, number, updatedAt',
      ] },
    { part: 'ProjectV2ItemFieldReviewerValue()',
      where: 'ProjectV2Item の reviewers',
      how: [
          'User は userRef()',
          'Team は teamRef()',
          'Mannequin は mannequinRef()',
          'Bot は botRef()',
      ] },
    { part: 'projectV2ItemContent〜()',
      where: 'ProjectV2Item の content',
      how: [
          'DraftIssue は draftIssue()',
          'Issue は issueRef() と、repository (repositories())',
          'PullRequest は pullRequestRef()',
      ] },
];

// 入れ子で取るもの。(主に取る型ごと)
const NESTED_COLUMNS = [
    { code: 'type',   label: '主に取る型',       key: 'type' },
    { code: 'nested', label: '入れ子で取るもの', key: 'nested' },
    { code: 'some',   label: 'クエリによって取るもの', key: 'some' },
];

const NESTED = [
    { type: 'Repository',    nested: 'owner',                                                      some: '-' },
    { type: 'Issue',         nested: 'author, repository, milestone, assignees (10 件まで), labels (10 件まで)', some: 'projectItems (1 件), comments (100 件まで)' },
    { type: 'IssueComment',  nested: 'author, editor, pullRequest',                                some: '-' },
    { type: 'ProjectV2',     nested: 'fields, creator, owner',                                     some: 'items' },
    { type: 'ProjectV2Item', nested: 'fieldValues, creator, content',                              some: 'project' },
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
                <LI>値を返すメソッドは、core を読むだけの薄い窓。値が無いときは、多くのメソッドが null を返す。</LI>
                <LI>関連を返すメソッドは、Pool からモデルを引いて返す。(「4.3 モデルどうしのつながり」を見る)</LI>
                <LI>人は、型ごとのモデル。(User・Organization・Bot・Mannequin・EnterpriseUserAccount)</LI>
                <LI><C>Viewer</C> と <C>Assignee</C> のクラスは、0.4.0 で消した。(どちらも、User を使う)</LI>
                <LI>クラスごとの属性と振舞は、「クラス」のページを見る。</LI>
              </OL>
            </Section>

            <Section title="Pool (取得したモデルの置き場)" num="4.2" lev="5">
              <P>Pool は、種類ごとに 1 つあります。キーは、GitHub の node id です。いまは、15 あります。(下の 8 つは、0.4.0 で足しました)</P>
              <Table columns={POOL_COLUMNS} rows={POOLS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>同じ id の node を入れ直すと、いまあるモデルの core に、node を重ねる。(モデルは同じものが残る)
                  <UL>
                    <LI>core を丸ごと差し替えずに、最終更新日時 (updatedAt) を比べて、重ねる項目を決める。</LI>
                    <LI>重ね方は、「7.4 (1) node の重ね方」を見る。</LI>
                  </UL>
                </LI>
                <LI>無ければ、モデルを作って入れる。</LI>
                <LI><C>Issue</C> と <C>ProjectV2</C> は、core が変わると、注釈を読み取り直す。</LI>
                <LI><C>sogh.get(id)</C> は、すべての Pool を順に探す。(node id は、種類をまたいで重ならない)</LI>
                <LI>Pool から消す操作は無い。ページを開いている間は、貯まり続ける。</LI>
                <LI>型が複数ある関連の node は、<C>node2model(node)</C> が、<C>__typename</C> に合う Pool に入れる。</LI>
                <LI>viewer は、<C>user</C> の Pool に入る。(<C>connect</C> でも、<C>asyncFetchViewer</C> でも、同じ)</LI>
                <LI>Project・Card・Column (Projects classic) は、Pool を持たない。</LI>
              </OL>
            </Section>

            <Section title="モデルどうしのつながり" num="4.3" lev="5">
              <P>入れ子で取った関連 (Issue の assignees など) は、モデルになります。</P>
              <OL>
                <LI><C>Matchmaker</C> が、入れ子の node を、親より先に、モデルにして Pool に入れる。
                  <UL>
                    <LI>入れ子の node の中の関連も、同じようにたどる。</LI>
                  </UL>
                </LI>
                <LI>親の core には、入れ子の JSON が、そのまま残る。</LI>
                <LI>関連を返すメソッド (<C>issue.assignees()</C> など) は、JSON の id で、Pool からモデルを引いて返す。
                  <UL>
                    <LI>値は、メソッドで読む。(<C>assignee.login()</C>)</LI>
                    <LI>関連が無いとき、クエリで取っていないときは、null か、空の配列を返す。</LI>
                  </UL>
                </LI>
                <LI>JSON のまま返すメソッドも、残っている。
                  <UL>
                    <LI>fieldValues を直に読むもの。(ProjectV2Item の <C>fieldValues()</C>・<C>getFieldValueByName(name)</C>、Issue の <C>fieldItem()</C>・<C>fieldValues()</C>・<C>fieldValueContents(name)</C> など)</LI>
                  </UL>
                </LI>
              </OL>
              <P>モデルにした関連の一覧と、決めたことは、「7. 関連をモデルにする」に書いています。</P>
            </Section>

            <Section title="注釈" num="4.4" lev="5">
              <P>本文や README に書いた「$キー 値」を、正規表現で読み取って、モデルの属性にします。</P>
              <Table columns={ANNOTATION_COLUMNS} rows={ANNOTATIONS} ids={TABLE_IDS}/>
            </Section>

          </Section>

          <Section title="取得する項目" num="5." lev="4" sx={SX_MEMBER_TITLE}>

            <Section title="項目の部品の決まり" num="5.1" lev="5">
              <P>クエリに埋め込む項目は、<C>queries/attributes.js</C> の「項目の部品」で決めています。</P>
              <OL>
                <LI>データモデルになる型は、どこで取るときも、id と updatedAt を取る。
                  <UL>
                    <LI>同じ id の node を重ねるかどうかを、updatedAt で決めるため。(「7. 関連をモデルにする」を見る)</LI>
                  </UL>
                </LI>
                <LI>データモデルになる型は、型の名前 (<C>__typename</C>) も取る。
                  <UL>
                    <LI>型が複数ある場所で、どの型かを見分けるため。</LI>
                  </UL>
                </LI>
                <LI>項目の多い型は、項目の組を 2 つ持つ。
                  <UL>
                    <LI>参照の組 (名前が〜Ref)。ほかの型の入れ子として取るときに使う。</LI>
                    <LI>全部の組 (無印)。その型を主に取るときに使う。参照の組を含む。</LI>
                    <LI>入れ子でも全部の組で取ると、応答が大きくなるため。(例: ProjectV2Item 100 件のそれぞれに、Issue の本文が付く)</LI>
                  </UL>
                </LI>
                <LI>項目の少ない型 (Label・Milestone など) は、組が 1 つ。</LI>
                <LI>部品が返すのは、その型の項目だけ。</LI>
              </OL>
            </Section>

            <Section title="型ごとの、項目の部品" num="5.2" lev="5">
              <Table columns={PART_COLUMNS} rows={PARTS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>Label の updatedAt は、null のことがある。</LI>
                <LI>Organization・Bot・Mannequin・EnterpriseUserAccount・Team は、型が複数ある場所で使う。</LI>
              </OL>
            </Section>

            <Section title="型が複数ある場所の、項目の部品" num="5.3" lev="5">
              <P>作成者や持ち主は、場所によって、入る型が複数あります。その場所では、型ごとに項目を取ります。</P>
              <Table columns={UNION_COLUMNS} rows={UNIONS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>型が複数ある場所では、User の email と company を取らない。
                  <UL>
                    <LI>email の型が、User (必ず値が入る) と、Organization・Mannequin (null がありうる) で違うため。</LI>
                    <LI>型の違う項目を、同じ名前で、同じ場所に取ると、クエリとして正しくなくなる。</LI>
                    <LI>email と company は、型が User と決まっている場所 (assignees など) で、<C>user()</C> で取る。</LI>
                  </UL>
                </LI>
                <LI>Team の name と avatarUrl も、同じ理由で取らない。(User と型が違う)</LI>
              </OL>
            </Section>

            <Section title="入れ子で取るもの" num="5.4" lev="5">
              <Table columns={NESTED_COLUMNS} rows={NESTED} ids={TABLE_IDS}/>
            </Section>

            <Section title="件数の上限" num="5.5" lev="5">
              <OL>
                <LI>一覧は、1 回に 100 件。(<C>attributes.page_nation()</C>)</LI>
                <LI>Issue の assignees と labels は、10 件まで。</LI>
                <LI>ProjectV2 の fields は、クエリによって 10 件まで、20 件まで、30 件まで、100 件まで。</LI>
                <LI>ProjectV2Item の fieldValues は、クエリによって 20 件まで、または 30 件まで。その中のラベルとプルリクエストも同じ。</LI>
                <LI>入れ子の上限は、ページングしていない。
                  <UL>
                    <LI>上限を超えた分は、取れない。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

          </Section>
        </>
    );
}
