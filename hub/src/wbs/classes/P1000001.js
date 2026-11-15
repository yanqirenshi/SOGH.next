import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Pooler のページ
//   src/js/Pooler.js
//   extends Loader
const CLASS = 'Pooler';

export default function P1000001 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Pooler)
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
const CODE = "const sogh = new Sogh();\n\nconst issue = sogh.node2issue({ id: 'I_kwDOAB', number: 1, title: 'Found a bug' });\n\nsogh.issue('I_kwDOAB') === issue;\n// => true\nsogh.get('I_kwDOAB') === issue;\n// => true\nsogh.pool('issue').list().length;\n// => 1";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GraphQL で取得したノードを、モデル (Repository・User・Issue など) のオブジェクトにして、種類ごとの Pool に入れて持つクラス。"}</P>
            <P>{"Loader を継承し、Sogh が Pooler を継承する。(Loader → Pooler → Sogh)"}</P>
            <P>{"constructor が、種類のコード (repository・user・project-v2・project-v2-item・issue・issue-comment・pull-request・organization・bot・mannequin・enterprise-user-account・draft-issue・team・label・milestone) ごとに Pool を 1 つずつ作り、_pools に入れる。(15 の Pool)"}</P>
            <P>{"node2〜(node) は、ノードをオブジェクトにして Pool に入れて返す。(同じ id のものがあるときは、新しく作らず、その core にノードを重ねる)"}</P>
            <P>{"repository(v)・issue(v) などは id で 1 つを、repositories(v)・issues(v) などは Pool のすべてを返し、get(id) はすべての Pool から id で探す。"}</P>
            <P>{"node2model(node) は、型が複数ありうる関連のノードを、__typename に合う node2〜(node) でモデルにする。(人は User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか)"}</P>
            <P>{"Matchmaker (matchmaker) を持ち、node2repository(node)・node2issue(node)・node2projectV2Item(node) などで、親を Pool に入れる前に、入れ子で来た関連 (リポジトリの owner、Issue の assignees など) もモデルにして Pool に入れる。"}</P>
            <P>{"node2viewer(d) は、viewer を User にして user の Pool に入れる。(viewer の Pool は無い)"}</P>
            <P>{"Sogh の fetch〜・asyncFetch〜 が、取得したノードを node2〜(node) に渡す。"}</P>
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
