import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Milestone のページ
//   src/js/models/Milestone.js
//   extends GraphQLNode
const CLASS = 'Milestone';

export default function P1000012 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Milestone)
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

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"リポジトリのマイルストーンを 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した Milestone のノード (core) を包み、タイトル・番号・状態・説明・期限などを読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Pooler には Milestone を作るメソッドも Pool も無いので、使うときは new Milestone(node) で作る。"}</P>
            <P>{"Issue の milestone() や ProjectV2Item の milestone() は、Milestone ではなく、ノードのまま返す。"}</P>
            <P>{"ProjectV2Item のクエリが使う attributes.js の milestone() は description・closedAt を取得しないので、そのノードで作った Milestone では description()・closedAt() が null になる。"}</P>
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
