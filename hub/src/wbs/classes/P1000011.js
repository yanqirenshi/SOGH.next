import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Label のページ
//   src/js/models/Label.js
//   extends GraphQLNode
const CLASS = 'Label';

export default function P1000011 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Label)
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
const CODE = "const label = new Label({ id: 'LA_kwDOABCD', name: 'bug', color: 'd73a4a' });\n\nlabel.fontColor('#' + label.color());\n// => \"white\"";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"Issue などに付けるラベルを 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した Label のノード (core) を包み、名前・色・URL・説明を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Pooler には Label を作るメソッドも Pool も無いので、使うときは new Label(node) で作る。"}</P>
            <P>{"Issue の labels() や ProjectV2Item の labels() は、Label ではなく、ノードのまま返す。"}</P>
            <P>{"fontColor(hexcolor) は core を使わないので、データの無い Label でも呼べる。(SOGH のラベルの部品は、new Label() で文字の色を決めている)"}</P>
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
