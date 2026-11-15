import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Matchmaker のページ
//   src/js/Matchmaker.js
const CLASS = 'Matchmaker';

export default function P1000004 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Matchmaker)
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
const CODE = "sogh.node2repository({\n    id: 'R_kgDOAB', name: 'docs',\n    owner: { id: 'O_kgDOAB', login: 'github', resourcePath: '/github' },\n});\n\nsogh.user('O_kgDOAB').login();\n// => \"github\"";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"ノードを Pool に入れるときに、そのノードに含まれる関係するノードも Pool に入れるためのクラス。"}</P>
            <P>{"Pooler の constructor が new Matchmaker(this) で作り、matchmaker に入れる。"}</P>
            <P>{"Pooler の node2repository(node) が repository(node) を、node2user(node) が user(node) を呼ぶ。"}</P>
            <P>{"repository(node) は、リポジトリの owner を User の Pool に入れる。"}</P>
            <P>{"user(node) は、今は何もしない。"}</P>
            <P>{"owner は組織 (Organization) のときも User として入り、同じ id の User があるときはその core に owner のノードを重ねる。"}</P>
            <P>{"重ねるだけなので、Sogh の connect(token, successed, failed) で viewer にした User の name()・email() などは、自分のリポジトリを取得しても残る。"}</P>
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
