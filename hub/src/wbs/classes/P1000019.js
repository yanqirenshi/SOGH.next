import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Term のページ
//   src/js/models/Term.js
const CLASS = 'Term';

export default function P1000019 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Term)
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
const CODE = "new Term('2026-11-01', '2026-11-30');\n// => Term { start: \"2026-11-01\", end: \"2026-11-30\" }\n\nnew Term('2026-11-03');\n// => Term { start: \"2026-11-03\", end: null }";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"期間 (開始と終了) を表す、小さなクラス。"}</P>
            <P>{"GraphQLNode を継承しない。(ノードを包まない)"}</P>
            <P>{"constructor(start, end) が start と end を入れ、falsy な値 (undefined・''・0 など) は null にする。"}</P>
            <P>{"メソッドは無く、start・end を直接読む。"}</P>
            <P>{"ProjectV2 が、README の $Plan・$Result の期間を Term で持つ。(plan(start, end)・result(start, end))"}</P>
            <P>{"ProjectV2Item の planTerm() は、Term ではなく、ただのオブジェクト { start, end } を返す。"}</P>
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
