import React from 'react';

import { Section, P, Panel, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「7. 関連をモデルにする (Matchmaker の拡張)」。
// 仕様と、その結果。sogh 0.4.0 で実装した。
// 決めたことと、まだ決めていないこと・残っていることを分けて書く。
//
// 決めたことの (4)〜(7) は、GitHub の Issue で、1 つずつ決めた。(親は 25 番。子は 26〜30 番)

// GitHub の Issue へのリンク。
const URL_ISSUES = 'https://github.com/yanqirenshi/SOGH.next/issues/';

function IssueLink ({ num }) {
    return <a href={URL_ISSUES + num} target="_blank" rel="noreferrer">Issue {num}</a>;
}

// クエリが入れ子で取っている関連と、モデル。(Sogh が使うクエリを読んで洗い出した)
// この表の 23 の関連を、モデルにした。「読むメソッド」は、親のモデルのメソッド。
const RELATION_COLUMNS = [
    { code: 'parent',   label: '親',           key: 'parent' },
    { code: 'relation', label: '関連',         val: (r)=> <C>{r.relation}</C> },
    { code: 'type',     label: 'GitHub の型',  key: 'type' },
    { code: 'model',    label: 'モデル',       key: 'model' },
    { code: 'method',   label: '読むメソッド', val: (r)=> <C>{r.method}</C> },
];

// 人が入る関連の型と、モデル。(「7.4 (4) 型が複数ある関連」)
const PERSON_TYPES = 'User / Organization / Bot / Mannequin / EnterpriseUserAccount';
const PERSON_MODEL = '人 (型ごとのモデル)';

const RELATIONS = [
    { parent: 'Repository',    relation: 'owner',                       type: 'User / Organization',                       model: 'User / Organization',                 method: 'owner()' },
    { parent: 'Issue',         relation: 'assignees',                   type: 'User',                                      model: 'User',                                method: 'assignees()' },
    { parent: 'Issue',         relation: 'author',                      type: PERSON_TYPES,                                model: PERSON_MODEL,                          method: 'author()' },
    { parent: 'Issue',         relation: 'labels',                      type: 'Label',                                     model: 'Label',                               method: 'labels()' },
    { parent: 'Issue',         relation: 'milestone',                   type: 'Milestone',                                 model: 'Milestone',                           method: 'milestone()' },
    { parent: 'Issue',         relation: 'repository',                  type: 'Repository',                                model: 'Repository',                          method: 'repository()' },
    { parent: 'Issue',         relation: 'projectItems',                type: 'ProjectV2Item',                             model: 'ProjectV2Item',                       method: 'projectV2Items()' },
    { parent: 'Issue',         relation: 'comments',                    type: 'IssueComment',                              model: 'IssueComment',                        method: 'comments()' },
    { parent: 'IssueComment',  relation: 'author',                      type: PERSON_TYPES,                                model: PERSON_MODEL,                          method: 'author()' },
    { parent: 'IssueComment',  relation: 'editor',                      type: PERSON_TYPES,                                model: PERSON_MODEL,                          method: 'editor()' },
    { parent: 'IssueComment',  relation: 'pullRequest',                 type: 'PullRequest',                               model: 'PullRequest',                         method: 'pullRequest()' },
    { parent: 'ProjectV2',     relation: 'creator',                     type: PERSON_TYPES,                                model: PERSON_MODEL,                          method: 'creator()' },
    { parent: 'ProjectV2',     relation: 'owner',                       type: 'User / Organization / Issue / PullRequest', model: 'User / Organization / Issue / PullRequest', method: 'owner()' },
    { parent: 'ProjectV2',     relation: 'items',                       type: 'ProjectV2Item',                             model: 'ProjectV2Item',                       method: 'items()' },
    { parent: 'ProjectV2Item', relation: 'project',                     type: 'ProjectV2',                                 model: 'ProjectV2',                           method: 'project()' },
    { parent: 'ProjectV2Item', relation: 'content',                     type: 'Issue / PullRequest / DraftIssue',          model: 'Issue / PullRequest / DraftIssue',    method: 'content()' },
    { parent: 'ProjectV2Item', relation: 'creator',                     type: PERSON_TYPES,                                model: PERSON_MODEL,                          method: 'creator()' },
    { parent: 'ProjectV2Item', relation: 'fieldValues の users',        type: 'User',                                      model: 'User',                                method: 'assignees()' },
    { parent: 'ProjectV2Item', relation: 'fieldValues の labels',       type: 'Label',                                     model: 'Label',                               method: 'labels()' },
    { parent: 'ProjectV2Item', relation: 'fieldValues の milestone',    type: 'Milestone',                                 model: 'Milestone',                           method: 'milestone()' },
    { parent: 'ProjectV2Item', relation: 'fieldValues の repository',   type: 'Repository',                                model: 'Repository',                          method: 'repository()' },
    { parent: 'ProjectV2Item', relation: 'fieldValues の pullRequests', type: 'PullRequest',                               model: 'PullRequest',                         method: 'linkedPullRequests()' },
    { parent: 'ProjectV2Item', relation: 'fieldValues の reviewers',    type: 'User / Mannequin / Bot / Team',             model: 'User / Mannequin / Bot / Team',       method: 'reviewers()' },
];

// 人の型と、モデル・Pool。(Issue 27)
const PERSON_COLUMNS = [
    { code: 'type',  label: 'GitHub の型 (__typename)', val: (r)=> <C>{r.type}</C> },
    { code: 'model', label: 'モデル',                   key: 'model' },
    { code: 'pool',  label: 'Pool',                     key: 'pool' },
];

const POOL_NEW = '0.4.0 で足した';
const POOL_HAS = 'もとからある';

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
    { when: '手元に無い (主に取った node)',         merge: '新しく作る',               reload: '入れない' },
    { when: '手元に無い (入れ子で来た node)',       merge: '新しく作る',               reload: 'そのときの日時を入れる' },
    { when: '来たほうが新しい',                     merge: '来た項目を重ねる',         reload: 'そのときの日時を入れる' },
    { when: '日時が同じで、reload が入っている',    merge: '来た項目を重ねる',         reload: '変えない' },
    { when: '日時が同じで、reload が入っていない',  merge: '手元に無い項目だけ足す',   reload: '入れない' },
    { when: '来たほうが古い',                       merge: '手元に無い項目だけ足す',   reload: '変えない' },
    { when: 'updatedAt が無い、または null',        merge: '毎回、来た項目を重ねる',   reload: '変えない' },
];

