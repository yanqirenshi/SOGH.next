import React from 'react';

import { Section, P, Panel, Plane, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE, SX_PLANE } from './utils.js';

// 「Github」タブの「7. 関連をモデルにする (Matchmaker の拡張)」。
// これから作るものの仕様。まだ実装していない。
// 決めたことと、まだ決めていないことを分けて書く。

// いま、クエリが入れ子で取っている関連。(Sogh が使うクエリを読んで洗い出した)
const RELATION_COLUMNS = [
    { code: 'parent',   label: '親',           key: 'parent' },
    { code: 'relation', label: '関連',         val: (r)=> <C>{r.relation}</C> },
    { code: 'type',     label: 'GitHub の型',  key: 'type' },
    { code: 'model',    label: '置き換え先',   key: 'model' },
    { code: 'now',      label: 'いまの状態',   key: 'now' },
];

const JSON_ONLY = 'JSON のまま';

const RELATIONS = [
    { parent: 'Repository',    relation: 'owner',           type: 'User / Organization',             model: 'User',          now: 'モデルにしている' },
    { parent: 'Issue',         relation: 'assignees',       type: 'User',                            model: 'User',          now: JSON_ONLY },
    { parent: 'Issue',         relation: 'author',          type: 'User / Bot / Organization ほか',  model: '都度判断',      now: `${JSON_ONLY} (id を取っていない)` },
    { parent: 'Issue',         relation: 'labels',          type: 'Label',                           model: 'Label',         now: `${JSON_ONLY} (Pool が無い)` },
    { parent: 'Issue',         relation: 'milestone',       type: 'Milestone',                       model: 'Milestone',     now: `${JSON_ONLY} (Pool が無い)` },
    { parent: 'Issue',         relation: 'repository',      type: 'Repository',                      model: 'Repository',    now: JSON_ONLY },
    { parent: 'Issue',         relation: 'projectItems',    type: 'ProjectV2Item',                   model: 'ProjectV2Item', now: `${JSON_ONLY} (2 つのクエリだけが取る)` },
    { parent: 'Issue',         relation: 'comments',        type: 'IssueComment',                    model: 'IssueComment',  now: `${JSON_ONLY} (1 つのクエリだけが取る)` },
    { parent: 'IssueComment',  relation: 'author / editor', type: 'User / Bot ほか',                 model: '都度判断',      now: JSON_ONLY },
    { parent: 'IssueComment',  relation: 'pullRequest',     type: 'PullRequest',                     model: 'PullRequest',   now: `${JSON_ONLY} (4 項目だけ)` },
    { parent: 'ProjectV2',     relation: 'creator',         type: 'User / Bot ほか',                 model: '都度判断',      now: JSON_ONLY },
    { parent: 'ProjectV2',     relation: 'owner',           type: 'User / Organization',             model: '都度判断',      now: JSON_ONLY },
    { parent: 'ProjectV2',     relation: 'items',           type: 'ProjectV2Item',                   model: 'ProjectV2Item', now: `${JSON_ONLY} (team のクエリだけが取る)` },
    { parent: 'ProjectV2Item', relation: 'project',         type: 'ProjectV2',                       model: 'ProjectV2',     now: `${JSON_ONLY} (4 項目と owner だけ)` },
    { parent: 'ProjectV2Item', relation: 'content',         type: 'Issue / PullRequest / DraftIssue', model: '都度判断',     now: `${JSON_ONLY} (本文が無い)` },
    { parent: 'ProjectV2Item', relation: 'creator',         type: 'User / Bot ほか',                 model: '都度判断',      now: JSON_ONLY },
    { parent: 'ProjectV2Item', relation: 'fieldValues の users', type: 'User',                       model: 'User',          now: JSON_ONLY },
    { parent: 'ProjectV2Item', relation: 'fieldValues の labels / milestone / repository / pullRequests / reviewers', type: 'それぞれの型', model: 'それぞれのモデル', now: `${JSON_ONLY} (項目が少ない)` },
];

// 値が消える動きの例。(にせの node を Pool に入れて、実際に動かして確かめた)
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

