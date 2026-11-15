import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Project のページ
//   src/js/models/Project.js
//   extends GraphQLNode
//   Projects (classic) 用のクラス。GitHub では廃止。
const CLASS = 'Project';

export default function P1000013 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Project)
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
const CODE = "@Type: 障害\n@Priority: h\n@assignee: octocat\n@Plan: 2026-11-01, 2026-11-30\n@Result: 2026-11-03, 2026-11-28";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GitHub の Projects (classic) の、1 つのプロジェクトを表すモデル。"}</P>
            <P>{"Projects (classic) は GitHub で廃止されたので、このクラスも廃止予定。"}</P>
            <P>{"GraphQL で取得した Project のノード (core) を包み、番号・名前・URL・状態・列などを読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"constructor が本文 (body) の「@名前: 値」の行から、種類・優先度・担当者・予定と実績の期間を読み出して持つ。"}</P>
            <P>{"core(v) で core を差し替えても、本文の値は読み直さない。"}</P>
            <P>{"今の Sogh には Project の Pool が無く、このクラスを作るところも無い。(パッケージからは export されている)"}</P>
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
