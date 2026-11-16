import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Issue のページ
//   src/js/models/Issue.js
//   extends GraphQLNode
const CLASS = 'Issue';

export default function P1000009 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Issue)
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
const CODE = "$Owner octocat\n$Point.Plan 3\n$Point.Result 2\n$Date.Due 2026-11-30\n$Date.Next 2026-11-20";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GitHub の Issue を表すモデル。"}</P>
            <P>{"GraphQL で取得した Issue のノード (core) を包み、番号・タイトル・URL・本文・担当者・ラベルなどを読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Sogh の node2issue(node) が作り、Pool に入れる。(asyncFetchIssueByID() や asyncFetchIssueByOrgRepoIssueNumber() などで取得したとき)"}</P>
            <P>{"node2issue(node) は、Pool に入れる前に、Matchmaker の issue(node) で、入れ子で来た関連 (assignees・author・labels・milestone・repository・projectItems・comments) もモデルにして Pool に入れる。"}</P>
            <P>{"関連を返すメソッド (assignees()・author()・labels()・milestone()・repository()・comments()・projectV2Items()・projectsV2() など) は、core の JSON の id で Pool からモデルを引いて返す。(無いときは null か [])"}</P>
            <P>{"ProjectV2 のフィールドの値を読むメソッド (fieldItem()・fieldValueContents(name)・fieldValues()・getFieldValueByName(name)) は、モデルにせず、JSON のまま返す。"}</P>
            <P>{"本文に書いた注釈 ($Owner・$Point.Plan・$Point.Result・$Date.Due・$Date.Next) を読み出して持ち、core や本文を差し替えると読み直す。"}</P>
            <P>{"期日 (dueDate(v)) と次のアクションの日 (nextActionDate(v)) は、本文の注釈ではなく、ProjectV2 のフィールド (Due.Date・NextAction.Date) から読む。"}</P>
            <P>{"ProjectV2 のアイテム (projectItems) を取得していないとき (asyncFetchIssueByID() で取得したときなど) も、フィールドの値を読むメソッドは落ちずに、fieldValues() は []、fieldItem()・getFieldValueByName(name)・fieldValueContents(name)・dueDate()・nextActionDate() は null を返す。(0.4.2 から。yanqirenshi/SOGH.next#59)"}</P>
            <P>{"Issue をプロジェクトに足す・外すときや、Item のフィールドの値を変えたとき、GitHub は Issue の updatedAt を動かさない。そのため、projectItems だけは、取り直したときに日時が同じでも、中身が違えば重ねる。(sameTimeKeys() が ['projectItems'] を返す。yanqirenshi/SOGH.next#51)"}</P>
            <P>{"Projects (classic) 用のメソッド (6 個) は、0.5.0 で消した。(Projects (classic) は GitHub で廃止されたため。yanqirenshi/SOGH.next#82)"}</P>
            <P>{"Issue を作るためのデータを作るメソッド (3 個) も、0.5.0 で消した。(使うクエリが、もう無いため。yanqirenshi/SOGH.next#83)"}</P>
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
