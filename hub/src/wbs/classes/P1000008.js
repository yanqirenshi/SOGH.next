import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス GraphQLNode のページ
//   src/js/models/GraphQLNode.js
const CLASS = 'GraphQLNode';

export default function P1000008 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の GraphQLNode)
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
const CODE = "const graphQLNode = new GraphQLNode({ id: 'MDQ6VXNlcjU4MzIzMQ==', createdAt: '2011-01-25T18:44:36Z' });\n\ngraphQLNode.id();\n// => \"MDQ6VXNlcjU4MzIzMQ==\"\ngraphQLNode.updatedAt();\n// => null";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GraphQL で取得したノードを包む、モデルの基底クラス。"}</P>
            <P>{"ノード (core) を _core に、モデルを持っている Sogh を _sogh に持つ。"}</P>
            <P>{"id()・createdAt()・updatedAt() で、どのノードにもある値を読む。"}</P>
            <P>{"Repository・User・Viewer・ProjectV2・ProjectV2Item・Issue・IssueComment・PullRequest・Label・Milestone・Assignee などが継承する。"}</P>
            <P>{"Pool は、モデルを Pool に入れるときに sogh(v) で Sogh を入れ、同じ id のノードを取得し直したときに core(v) でノードを差し替える。"}</P>
            <P>{"値を読むメソッドは「core の値 || null」を返すので、空文字 ('') なども null になる。"}</P>
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
