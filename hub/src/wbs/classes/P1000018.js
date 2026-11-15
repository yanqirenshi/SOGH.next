import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Repository のページ
//   src/js/models/Repository.js
//   extends GraphQLNode
const CLASS = 'Repository';

export default function P1000018 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Repository)
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
            <P>{"GitHub のリポジトリを 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した Repository のノード (core) を包み、名前・URL・説明・持ち主・最後に push された日時を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Sogh の node2repository(node) が作り、Pool に入れる。(asyncFetchRepositoriesByViewer() などで取得したとき)"}</P>
            <P>{"node2repository(node) は、Matchmaker を通して、持ち主 (owner) のノードも node2user(node) で User の Pool に入れる。"}</P>
            <P>{"持ち主が組織のときも、User として入る。"}</P>
            <P>{"同じ id の User が既にあると、その core が owner のノードに差し替わるので、owner のノードに無い name・email・company は null になる。"}</P>
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
