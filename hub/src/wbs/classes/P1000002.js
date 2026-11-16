import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Sogh のページ
//   src/js/Sogh.js
//   extends Pooler
const CLASS = 'Sogh';

export default function P1000002 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Sogh)
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
const CODE = "import Sogh from 'sogh';\n\nconst sogh = new Sogh();\nawait sogh.connect(token);\n\nconst ids = await sogh.asyncFetchProjectsV2ByViewer();\nconst projectV2 = sogh.projectV2(ids[0]);\n\nprojectV2.title();\n// => \"SOGH の整理\"";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GitHub の GraphQL API からデータを取得し、モデルにして持つ、SOGH の入り口のクラス。"}</P>
            <P>{"Pooler を継承し、Pooler は Loader を継承する。(Loader が token・viewer と GraphQL への送信を、Pooler が種類ごとの Pool とモデルへの変換を受け持つ)"}</P>
            <P>{"Sogh は、クエリの表 (_queries)・画面のパスの表 (_routes)・メンバー (_members) と、取得・更新のメソッドを足す。"}</P>
            <P>{"new Sogh() で作り、connect(token, successed, failed) で token を入れて viewer を取得してから使う。"}</P>
            <P>{"取得のメソッドは、GraphQL のノードを Issue・ProjectV2 などのモデルにして Pool に入れ、モデルではなく id を返す。(モデルは issue(id)・projectV2(id) などで Pool から引く)"}</P>
            <P>{"取得のメソッドは、Promise で id を返す asyncFetch… の形だけ。(コールバックで結果を渡す fetch… の形は、0.5.0 で消した)"}</P>
            <P>{"asyncFetch… は、取得に失敗しても reject しない。(エラーをそのまま返すか、それまでに取得した id の配列を返す)"}</P>
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