// どの操作で updatedAt が動くか。(2026-11-16 に npm run check:updated-at で調べた。yanqirenshi/SOGH.next#51)
const MOVED_COLUMNS = [
    { code: 'op',      label: '操作',                    key: 'op' },
    { code: 'issue',   label: 'Issue の updatedAt',      key: 'issue' },
    { code: 'item',    label: 'Item の updatedAt',       key: 'item' },
    { code: 'project', label: 'ProjectV2 の updatedAt',  key: 'project' },
];

const MOVED = [
    { op: 'ラベルを付ける・担当者を足す・マイルストーンを設定する', issue: '動いた',   item: '動いた',               project: '動いた' },
    { op: 'コメントを足す',                                         issue: '動いた',   item: '動かない',             project: '動かない' },
    { op: 'コメントを編集する',                                     issue: '動いた',   item: '動いた',               project: '動いた' },
    { op: 'Item の Status を変える',                                issue: '動かない', item: '動いた',               project: '動いた' },
    { op: 'プロジェクトから外す・足す',                             issue: '動かない', item: '(無くなる・増える)',   project: '動いた' },
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
      state: '済み (PR 22)',
      note: '項目の部品を型ごとに整理し、モデルにする型は id・updatedAt・__typename を必ず取るようにした。クエリの検査のスクリプトを足した' },
    { work: '2. node の重ね方を変える',
      state: '済み (PR 24)',
      note: 'Pool が、core を丸ごと差し替えずに、updatedAt を比べて重ねるようにした。GraphQLNode に merge(node) と reload 属性を足した。テスト (npm test) を足した' },
    { work: '3. Matchmaker を広げる',
      state: '済み (PR 32)',
      note: '入れ子で取った 23 の関連を、モデルにして Pool に入れるようにした。関連を返すメソッドは、モデルを返す。モデルを 6 つ、Pool を 8 つ足した。sogh を 0.4.0 にした' },
    { work: '4. 取り直しの重ね方を直す',
      state: '済み (Issue 34)',
      note: '入れ子で来た node で、初めてモデルを作ったときに、reload を入れるようにした。日時が同じでも、reload が入っていれば、来た項目を重ねるようにした。sogh を 0.4.1 にした' },
];

