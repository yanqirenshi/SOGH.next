import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Team のページ
//   src/js/models/Team.js
//   extends GraphQLNode
const CLASS = 'Team';

export default function P1000027 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Team)
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
            <P>{"Organization の Team を 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した Team のノード (core) を包み、slug を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Pooler の node2team(node) が作り、team の Pool に入れる。"}</P>
            <P>{"Matchmaker が、ProjectV2Item の Reviewers フィールドの値のうち __typename が Team のものを、node2model(node) で Team にする。"}</P>
            <P>{"ProjectV2Item の reviewers() は、レビューするのが Team のときに Team を返す。"}</P>
            <P>{"クエリは Team の name と avatarUrl を取得しない。(User と型が違うため。attributes.js の teamRef())"}</P>
            <P>{"slug() は「core の値 || null」を返すので、空文字 ('') も null になる。"}</P>
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
