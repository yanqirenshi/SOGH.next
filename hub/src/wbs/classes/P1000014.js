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
            <P>README に書いていない属性は、初めの値のまま。(priority()・readmeOwner()・type()・release() は '?'、action() などの文字列は ''、systems() は []。null では上書きしない。0.5.0 から。yanqirenshi/SOGH.next#90) 取り直しで README から属性が消えたときも、初めの値に戻る。</P>
            <Plane>{README_EXAMPLE}</Plane>
            <P>node2projectV2(node) は、Pool に入れる前に、Matchmaker の projectV2(node) で、入れ子で来た creator・owner・items もモデルにして Pool に入れる。</P>
            <P>アイテムは、items() で ProjectV2Item のモデルの配列を得る。(ProjectV2 の中身に入っているアイテム)</P>
            <P>itemsInPool() は、items() と、別に取って Pool に入ったアイテム (core の project の id が、この ProjectV2 のもの) を合わせて返す。並び順は、items() のあとに、Pool に入った順。同じアイテムは 1 回だけ。取得はしない。(0.5.0 から。ProjectsV2 の部品の Item の表が読む。yanqirenshi/SOGH.next#102)</P>
            <P>items() と同じものを返していた古い名前 itemsWith2ProjectV2Item() は、0.5.0 で消した。(yanqirenshi/SOGH.next#104)</P>
            <P>creator() は、作った人を、__typename に合うモデル (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか) で返す。</P>
            <P>owner() は、GitHub の owner (持ち主) を、User・Organization・Issue・PullRequest のどれかのモデルで返す。(Repository の owner() と同じ意味。0.5.0 から。yanqirenshi/SOGH.next#71)</P>
            <P>README の $Owner の値 (文字列) は、readmeOwner(v) で読み書きする。(0.5.0 で、owner(v) から名前を変えた。README に $Owner が無いときは '?')</P>
            <P>readmeOwner(v) と同じ値を読み書きしていた maneger(v) は、0.5.0 で消した。(yanqirenshi/SOGH.next#86)</P>
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