// 取り直しの重ね方を直したあとに、確かめた結果。(2026-11-16)
const VERIFY_COLUMNS = [
    { code: 'how',    label: '確かめ方', val: (r)=> <C>{r.how}</C> },
    { code: 'result', label: '結果',     key: 'result' },
];

const VERIFIES = [
    { how: 'npm test',
      result: '57 件が、すべて通る。(GitHub には、つながない。にせの node で、23 の関連と、取り直しの重ね方を確かめる)' },
    { how: 'npm run check:live',
      result: 'クエリは OK 12 個。重ね方と関連は OK 9 個。viewer の Issue 444 件などの関連 2,497 個で、core の JSON にある数だけ、モデルが返った' },
];

export default function MatchmakerSpec () {
    return (
        <Section title="関連をモデルにする (Matchmaker の拡張)" num="7." lev="4" sx={SX_MEMBER_TITLE}>
          <Panel kind="note">この章の内容は、sogh 0.4.0 で実装しました。関連を返すメソッドは、JSON ではなく、モデルを返します。(「7.6 進み具合」を見る)</Panel>

          <Section title="ねらい" num="7.1" lev="5">
            <OL>
              <LI>GraphQL で取得した node に入れ子で付いてくる関連 (Issue の assignees など) を、すべてモデルにする。</LI>
              <LI>モデルにする仕事は、<C>Matchmaker</C> が受け持つ。</LI>
              <LI>0.3.0 までの <C>Matchmaker</C> がモデルにしていたのは、Repository の owner だけ。0.4.0 で、下の表の関連に広げた。</LI>
            </OL>
          </Section>

          <Section title="モデルにした関連" num="7.2" lev="5">
            <Table columns={RELATION_COLUMNS} rows={RELATIONS} ids={TABLE_IDS}/>
            <OL sx={SX_AFTER_TABLE}>
              <LI>クエリが入れ子で取っている、23 の関連。(「7.4 (6) 対象の範囲」を見る)</LI>
              <LI>「人」は、型ごとのモデル。(「7.4 (4) 型が複数ある関連」を見る)</LI>
              <LI>「読むメソッド」は、親のモデルのメソッド。モデル (またはモデルの配列) を返す。(「7.4 (5) 読み方」を見る)</LI>
              <LI>ProjectV2 の owner は、<C>owner()</C> で読む。(0.5.0 から。<C>yanqirenshi/SOGH.next#71</C>)
                <UL>
                  <LI>0.4.0 では、<C>ownerNode()</C> という名前にしていた。<C>owner()</C> は、README の <C>$Owner</C> の値 (文字列) を返すメソッドとして、もとからあったため。</LI>
                  <LI>0.5.0 で、名前を変えた。<C>owner()</C> は、GitHub の owner のモデルを返す。(Repository の <C>owner()</C> と同じ意味)</LI>
                  <LI>README の <C>$Owner</C> の値は、<C>readmeOwner()</C> で読む。<C>ownerNode()</C> は、消した。</LI>
                </UL>
              </LI>
              <LI>クエリによって、取っていない関連がある。(「5.4 入れ子で取るもの」を見る)
                <UL>
                  <LI>取っていない関連を読むと、null か、空の配列が返る。</LI>
                </UL>
              </LI>
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
                <LI>日時が同じで、reload が入っているときは、来た項目を重ねる。(0.4.1 から。<IssueLink num="34"/>)
                  <UL>
                    <LI>reload が入っているモデルは、core が、項目の少ない node からできているかもしれないため。(「(2) reload 属性」)</LI>
                    <LI>例: 本文つきの Issue (更新 10:00) を持っている。GitHub で本文が変わったあと (11:00)、Item の一覧の取得で、本文の無い Issue (11:00) が来る。</LI>
                    <LI>手元の日時は 11:00 になり、reload が入る。本文は、まだ 10:00 のもの。</LI>
                    <LI>そのあと、本文つきの Issue (11:00) を取ると、日時は同じだが、reload が入っているので、本文を重ねる。</LI>
                    <LI>0.4.0 では、ここで重ねなかったので、本文が古いまま残っていた。</LI>
                  </UL>
                </LI>
                <LI>日時が同じで、reload が入っていないときは、手元に無い項目だけ足す。(手元にある項目は、上書きしない)
                  <UL>
                    <LI>GitHub 側の変更が無いのに、取るたびに core を作り直すことを、避けるため。</LI>
                    <LI>例: <C>issue_by_id</C> で取った Issue を、<C>issue_by_org_repo_issue_number</C> で取り直すと、projectItems が足される。</LI>
                    <LI>ただし、Issue の <C>projectItems</C> だけは、来た値と手元の値の中身 (JSON) を比べて、違えば、来た値で重ねる。(0.4.2 から。<IssueLink num="51"/>)</LI>
                    <LI>Issue をプロジェクトに足す・外すときや、Item のフィールドの値を変えたとき、GitHub は Issue の updatedAt を動かさないため。(「7.5 (1) updatedAt が動かない変更」を見る)</LI>
                    <LI>中身が同じときは、重ねない。来た node に <C>projectItems</C> が無いときは、触らない。来たほうが古いときは、上書きしない。</LI>
                    <LI>この扱いをする項目は、モデルごとに <C>sameTimeKeys()</C> で指定する。(Issue は <C>projectItems</C>。ほかのモデルは無い)</LI>
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
                    <LI><C>merge(node)</C> は、何をしたかを返す。(<C>newer</C>・<C>same</C>・<C>refreshed</C>・<C>filled</C>・<C>kept</C>・<C>always</C>。<C>refreshed</C> は、日時が同じで、Issue の <C>projectItems</C> を重ねたとき)</LI>
                    <LI>core を変えるときは <C>core(v)</C> を通すので、Issue と ProjectV2 は、注釈を読み取り直す。</LI>
                  </UL>
                </LI>
              </OL>

              <Panel kind="note">0.4.0 では、取り直しても、GitHub 側の変更が反映されない場合がありました。0.4.1 で、reload を使って直しました。親の updatedAt が動かない変更 (Issue の projectItems) は、0.4.2 で直しました。(「7.5 (1) updatedAt が動かない変更」を見る)</Panel>
            </Section>

            <Section title="reload 属性" num="(2)" lev="6">
              <OL>
                <LI><C>GraphQLNode</C> に、<C>reload</C> 属性を足す。(<C>reload()</C> で読む。はじめは null)</LI>
                <LI><C>reload</C> は、「同じ日時の node が来たら、重ねてよい」という印。次の 2 つのときに、そのときの日時を入れる。(ISO 8601 の文字列)
                  <UL>
                    <LI>GitHub 側の変更を重ねたとき。(来たほうが新しいとき)</LI>
                    <LI>入れ子で来た node で、初めてモデルを作ったとき。(0.4.1 から。<IssueLink num="34"/>)</LI>
                  </UL>
                </LI>
                <LI>どちらも、手元の core が、項目の少ない node からできているかもしれない場合。
                  <UL>
                    <LI>入れ子で来た node は、項目が少ない。(本文や README を持たない)</LI>
                    <LI>新しい node を重ねたときも、来た node の項目が少なければ、ほかの項目は古いまま残る。</LI>
                  </UL>
                </LI>
                <LI>入れ子で来たかどうかは、<C>Matchmaker</C> が入れ子を辿っている途中かどうかで、見分ける。
                  <UL>
                    <LI><C>Matchmaker</C> の <C>isNesting()</C> が返す。<C>Pool</C> の <C>ensure(node, makeInstance, updater)</C> が、モデルを作ったときに見る。</LI>
                    <LI>入れ子で来た node でも、すでにモデルがあるときは、入れない。(重ね方は、上の表のとおり)</LI>
                  </UL>
                </LI>
                <LI>手元の項目が増えただけのときは、入れない。</LI>
                <LI><C>updatedAt</C> が無い、または null で、毎回重ねるときも、入れない。
                  <UL>
                    <LI>値が変わったかどうかを見ないので、入れると、取るたびに <C>reload</C> が変わってしまうため。</LI>
                  </UL>
                </LI>
                <LI>一度入った <C>reload</C> は、消さない。
                  <UL>
                    <LI>そのモデルには、日時が同じ node が来るたびに、来た項目を重ねる。</LI>
                  </UL>
                </LI>
                <LI><C>reload</C> の、ほかの使い道は、決めていない。(利用側が、取り直すきっかけにする、など)</LI>
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
                <LI>どのモデルにするかは、<C>__typename</C> で決める。(Pooler の <C>node2model(node)</C>)</LI>
                <LI>0.3.0 までは、Repository の owner が Organization のときも、User のモデルにしていた。0.4.0 からは、Organization のモデルになる。</LI>
              </OL>

              <P>人以外で、型が複数ある関連は、入る型のすべてを、モデルにします。(<IssueLink num="28"/>)</P>
              <Table columns={MULTI_COLUMNS} rows={MULTIS} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>DraftIssue と Team は、モデルと Pool を、新しく足した。</LI>
                <LI>ProjectV2 の owner が Issue・PullRequest のときに取っている項目は、<C>id</C>・<C>number</C>・<C>updatedAt</C> だけ。
                  <UL>
                    <LI>Pool は、来た項目だけを重ねるので、すでにあるモデルの、ほかの値は消えない。(「(1) node の重ね方」)</LI>
                  </UL>
                </LI>
                <LI>「モデルにしない」型を残すと、同じメソッドの戻り値に、モデルと JSON が混ざる。そのため、すべてモデルにする。</LI>
              </OL>
            </Section>

            <Section title="読み方" num="(5)" lev="6">
              <OL>
                <LI>関連を返すメソッド (<C>issue.assignees()</C> など) の戻り値を、JSON から、モデル (またはモデルの配列) に変える。(<IssueLink num="26"/>)</LI>
                <LI>関連を読むメソッドは、1 つにそろえる。(JSON を返すメソッドを、別の名前で残すことはしない)</LI>
                <LI>モデルの引き方。
                  <UL>
                    <LI><C>Matchmaker</C> が、入れ子の node を、親より先に、モデルにして Pool に入れる。</LI>
                    <LI>親の core には、入れ子の JSON を、そのまま残す。</LI>
                    <LI>関連を返すメソッドは、JSON の id で、Pool からモデルを引く。(<C>GraphQLNode</C> の <C>relation(node)</C> と <C>relations(connection)</C>)</LI>
                    <LI>関連が無いとき、id が無いとき、Pool に無いときは、null か、空の配列を返す。</LI>
                  </UL>
                </LI>
                <LI>利用側の読み方が変わった。(<C>assignee.login</C> から <C>assignee.login()</C> へ)
                  <UL>
                    <LI>破壊的な変更なので、sogh のバージョンを、0.4.0 に上げた。</LI>
                    <LI>sogh の部品 (<C>src/components/</C>) は、モデルの読み方に直した。(12 ファイル)</LI>
                    <LI>iHub のコア (ihub.core) の 3 か所は、まだ直していない。(「7.5 (3) 直していないもの」を見る)</LI>
                  </UL>
                </LI>
                <LI><C>PullRequest</C> の <C>assignees()</C> も、User のモデルの配列を返す。
                  <UL>
                    <LI>core に <C>assignees</C> が無いときは、空の配列を返す。(これまでは、TypeError になっていた)</LI>
                    <LI><C>repository()</C> と <C>author()</C> も、モデルを返す。(0.4.2 から。<IssueLink num="49"/>。いまは、どのクエリも取っていないので、null が返る)</LI>
                  </UL>
                </LI>
                <LI>型が複数ある関連 (<C>issue.author()</C>・<C>item.content()</C>・<C>item.reviewers()</C> など) が返すモデルの型は、<C>typename()</C> で見分ける。(0.4.2 から。<IssueLink num="38"/>)
                  <UL>
                    <LI><C>typename()</C> は、core の <C>__typename</C> を返す。(無いときは null)</LI>
                    <LI>入口から <C>models</C> を export したので、<C>obj instanceof models.Bot</C> のように、instanceof でも見分けられる。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

            <Section title="対象の範囲" num="(6)" lev="6">
              <OL>
                <LI>最初にモデルにする関連は、「7.2 モデルにした関連」の表の、23 の関連。(<IssueLink num="29"/>)</LI>
                <LI>Pool を、8 つ足した。(もとからの 7 つと合わせて、15 になった。「4.2 Pool」を見る)
                  <UL>
                    <LI>人の型: Organization・Bot・Mannequin・EnterpriseUserAccount。</LI>
                    <LI>型が複数ある関連の型: DraftIssue・Team。</LI>
                    <LI>モデルのクラスはあるが、Pool が無かったもの: Label・Milestone。</LI>
                  </UL>
                </LI>
                <LI>assignees は、User のモデルにする。<C>Assignee</C> のクラスは、消した。</LI>
                <LI>viewer は、User のモデルにそろえる。<C>Viewer</C> のクラスは、消した。
                  <UL>
                    <LI>0.3.0 までは、<C>connect()</C> で取ると User (Pool に入る)、<C>asyncFetchViewer()</C> で取ると Viewer (Pool に入らない) になっていた。</LI>
                    <LI>0.4.0 からは、<C>asyncFetchViewer()</C> も、User のモデルを作って、<C>user</C> の Pool に入れる。</LI>
                  </UL>
                </LI>
                <LI>Projects (classic) の関連は、対象から外す。
                  <UL>
                    <LI>GitHub で廃止されていて、取ろうとすると、エラーが返る。</LI>
                    <LI>クエリと、モデルのクラス (<C>Project</C>・<C>Card</C>・<C>Column</C>) は、今回は触らずに残す。</LI>
                    <LI>そのあと、Projects (classic) を取るクエリは、Sogh のメソッドから使われていなかったので、0.5.0 で消した。(<IssueLink num="66"/>)</LI>
                    <LI>モデルのクラス (<C>Project</C>・<C>Card</C>・<C>Column</C>) も、0.5.0 で消した。(<IssueLink num="81"/>)</LI>
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

          <Section title="まだ決めていないこと・残っていること" num="7.5" lev="5">

            <Section title="updatedAt が動かない変更" num="(1)" lev="6">
              <P>どの node が関連しているかは、親の core の JSON に持っているので、親の updatedAt が動かない変更は、取り直しても、反映されない場合がありました。どの操作で updatedAt が動くかを、GitHub で調べました。(2026-11-16。<C>npm run check:updated-at</C>。<IssueLink num="51"/>)</P>
              <Table columns={MOVED_COLUMNS} rows={MOVED} ids={TABLE_IDS}/>
              <OL sx={SX_AFTER_TABLE}>
                <LI>「関連が変わったのに、親の updatedAt が動かない」のは、Issue をプロジェクトに足す・外す、の 1 種類だけだった。(Issue の projectItems)
                  <UL>
                    <LI>ほかの操作では、関連が変わった親の updatedAt は、動いた。(ラベル・担当者・マイルストーンでは Issue と Item、コメントでは Issue、Status では Item と ProjectV2)</LI>
                    <LI>Item の Status を変えても、Issue の updatedAt は動かない。そのため、Issue の core の projectItems の中の JSON (fieldValues) も、取り直しても、古いまま残っていたことになる。</LI>
                  </UL>
                </LI>
                <LI>0.4.2 で、Issue の projectItems を、日時が同じときも、中身が違えば重ねるようにした。(「7.4 (1) node の重ね方」を見る)
                  <UL>
                    <LI><C>issue.projectV2Items()</C> が、プロジェクトへの出し入れに合わせて、増減する。</LI>
                    <LI>projectItems を直に読むメソッド (<C>fieldValues()</C>・<C>dueDate()</C>・<C>nextActionDate()</C> など) も、新しい値を返す。</LI>
                  </UL>
                </LI>
                <LI>reload の、ほかの使い道は、決めていない。(利用側が、取り直すきっかけにする、など)</LI>
                <LI>項目の少ない node が先に来て、古い項目が残る場合は、0.4.1 で直した。(<IssueLink num="34"/>。「7.4 (1) node の重ね方」を見る)</LI>
              </OL>
            </Section>

            <Section title="まだ確かめていないこと" num="(2)" lev="6">
              <OL>
                <LI><C>updatedAt</C> が、どの変更で動くかは、調べた。(「(1) updatedAt が動かない変更」を見る) 次のものは、まだ調べていない。
                  <UL>
                    <LI>逆向きの操作。(ラベルを外す・担当者を外す・マイルストーンを外す・コメントを消す)</LI>
                    <LI>PullRequest と DraftIssue の Item。(調べたのは、Issue の Item だけ)</LI>
                    <LI>組織 (org) のプロジェクト。</LI>
                    <LI>Status のほかの型のフィールド。(日付・数値・テキスト・イテレーション)</LI>
                  </UL>
                </LI>
                <LI>ProjectV2Item の関連を、GitHub につないで確かめること。
                  <UL>
                    <LI>GitHub につないだ確認では、調べた ProjectV2Item が 0 件だった。</LI>
                    <LI>ProjectV2Item の関連 (content・fieldValues の中の関連など) は、テスト (にせの node) でだけ確かめている。</LI>
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

            <Section title="直していないもの" num="(3)" lev="6">
              <OL>
                <LI>iHub のコア (ihub.core) の 3 か所が、古い読み方のまま。(別のパッケージなので、ここでは直していない)
                  <UL>
                    <LI><C>Bridge.js</C> と <C>bridgeSlice.js</C> の <C>ass.login</C> は、<C>ass.login()</C> に直す。</LI>
                    <LI><C>ScrumProjectItem.js</C> の <C>item.content().id</C> は、<C>item.content().id()</C> に直す。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

          </Section>

          <Section title="進み具合" num="7.6" lev="5">
            <Table columns={PROGRESS_COLUMNS} rows={PROGRESS} ids={TABLE_IDS}/>
            <P>取り直しの重ね方を直したあとに、確かめた結果は、次のとおりです。(2026-11-16)</P>
            <Table columns={VERIFY_COLUMNS} rows={VERIFIES} ids={TABLE_IDS}/>
          </Section>
        </Section>
    );
}
