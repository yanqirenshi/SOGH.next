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
            <P>{"ProjectV2 のアイテム (projectItems) を取得していないとき (asyncFetchIssueByID() で取得したときなど) は、fieldValues() などのメソッドがエラーになる。(fieldItem() と fieldValueContents(name) は null を返す)"}</P>
            <P>{"Projects (classic) 用のメソッド (projectCards() など) も残っているが、Projects (classic) は GitHub で廃止された。"}</P>
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
