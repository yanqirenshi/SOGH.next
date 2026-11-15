import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス ProjectV2 のページ
//   src/js/models/ProjectV2.js
//   extends GraphQLNode
const CLASS = 'ProjectV2';

export default function P1000014 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の ProjectV2)
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

// README に書く属性の例。
const README_EXAMPLE = [
    '$Priority: h',
    '$Owner: octocat',
    '$Type: 開発',
    '$Plan: 2026-11-01 2026-11-30',
    '$Result: 2026-11-03',
    '$Progress: 60',
].join('\n');

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>GitHub の Projects (ProjectV2) の、1 つのプロジェクトを表すモデル。</P>
            <P>GraphQL で取得した ProjectV2 のノード (core) を包み、番号・名前・URL・フィールド・アイテムなどを読む。</P>
            <P>GraphQLNode を継承する。</P>
            <P>Sogh の node2projectV2(node) が作り、Pool に入れる。(asyncFetchProjectsV2ByTeam() などで取得したとき)</P>
            <P>README に書いた「$名前: 値」の行から、プロジェクトを管理するための属性 (優先度・担当者・予定と実績の期間など) を読み出して持つ。</P>
            <P>core を差し替えると、README の属性を読み直す。</P>
            <Plane>{README_EXAMPLE}</Plane>
            <P>アイテムは、items() でノードを、itemsWith2ProjectV2Item() で ProjectV2Item を得る。</P>
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
