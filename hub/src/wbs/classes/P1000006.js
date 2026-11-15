import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Card のページ
//   src/js/models/Card.js
//   Projects (classic) 用のクラス。GitHub では廃止。
const CLASS = 'Card';

export default function P1000006 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Card)
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
            <P>{"GitHub の Projects (classic) のカード (Project card) のための、空のクラス。"}</P>
            <P>{"メソッドも属性も無く、GraphQLNode も継承していない。(ファイルのコメントに、id・url・note・state・isArchived・column の項目が書いてあるだけ)"}</P>
            <P>{"Projects (classic) は GitHub で廃止されたので、このクラスも廃止予定。"}</P>
            <P>{"Issue のカードは、このクラスにせず、ノードのまま projectCards() で読む。"}</P>
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
