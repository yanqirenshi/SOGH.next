import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス ProjectV2Item のページ
//   src/js/models/ProjectV2Item.js
//   extends GraphQLNode
const CLASS = 'ProjectV2Item';

export default function P1000015 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の ProjectV2Item)
    const data = useClassData(CLASS);

    return (
        <FrameClass wbs_node={props.wbs_node}
                    wbs_id={props.wbs_node.id}
                    name={CLASS}
                    overview={<Overview data={data}/>}
                    attributes={data.attributes}
                    behaviors={data.methods}/>
    );
}

// 概要に出すコードの例。
const CODE = "'Title'                → title()\n'Status'               → status()\n'Assignees'            → assignees()\n'Labels'               → labels()\n'Linked pull requests' → linkedPullRequests()\n'Reviewers'            → reviewers()\n'Repository'           → repository()\n'Milestone'            → milestone()\n'Archived'             → archived()\n'Plan.Start'           → planStart()\n'Plan.End'             → planEnd()\n'Plan.Points'          → planPoints()\n'Result.Points'        → resultPoints()\n'NextAction.Date'      → nextActionDate()\n'Due.Date'             → dueDate()";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GitHub の Projects (ProjectV2) の、1 つのアイテム (Issue・Pull request・Draft issue) を表すモデル。"}</P>
            <P>{"GraphQL で取得した ProjectV2Item のノード (core) を包み、フィールドの値・入っているプロジェクト・中身 (content) などを読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Sogh の node2projectV2Item(node) が作り、Pool に入れる。(asyncFetchProjectV2ItemByID(id) や、Matchmaker が ProjectV2 の items・Issue の projectItems を Pool に入れるときなど)"}</P>
            <P>{"node2projectV2Item(node) は、Pool に入れる前に、Matchmaker の projectV2Item(node) で、入れ子で来た project・content・creator と、フィールドの値の中の関連 (担当者・ラベル・マイルストーン・リポジトリ・Pull request・レビューする人) もモデルにして Pool に入れる。"}</P>
            <P>{"content の PullRequest は、state を別名 pullRequestState で取る。node2projectV2Item(node) は、Pool に入れる前に、content の pullRequestState を state に戻したノードにする。(元のノードは変えない。0.5.0 から。yanqirenshi/SOGH.next#68)"}</P>
            <P>{"そのため、core().content の PullRequest の state は、取り方によらず state の名前になる。(content() が返す PullRequest のモデルの core も、state)"}</P>
            <P>{"project()・content()・creator() と、関連のフィールドを読むメソッド (assignees()・labels()・milestone()・repository()・linkedPullRequests()・reviewers()) は、JSON の id で Pool からモデルを引いて返す。"}</P>
            <P>{"content() は Issue・PullRequest・DraftIssue のどれか、creator() は User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか、reviewers() の要素は User・Team・Mannequin・Bot のどれかのモデルになる。"}</P>
            <P>{"フィールドの値は、フィールドの名前で fieldValues() から探して読む。(getFieldValueByName(name))"}</P>
            <P>{"fieldValues を取得していないとき・nodes が配列でないときは、fieldValues() は [] を返し、getFieldValueByName(name) は null と field の無いノードを飛ばす。そのため、値を読むメソッドは null、関連を読むメソッドは [] を返し、落ちない。(0.5.0 から。Issue と同じ守り。yanqirenshi/SOGH.next#103)"}</P>
            <P>{"フィールドの値 (fieldValues() の箱) と、箱に付いている creator は、モデルにせず、JSON のまま返す。"}</P>
            <P>{"contentTypename()・projectNumber()・projectOwnerLogin()・projectPath() は、モデルではなく、core の JSON を読む。"}</P>
            <P>{"値が無いときは null (配列を返すメソッドは []) を返すが、同じ名前で種類の違うフィールド (例: テキストの Archived) のときは undefined を返す。(関連を返すメソッドは、そのときも null か [] を返す)"}</P>
            <P>{"path() と projectPath() は Sogh の href(to, data) を使うので、Sogh を持っていないとき (Pool を通さずに作ったとき) はエラーになる。"}</P>
            <P>{"読むフィールドの名前と、メソッドは次のとおり。"}</P>
            <Plane>{CODE}</Plane>
          </Section>

          <Section title="属性" lev="4" sx={SX_MEMBER_TITLE}>
            <AttributesTable data={data.attributes}/>
          </Section>

          <Section title="振舞" lev="4" sx={SX_MEMBER_TITLE}>
            <BehaviorsTable data={data.methods}/>
          </Section>
        </>
    );
}