export default function MatchmakerSpec () {
    return (
        <Section title="関連をモデルにする (Matchmaker の拡張)" num="7." lev="4" sx={SX_MEMBER_TITLE}>
          <Panel kind="warning">この章は、これから作るものの仕様です。まだ実装していません。</Panel>

          <Section title="ねらい" num="7.1" lev="5">
            <OL>
              <LI>GraphQL で取得した node に入れ子で付いてくる関連 (Issue の assignees など) を、すべてモデルにする。</LI>
              <LI>モデルにする仕事は、<C>Matchmaker</C> が受け持つ。</LI>
              <LI>いまの <C>Matchmaker</C> がモデルにしているのは、Repository の owner だけ。</LI>
            </OL>
          </Section>

          <Section title="いま取っている関連" num="7.2" lev="5">
            <Table columns={RELATION_COLUMNS} rows={RELATIONS} ids={TABLE_IDS}/>
          </Section>

          <Section title="先に解く問題" num="7.3" lev="5">
            <P>いまの Pool は、同じ id の node が来ると、core を丸ごと差し替えます。</P>
            <P>入れ子の node は項目が少ないので、差し替えると、いまあるモデルの値が消えます。</P>
            <Plane sx={SX_PLANE}>{OVERWRITE_EXAMPLE}</Plane>
            <OL>
              <LI>1 つ目は、いまのコードでも起きる。(Repository の owner は、すでに User にしているため)</LI>
              <LI><C>Matchmaker</C> をすべての関連に広げると、すべてのモデルで起きる。</LI>
              <LI>そのため、関連を広げる前に、node の重ね方を決める。</LI>
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
              </OL>
            </Section>

            <Section title="reload 属性" num="(2)" lev="6">
              <OL>
                <LI><C>GraphQLNode</C> に、<C>reload</C> 属性を足す。</LI>
                <LI>GitHub 側の変更を重ねたとき (来たほうが新しいとき) に、そのときの日時を入れる。</LI>
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
                <LI>いまは、同じ型を取る項目の組が、何通りもある。(「5.3 型ごとの、項目の組」を見る)
                  <UL>
                    <LI>実装するときは、この項目の組をどう整理するかが、最初の作業になる。</LI>
                  </UL>
                </LI>
              </OL>
              <Table columns={UPDATED_AT_COLUMNS} rows={UPDATED_AT} ids={TABLE_IDS}/>
            </Section>

            <Section title="型が複数ある関連" num="(4)" lev="6">
              <OL>
                <LI>どのモデルにするかは、一律の決まりにしない。</LI>
                <LI>データの項目などの内容から、関連ごとに判断する。</LI>
                <LI>判断する関連は、次の 4 つ。
                  <UL>
                    <LI>作成者・編集者。(Issue の author、IssueComment の author と editor、ProjectV2 と ProjectV2Item の creator)</LI>
                    <LI>持ち主。(Repository の owner、ProjectV2 の owner)</LI>
                    <LI>ProjectV2Item の content。(Issue・PullRequest・DraftIssue)</LI>
                    <LI>ProjectV2Item の reviewers。(User・Team・Mannequin)</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

          </Section>

          <Section title="まだ決めていないこと" num="7.5" lev="5">

            <Section title="node の重ね方の細部" num="(1)" lev="6">
              <OL>
                <LI>重ねる単位。(案: 一番上の項目の単位で重ねる。入れ子の中身は、別のモデルとして重ねる)</LI>
                <LI>来た値が null のとき。(案: null で重ねる。来ていない項目は、触らない)</LI>
                <LI>型の名前 (<C>__typename</C>) を、クエリで取るか。(型が複数ある関連の判断のときに決める)</LI>
              </OL>
            </Section>

            <Section title="対象の範囲" num="(2)" lev="6">
              <OL>
                <LI>Pool を新しく作るモデル。(Label と Milestone は要る。Organization・Team・DraftIssue はどうするか)</LI>
                <LI><C>User</C>・<C>Viewer</C>・<C>Assignee</C> を、1 つにまとめるか。</LI>
                <LI>Projects (classic) を、対象から外すか。</LI>
                <LI>ProjectV2Item の fieldValues を、モデルにするか。</LI>
              </OL>
            </Section>

            <Section title="読み方" num="(3)" lev="6">
              <OL>
                <LI><C>issue.assignees()</C> などの戻り値を、JSON からモデルに変えるか。(変えると、<C>a.login</C> で読んでいる利用側が壊れる)</LI>
                <LI>親の core に、入れ子の JSON を残すか。</LI>
              </OL>
            </Section>

            <Section title="関連の完全さ" num="(4)" lev="6">
              <OL>
                <LI>件数の上限で切れた関連を、どう見せるか。(assignees は 10 件まで)</LI>
                <LI>逆向きの関連を持つか。(Repository から Issue、ProjectV2 から Item)</LI>
                <LI>関連が一周する場合の扱い。(Issue → Item → content → Issue)</LI>
              </OL>
            </Section>

            <Section title="実装の前に確かめること" num="(5)" lev="6">
              <OL>
                <LI><C>updatedAt</C> が、どの変更で動くか。
                  <UL>
                    <LI>GitHub のリファレンスには「最後に更新された日時」としか書かれていない。</LI>
                    <LI>例: Issue にラベルを付けたとき、プロジェクトに足したときに、Issue の <C>updatedAt</C> が動くか。</LI>
                    <LI>動かない変更があると、その変更は、取り直しても反映されない。</LI>
                  </UL>
                </LI>
              </OL>
            </Section>

          </Section>
        </Section>
    );
}
