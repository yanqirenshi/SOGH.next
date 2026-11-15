import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Relationship のページ
//   src/js/models/Relationship.js
//   extends GraphQLNode
const CLASS = 'Relationship';

export default function P1000017 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Relationship)
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
            <P>{"GraphQLNode を継承し、メソッド a() と b() があるだけのクラス。"}</P>
            <P>{"a() と b() は中身が空で、何もせずに undefined を返す。"}</P>
            <P>{"constructor は書いていない (コメントになっている) ので、GraphQLNode の constructor をそのまま使う。"}</P>
            <P>{"id()・createdAt()・updatedAt() など、GraphQLNode のメソッドは使える。"}</P>
            <P>{"models/index.js から export されておらず、Sogh や Pool からも使われていない。"}</P>
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
