import React from 'react';

import { Section, P, Panel, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「7. 関連をモデルにする (Matchmaker の拡張)」。
// これから作るものの仕様。まだ実装していない。
// 決めたことと、まだ決めていないことを分けて書く。
//
// 決めたことの (4)〜(7) は、GitHub の Issue で、1 つずつ決めた。(親は 25 番。子は 26〜30 番)

// GitHub の Issue へのリンク。
const URL_ISSUES = 'https://github.com/yanqirenshi/SOGH.next/issues/';

function IssueLink ({ num }) {
    return <a href={URL_ISSUES + num} target="_blank" rel="noreferrer">Issue {num}</a>;
}

// いま、クエリが入れ子で取っている関連。(Sogh が使うクエリを読んで洗い出した)
// 「置き換え先」は、決めたモデル。この表の関連が、最初にモデルにする関連になる。
const RELATION_COLUMNS = [
    { code: 'parent',   label: '親',           key: 'parent' },
    { code: 'relation', label: '関連',         val: (r)=> <C>{r.relation}</C> },
    { code: 'type',     label: 'GitHub の型',  key: 'type' },
    { code: 'model',    label: '置き換え先',   key: 'model' },
    { code: 'now',      label: 'いまの状態',   key: 'now' },
];

const JSON_ONLY = 'JSON のまま';

// 人が入る関連の型と、置き換え先。(「7.4 (4) 型が複数ある関連」)
const PERSON_TYPES = 'User / Organization / Bot / Mannequin / EnterpriseUserAccount';
const PERSON_MODEL = '人 (型ごとのモデル)';

const RELATIONS = [
    { parent: 'Repository',    relation: 'owner',                       type: 'User / Organization',                       model: 'User / Organization',                 now: 'モデルにしている (Organization も、User にしている)' },
    { parent: 'Issue',         relation: 'assignees',                   type: 'User',                                      model: 'User',                                now: JSON_ONLY },
    { parent: 'Issue',         relation: 'author',                      type: PERSON_TYPES,                                model: PERSON_MODEL,                          now: JSON_ONLY },
    { parent: 'Issue',         relation: 'labels',                      type: 'Label',                                     model: 'Label',                               now: `${JSON_ONLY} (Pool が無い)` },
    { parent: 'Issue',         relation: 'milestone',                   type: 'Milestone',                                 model: 'Milestone',                           now: `${JSON_ONLY} (Pool が無い)` },
    { parent: 'Issue',         relation: 'repository',                  type: 'Repository',                                model: 'Repository',                          now: JSON_ONLY },
    { parent: 'Issue',         relation: 'projectItems',                type: 'ProjectV2Item',                             model: 'ProjectV2Item',                       now: `${JSON_ONLY} (2 つのクエリだけが取る)` },
    { parent: 'Issue',         relation: 'comments',                    type: 'IssueComment',                              model: 'IssueComment',                        now: `${JSON_ONLY} (1 つのクエリだけが取る)` },
    { parent: 'IssueComment',  relation: 'author',                      type: PERSON_TYPES,                                model: PERSON_MODEL,                          now: JSON_ONLY },
    { parent: 'IssueComment',  relation: 'editor',                      type: PERSON_TYPES,                                model: PERSON_MODEL,                          now: JSON_ONLY },
    { parent: 'IssueComment',  relation: 'pullRequest',                 type: 'PullRequest',                               model: 'PullRequest',                         now: `${JSON_ONLY} (参照の組)` },
    { parent: 'ProjectV2',     relation: 'creator',                     type: PERSON_TYPES,                                model: PERSON_MODEL,                          now: JSON_ONLY },
    { parent: 'ProjectV2',     relation: 'owner',                       type: 'User / Organization / Issue / PullRequest', model: 'User / Organization / Issue / PullRequest', now: JSON_ONLY },
    { parent: 'ProjectV2',     relation: 'items',                       type: 'ProjectV2Item',                             model: 'ProjectV2Item',                       now: `${JSON_ONLY} (team のクエリだけが取る)` },
    { parent: 'ProjectV2Item', relation: 'project',                     type: 'ProjectV2',                                 model: 'ProjectV2',                           now: `${JSON_ONLY} (参照の組と owner)` },
    { parent: 'ProjectV2Item', relation: 'content',                     type: 'Issue / PullRequest / DraftIssue',          model: 'Issue / PullRequest / DraftIssue',    now: `${JSON_ONLY} (参照の組。本文が無い)` },
    { parent: 'ProjectV2Item', relation: 'creator',                     type: PERSON_TYPES,                                model: PERSON_MODEL,                          now: JSON_ONLY },
    { parent: 'ProjectV2Item', relation: 'fieldValues の users',        type: 'User',                                      model: 'User',                                now: JSON_ONLY },
    { parent: 'ProjectV2Item', relation: 'fieldValues の labels',       type: 'Label',                                     model: 'Label',                               now: JSON_ONLY },
    { parent: 'ProjectV2Item', relation: 'fieldValues の milestone',    type: 'Milestone',                                 model: 'Milestone',                           now: JSON_ONLY },
    { parent: 'ProjectV2Item', relation: 'fieldValues の repository',   type: 'Repository',                                model: 'Repository',                          now: `${JSON_ONLY} (参照の組)` },
    { parent: 'ProjectV2Item', relation: 'fieldValues の pullRequests', type: 'PullRequest',                               model: 'PullRequest',                         now: `${JSON_ONLY} (参照の組)` },
    { parent: 'ProjectV2Item', relation: 'fieldValues の reviewers',    type: 'User / Mannequin / Bot / Team',             model: 'User / Mannequin / Bot / Team',       now: `${JSON_ONLY} (参照の組)` },
];

// 人の型と、モデル・Pool。(Issue 27)
const PERSON_COLUMNS = [
    { code: 'type',  label: 'GitHub の型 (__typename)', val: (r)=> <C>{r.type}</C> },
    { code: 'model', label: 'モデル',                   key: 'model' },
    { code: 'pool',  label: 'Pool',                     key: 'pool' },
];

const POOL_NEW = '新しく足す';
const POOL_HAS = 'すでにある';

const PERSONS = [
    { type: 'User',                  model: 'User',                  pool: POOL_HAS },
    { type: 'Organization',          model: 'Organization',          pool: POOL_NEW },
    { type: 'Bot',                   model: 'Bot',                   pool: POOL_NEW },
    { type: 'Mannequin',             model: 'Mannequin',             pool: POOL_NEW },
    { type: 'EnterpriseUserAccount', model: 'EnterpriseUserAccount', pool: POOL_NEW },
];

// 人以外で、型が複数ある関連。(Issue 28)
const MULTI_COLUMNS = [
    { code: 'relation', label: '関連',     key: 'relation' },
    { code: 'type',     label: '入る型',   key: 'type' },
    { code: 'model',    label: 'モデル',   key: 'model' },
    { code: 'pool',     label: 'Pool',     key: 'pool' },
];

const MULTIS = [
    { relation: 'ProjectV2Item の content',   type: 'Issue',               model: 'Issue',               pool: POOL_HAS },
    { relation: 'ProjectV2Item の content',   type: 'PullRequest',         model: 'PullRequest',         pool: POOL_HAS },
    { relation: 'ProjectV2Item の content',   type: 'DraftIssue',          model: 'DraftIssue',          pool: POOL_NEW },
    { relation: 'ProjectV2 の owner',         type: 'User / Organization', model: '人 (型ごとのモデル)', pool: '人の表のとおり' },
    { relation: 'ProjectV2 の owner',         type: 'Issue / PullRequest', model: 'Issue / PullRequest', pool: POOL_HAS },
    { relation: 'ProjectV2Item の reviewers', type: 'User / Mannequin / Bot', model: '人 (型ごとのモデル)', pool: '人の表のとおり' },
    { relation: 'ProjectV2Item の reviewers', type: 'Team',                model: 'Team',                pool: POOL_NEW },
];

// 関連を返すメソッドのうち、fieldValues の中の関連を読むもの。(Issue 29)
const FIELD_VALUE_COLUMNS = [
    { code: 'method',   label: 'ProjectV2Item のメソッド', val: (r)=> <C>{r.method}</C> },
    { code: 'relation', label: '読んでいる関連',           val: (r)=> <C>{r.relation}</C> },
    { code: 'model',    label: '返すモデル',               key: 'model' },
];

const FIELD_VALUES = [
    { method: 'assignees()',          relation: 'users',        model: 'User' },
    { method: 'labels()',             relation: 'labels',       model: 'Label' },
    { method: 'milestone()',          relation: 'milestone',    model: 'Milestone' },
    { method: 'repository()',         relation: 'repository',   model: 'Repository' },
    { method: 'linkedPullRequests()', relation: 'pullRequests', model: 'PullRequest' },
    { method: 'reviewers()',          relation: 'reviewers',    model: 'User / Mannequin / Bot / Team' },
];

// 値が消えていた動きの例。(node の重ね方を変える前に、にせの node を Pool に入れて、実際に動かして確かめた)
const OVERWRITE_EXAMPLE = [
    '// viewer (項目がそろっている) を入れたあと、viewer が owner のリポジトリを入れる',
    "前: { login: 'octocat', name: 'The Octocat', email: 'octo@example.com' }",
    "後: { login: 'octocat', name: null,          email: null }",
    '',
    '// 本文つきの Issue を入れたあと、本文の無い node (ProjectV2Item の content の形) を入れる',
    "前: { owner: 'foo', plan: 3 }",
    "後: { owner: null,  plan: 0 }",
].join('\n');

// 同じ id の node が来たときの、場合分け。
const CASE_COLUMNS = [
    { code: 'when',   label: '場合',     key: 'when' },
    { code: 'merge',  label: '重ね方',   key: 'merge' },
    { code: 'reload', label: 'reload',   key: 'reload' },
];

const CASES = [
    { when: '手元に無い',                     merge: '新しく作る',               reload: '入れない' },
    { when: '来たほうが新しい',               merge: '来た項目を重ねる',         reload: 'そのときの日時を入れる' },
    { when: '日時が同じ',                     merge: '手元に無い項目だけ足す',   reload: '入れない' },
    { when: '来たほうが古い',                 merge: '手元に無い項目だけ足す',   reload: '入れない' },
    { when: 'updatedAt が無い、または null',  merge: '毎回、来た項目を重ねる',   reload: '入れない' },
];

// updatedAt を持つかどうか。(GitHub の GraphQL のリファレンスで確かめた)
const UPDATED_AT_COLUMNS = [
    { code: 'has',   label: 'updatedAt', key: 'has' },
    { code: 'nodes', label: 'ノード',    key: 'nodes' },
];

const UPDATED_AT = [
    { has: '持っている (必ず値が入る)',
      nodes: 'User, Organization, Bot, Mannequin, EnterpriseUserAccount, Team, Repository, Issue, PullRequest, IssueComment, Milestone, ProjectV2, ProjectV2Item, DraftIssue, ProjectV2 のフィールド' },
    { has: '持っているが、null のことがある',
      nodes: 'Label' },
    { has: '持っていない',
      nodes: 'Actor (author などの型の入れ物。中身の User や Bot は持っている), fieldValues のうちラベル・ユーザー・リポジトリ・マイルストーン・プルリクエスト・レビュアーの値 (値を入れる箱で、モデルにする対象ではない)' },
];

// 進み具合。(上から順に進める)
const PROGRESS_COLUMNS = [
    { code: 'work',  label: '作業',   key: 'work' },
    { code: 'state', label: '状態',   key: 'state' },
    { code: 'note',  label: '内容',   key: 'note' },
];

const PROGRESS = [
    { work: '1. クエリを整える',
      state: '済み',
      note: '項目の部品を型ごとに整理し、モデルにする型は id・updatedAt・__typename を必ず取るようにした。クエリの検査のスクリプトを足した' },
    { work: '2. node の重ね方を変える',
      state: '済み',
      note: 'Pool が、core を丸ごと差し替えずに、updatedAt を比べて重ねるようにした。GraphQLNode に merge(node) と reload 属性を足した。テスト (npm test) を足した' },
    { work: '3. Matchmaker を広げる',
      state: 'まだ',
      note: '入れ子で取った関連を、モデルにして Pool に入れる。始める前に決めることは、すべて決めた (「7.4 決めたこと」の (4)〜(7))' },
];

export default function MatchmakerSpec () {
    return (
        <Section title="関連をモデルにする (Matchmaker の拡張)" num="7." lev="4" sx={SX_MEMBER_TITLE}>
          <Panel kind="warning">この章は、これから作るものの仕様です。クエリの整理と、node の重ね方までは済んでいます。Matchmaker の拡張は、決めることはすべて決めましたが、まだ実装していません。(「7.6 進み具合」を見る)</Panel>

          <Section title="ねらい" num="7.1" lev="5">
            <OL>
              <LI>GraphQL で取得した node に入れ子で付いてくる関連 (Issue の assignees など) を、すべてモデルにする。</LI>
              <LI>モデルにする仕事は、<C>Matchmaker</C> が受け持つ。</LI>
              <LI>いまの <C>Matchmaker</C> がモデルにしているのは、Repository の owner だけ。</LI>
            </OL>
          </Section>

          <Section title="いま取っている関連" num="7.2" lev="5">
            <Table columns={RELATION_COLUMNS} rows={RELATIONS} ids={TABLE_IDS}/>
            <OL sx={SX_AFTER_TABLE}>
              <LI>「いまの状態」は、取得したあとのモデルの中での持ち方。</LI>
              <LI>「置き換え先」は、決めたモデル。この表の 23 の関連が、最初にモデルにする関連になる。(「7.4 (6) 対象の範囲」を見る)</LI>
              <LI>「人」は、型ごとのモデル。(「7.4 (4) 型が複数ある関連」を見る)</LI>
              <LI>クエリでは、どの関連も、<C>id</C> と <C>updatedAt</C> を取っている。(「5. 取得する項目」を見る)</LI>
            </OL>
          </Section>

          <Section title="先に解いた問題" num="7.3" lev="5">
            <P>これまでの Pool は、同じ id の node が来ると、core を丸ごと差し替えていました。</P>
            <P>入れ子の node は項目が少ないので、差し替えると、いまあるモデルの値が消えていました。</P>
            <Plane sx={SX_PLANE}>{OVERWRITE_EXAMPLE}</Plane>
            <OL>
              <LI>1 つ目は、Matchmaker を広げる前から起きていた。(Repository の owner は、すでに User にしているため)</LI>
              <LI><C>Matchmaker</C> をすべての関連に広げると、すべてのモデルで起きる。</LI>
              <LI>そのため、関連を広げる前に、node の重ね方を変えた。(「7.4 (1) node の重ね方」)</LI>
              <LI>いまは、上の 2 つの例のどちらでも、値は消えない。(テストで確かめている)</LI>
            </OL>
          </Section>

          <Section title="決めたこと" num="7.4" lev="5">

            <Section title="node の重ね方" num="(1)" lev="6">
              <OL>
                <LI>同じ id の node が来たら、core を丸ごと差し替えずに、来た項目だけを重ねる。</LI>
                <LI>重ねるかどうかは、最終更新日時 (<C>updatedAt</C>) を、手元のモデルと来た node で比べて決める。</LI>
              </OL>
              <Table columns={CASE_COLUMNS} rows={CASES} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>日時が同じでも、手元に無い項目は足す。
                  <UL>
                    <LI>先に項目の少ない node が来て、あとから項目のそろった node が来ることがあるため。</LI>
                    <LI>例: ProjectV2Item の content として本文の無い Issue が来たあと、本文つきの Issue を取る。</LI>
                  </UL>
                </LI>
                <LI>来たほうが古いときは、手元の値を上書きしない。
                  <UL>
                    <LI>取得が並行して動くと、古い応答があとから届くことがあるため。</LI>
                  </UL>
                </LI>
                <LI>重ねる単位は、一番上の項目。(title・assignees など)
                  <UL>
                    <LI>入れ子の中身までは、重ねない。(入れ子の中身は、Matchmaker が、別のモデルとして重ねる)</LI>
                  </UL>
                </LI>
                <LI>来た値が null の項目は、null で重ねる。(GitHub に値が無い、として扱う)
                  <UL>
                    <LI>来ていない項目は、触らない。</LI>
                  </UL>
                </LI>
                <LI>「updatedAt が無い、または null」は、手元と来た node の、どちらかに無いとき。</LI>
                <LI>実装は、<C>GraphQLNode</C> の <C>merge(node)</C>。Pool の <C>ensure(node, makeInstance, updater)</C> が呼ぶ。
                  <UL>
                    <LI><C>merge(node)</C> は、何をしたかを返す。(<C>newer</C>・<C>filled</C>・<C>kept</C>・<C>always</C>)</LI>
                    <LI>core を変えるときは <C>core(v)</C> を通すので、Issue と ProjectV2 は、注釈を読み取り直す。</LI>
                  </UL>
                </LI>
              </OL>

              <Panel kind="note">この重ね方では、古い項目が残る場合があります。あとで、reload の利用で解きます。(「7.5 (1) reload の使い道」を見る)</Panel>
            </Section>

            <Section title="reload 属性" num="(2)" lev="6">
              <OL>
                <LI><C>GraphQLNode</C> に、<C>reload</C> 属性を足す。(<C>reload()</C> で読む。はじめは null)</LI>
                <LI>GitHub 側の変更を重ねたとき (来たほうが新しいとき) に、そのときの日時を入れる。(ISO 8601 の文字列)</LI>
                <LI>手元の項目が増えただけのときは、入れない。</LI>
                <LI><C>updatedAt</C> が無い、または null で、毎回重ねるときも、入れない。
                  <UL>
                    <LI>値が変わったかどうかを見ないので、入れると、取るたびに <C>reload</C> が変わってしまうため。</LI>
                    <LI><C>reload</C> は、<C>updatedAt</C> で変更が分かったときだけの印になる。</LI>
                  </UL>
                </LI>
                <LI><C>reload</C> の使い道は、あとで決める。いまは、属性を足すところまで。</LI>
              </OL>
            </Section>

            <Section title="クエリで取る項目" num="(3)" lev="6">
              <OL>
                <LI>モデルにするノードは、入れ子で取るときも、<C>id</C> と <C>updatedAt</C> を必ず取る。</LI>
                <LI>Issue の author などは <C>Actor</C> という型で、<C>Actor</C> 自体は <C>id</C> も <C>updatedAt</C> も持たない。
                  <UL>
                    <LI>型ごとに取る。(<C>{'... on User { id updatedAt }'}</C> など)</LI>
                  </UL>
                </LI>
                <LI>型の名前 (<C>__typename</C>) も取る。(型が複数ある関連で、どの型かを見分けるため)</LI>
                <LI>クエリは、この決まりに合わせて整理した。(「5. 取得する項目」を見る)
                  <UL>
                    <LI>使用中のクエリは、モデルにする型のすべてで、<C>id</C> と <C>updatedAt</C> を取っている。</LI>
                    <LI>検査のスクリプトで確かめられる。(「3.7 クエリの検査」を見る)</LI>
                  </UL>
                </LI>
              </OL>
              <Table columns={UPDATED_AT_COLUMNS} rows={UPDATED_AT} ids={TABLE_IDS}/>
            </Section>

            <Section title="型が複数ある関連" num="(4)" lev="6">
              <OL>
                <LI>どのモデルにするかは、一律の決まりにしない。</LI>
                <LI>データの項目などの内容から、関連ごとに判断する。</LI>
                <LI>判断した関連は、次の 4 つ。
                  <UL>
                    <LI>作成者・編集者。(Issue の author、IssueComment の author と editor、ProjectV2 と ProjectV2Item の creator)</LI>
                    <LI>持ち主。(Repository の owner、ProjectV2 の owner)</LI>
                    <LI>ProjectV2Item の content。(Issue・PullRequest・DraftIssue)</LI>
                    <LI>ProjectV2Item の reviewers。(User・Team・Mannequin・Bot)</LI>
                  </UL>
                </LI>
              </OL>

              <P>人 (作成者・編集者・持ち主に入る型) は、型ごとにモデルを作ります。(<IssueLink num="27"/>)</P>
              <Table columns={PERSON_COLUMNS} rows={PERSONS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>どのモデルにするかは、<C>__typename</C> で決める。</LI>
                <LI>いまの <C>Matchmaker</C> は、Repository の owner が Organization のときも、User のモデルにしている。これを、Organization のモデルにする。</LI>
              </OL>

              <P>人以外で、型が複数ある関連は、入る型のすべてを、モデルにします。(<IssueLink num="28"/>)</P>
              <Table columns={MULTI_COLUMNS} rows={MULTIS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>DraftIssue と Team は、モデルと Pool を、新しく足す。</LI>
                <LI>ProjectV2 の owner が Issue・PullRequest のときに取っている項目は、<C>id</C>・<C>number</C>・<C>updatedAt</C> だけ。
                  <UL>
                    <LI>Pool は、手元に無い項目だけを足すので、すでにあるモデルの値は消えない。(「(1) node の重ね方」)</LI>
                  </UL>
                </LI>
                <LI>「モデルにしない」型を残すと、同じメソッドの戻り値に、モデルと JSON が混ざる。そのため、すべてモデルにする。</LI>
              </OL>
            </Section>

            <Section title="読み方" num="(5)" lev="6">
              <OL>
                <LI>関連を返すメソッド (<C>issue.assignees()</C> など) の戻り値を、JSON から、モデル (またはモデルの配列) に変える。(<IssueLink num="26"/>)</LI>
                <LI>関連を読むメソッドは、1 つにそろえる。(JSON を返すメソッドを、別の名前で残すことはしない)</LI>
                <LI>利用側の読み方が変わる。(<C>assignee.login</C> から <C>assignee.login()</C> へ)
                  <UL>
                    <LI>破壊的な変更になるので、sogh のバージョンを上げる。</LI>
                    <LI>sogh の部品 (<C>src/components/</C>) の 14 ファイルを、同時に直す。</LI>
                    <LI>iHub のコア (ihub.core) の 3 か所を、新しい sogh に合わせて直す。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

            <Section title="対象の範囲" num="(6)" lev="6">
              <OL>
                <LI>最初にモデルにする関連は、「7.2 いま取っている関連」の表の、23 の関連。(<IssueLink num="29"/>)</LI>
                <LI>Pool を、8 つ足す。(いまの 7 つと合わせて、15 になる)
                  <UL>
                    <LI>人の型: Organization・Bot・Mannequin・EnterpriseUserAccount。</LI>
                    <LI>型が複数ある関連の型: DraftIssue・Team。</LI>
                    <LI>モデルのクラスはあるが、Pool が無かったもの: Label・Milestone。</LI>
                  </UL>
                </LI>
                <LI>assignees は、User のモデルにする。<C>Assignee</C> のクラスは、使わない。</LI>
                <LI>viewer は、User のモデルにそろえる。<C>Viewer</C> のクラスは、使わない。
                  <UL>
                    <LI>いまは、<C>connect()</C> で取ると User (Pool に入る)、<C>asyncFetchViewer()</C> で取ると Viewer (Pool に入らない) になる。</LI>
                    <LI><C>asyncFetchViewer()</C> も、User のモデルを作って、<C>user</C> の Pool に入れる。</LI>
                  </UL>
                </LI>
                <LI>Projects (classic) の関連は、対象から外す。
                  <UL>
                    <LI>GitHub で廃止されていて、取ろうとすると、エラーが返る。</LI>
                    <LI>クエリと、モデルのクラス (<C>Project</C>・<C>Card</C>・<C>Column</C>) は、今回は触らずに残す。</LI>
                  </UL>
                </LI>
                <LI>ProjectV2Item の fieldValues そのものは、モデルにしない。(値を入れる箱なので)</LI>
                <LI>fieldValues の中の関連は、モデルにする。次のメソッドは、モデルを返す。</LI>
              </OL>
              <Table columns={FIELD_VALUE_COLUMNS} rows={FIELD_VALUES} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI><C>fieldValues()</C> や <C>getFieldValueByName(name)</C> で、箱を直接読んだときの値は、JSON のまま。</LI>
                <LI>箱に付いている creator (日付・数値・テキストなどの値を入れた人) も、JSON のまま。</LI>
              </OL>
            </Section>

            <Section title="関連の完全さ" num="(7)" lev="6">
              <OL>
                <LI>件数の上限で切れた関連は、取れた分だけをモデルにする。(<IssueLink num="30"/>)
                  <UL>
                    <LI>例: Issue の assignees と labels は、10 件まで。</LI>
                    <LI>欠けていることを知らせる仕組みは、今回は作らない。必要になったときに、足す。</LI>
                  </UL>
                </LI>
                <LI>逆向きの関連は、モデルで持たない。
                  <UL>
                    <LI>モデルが返すのは、クエリで取った向きの関連だけ。(Issue から Repository、など)</LI>
                    <LI>逆の向き (Repository から Issue、など) が要るときは、利用側が、Pool の一覧から探す。</LI>
                  </UL>
                </LI>
                <LI>関連が一周する場合も、特別な扱いはしない。(Issue → Item → content → Issue)
                  <UL>
                    <LI>たどるのは、取得した JSON の入れ子なので、JSON の深さで必ず終わる。</LI>
                    <LI>同じ id の node がもう一度来ても、node の重ね方で、同じモデルに重なる。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

          </Section>

          <Section title="まだ決めていないこと" num="7.5" lev="5">

            <Section title="reload の使い道" num="(1)" lev="6">
              <P>いまの重ね方では、取り直しても、古い項目が残る場合があります。これを、reload を使って解きます。使い方は、まだ決めていません。</P>
              <OL>
                <LI>項目の少ない新しい node を重ねたあと、古い項目が残る。
                  <UL>
                    <LI>例: 本文つきの Issue (更新 10:00) を持っている。</LI>
                    <LI>GitHub で本文が変わったあと (11:00)、一覧の取得で、本文の無い Issue (11:00) が来る。</LI>
                    <LI>題名は新しくなり、手元の日時は 11:00 になる。本文は、10:00 のまま残る。</LI>
                    <LI>そのあと、本文つきの Issue (11:00) を取っても、日時が同じなので、本文は古いまま。</LI>
                    <LI>このとき、reload には日時が入っている。(GitHub 側で変更があったことは、分かる)</LI>
                  </UL>
                </LI>
                <LI>親の updatedAt が動かない変更は、入れ子の項目に反映されない。
                  <UL>
                    <LI>入れ子の項目 (assignees・projectItems など) は、親の core の中に、JSON のまま持っている。</LI>
                    <LI>親の updatedAt が同じなら、取り直しても、入れ子の項目は重ねない。</LI>
                    <LI>例: プロジェクトのフィールドの値を変えても、Issue の updatedAt が動かなければ、Issue の中の projectItems は古いまま。</LI>
                    <LI>どの変更で updatedAt が動くかは、確かめていない。(「(2) 実装の前に確かめること」を見る)</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

            <Section title="実装の前に確かめること" num="(2)" lev="6">
              <OL>
                <LI><C>updatedAt</C> が、どの変更で動くか。
                  <UL>
                    <LI>GitHub のリファレンスには「最後に更新された日時」としか書かれていない。</LI>
                    <LI>例: Issue にラベルを付けたとき、プロジェクトに足したときに、Issue の <C>updatedAt</C> が動くか。</LI>
                    <LI>動かない変更があると、その変更は、取り直しても反映されない。</LI>
                    <LI>node の重ね方を変えたので、いまのコードは、もうこの動きになっている。(これまでは、取り直すと、丸ごと差し替わっていた)</LI>
                  </UL>
                </LI>
                <LI>組織 (org) とチームのクエリを、GitHub に実際に送って、応答が返るか。
                  <UL>
                    <LI>viewer・リポジトリ・Issue・ProjectV2 のクエリと、node の重ね方は、GitHub につないで確かめた。(「3.8 GitHub につないで確かめる」を見る)</LI>
                    <LI>組織とチームのクエリ (6 個) は、対象を決めていないので、まだ送っていない。</LI>
                    <LI>書き込みのクエリ (コメントの追加・更新・削除) は、送っていない。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

            <Section title="実装のときに決めること" num="(3)" lev="6">
              <OL>
                <LI>関連を返すメソッドが、モデルを、どこから読むか。
                  <UL>
                    <LI>親の core に、入れ子の JSON を残すか、id だけを持つか。</LI>
                  </UL>
                </LI>
                <LI><C>Assignee</C> と <C>Viewer</C> のクラスを、消すか。(使わなくなる)</LI>
                <LI><C>PullRequest</C> の <C>assignees()</C> の直し方。
                  <UL>
                    <LI>core に <C>assignees</C> があることを前提にしていて、取っていないと、TypeError になる。</LI>
                    <LI>ProjectV2Item の content として来た PullRequest は、<C>assignees</C> を取っていない。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

          </Section>

          <Section title="進み具合" num="7.6" lev="5">
            <Table columns={PROGRESS_COLUMNS} rows={PROGRESS} ids={TABLE_IDS}/>
          </Section>
        </Section>
    );
}
