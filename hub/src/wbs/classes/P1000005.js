import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Assignee のページ
//   src/js/models/Assignee.js
//   extends GraphQLNode
const CLASS = 'Assignee';

export default function P1000005 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Assignee)
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
            <P>{"Issue などの担当者 (assignee) になれるユーザーを表すモデル。"}</P>
            <P>{"GraphQL で取得したユーザーのノード (core) を包み、login・名前・メールアドレス・URL・会社を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"メソッドは、User から avatarUrl() を除いたものと同じ。"}</P>
            <P>{"Pooler には Assignee を作るメソッドも Pool も無いので、使うときは new Assignee(node) で作る。"}</P>
            <P>{"Issue の assignees() や ProjectV2Item の assignees() は、Assignee ではなく、ノードのまま返す。"}</P>
            <P>{"どのメソッドも「core の値 || null」を返すので、空文字 ('') も null になる。"}</P>
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
