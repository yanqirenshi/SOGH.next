import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Viewer のページ
//   src/js/models/Viewer.js
//   extends GraphQLNode
const CLASS = 'Viewer';

export default function P1000021 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Viewer)
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
            <P>{"ログインしているユーザー (GraphQL の viewer) を表すモデル。"}</P>
            <P>{"GraphQL で取得した viewer のノード (core) を包み、login・名前・URL を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Pooler の node2viewer(d) が作り、Pool には入れずに viewer() として持つ。(asyncFetchViewer() で取得したとき)"}</P>
            <P>{"Pool を通さないので、sogh() は null のまま。"}</P>
            <P>{"connect(token, successed, failed) で取得したときは、Viewer ではなく User が viewer() に入る。"}</P>
            <P>{"クエリ viwer は avatarUrl・email なども取得するが、Viewer にはそれを読むメソッドが無い。(core() から読む)"}</P>
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
