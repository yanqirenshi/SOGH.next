import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Bot のページ
//   src/js/models/Bot.js
//   extends GraphQLNode
const CLASS = 'Bot';

export default function P1000023 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Bot)
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
            <P>{"GitHub の Bot (GitHub App の代わりに動く人) を 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した Bot のノード (core) を包み、login・URL・アバター画像の URL・ページのパスを読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Pooler の node2bot(node) が作り、bot の Pool に入れる。"}</P>
            <P>{"Matchmaker が、入れ子で来た人のうち __typename が Bot のもの (Issue の author・IssueComment の editor・ProjectV2Item の reviewers など) を、node2model(node) で Bot にする。"}</P>
            <P>{"node2bot(node) は Matchmaker を呼ばないので、Bot の入れ子の関連はモデルにしない。"}</P>
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
