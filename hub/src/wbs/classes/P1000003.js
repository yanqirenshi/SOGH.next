import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Pool のページ
//   src/js/Pool.js
const CLASS = 'Pool';

export default function P1000003 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Pool)
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
const CODE = "const pool = sogh.pool('issue');\n\nconst issue = pool.ensure({ id: 'I_kwDOAB', title: 'Found a bug' }, d=> new Issue(d));\n\npool.get('I_kwDOAB') === issue;\n// => true\npool.list().length;\n// => 1";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"1 つの種類 (Repository・Issue など) のオブジェクトを、id で引けるように入れておく入れ物。"}</P>
            <P>{"Pooler の constructor が、種類ごとに new Pool(sogh, item_class) で 1 つずつ作り、Sogh からは pool(v) で取り出す。"}</P>
            <P>{"id → オブジェクト の表 (_ht) と、入れた順の配列 (_list) の 2 つで持つ。"}</P>
            <P>{"ensure(node, makeInstance, updater) は、同じ id のオブジェクトがあればそれを更新し、無ければ作って入れるので、同じ id のオブジェクトは 1 つだけになる。"}</P>
            <P>{"既にあるときは、updater が無ければ merge(node) で、core にノードを重ねる。(まるごと差し替えない)"}</P>
            <P>{"重ねるかどうかは、最終更新日時 (updatedAt) を比べて決める。(GraphQLNode の merge(node) を見る)"}</P>
            <P>{"入れ子で来たノードで、新しく作ったとき (isNesting() が true のとき) は、オブジェクトの reload(v) に、そのときの日時を入れる。"}</P>
            <P>{"ensure で返すオブジェクトには、sogh(v) で Sogh を入れる。"}</P>
            <P>{"remove(id) は、id のオブジェクトを、表と配列の両方から消して返す。(無ければ null。0.5.0 から。yanqirenshi/SOGH.next#69)"}</P>
            <P>{"clear() は、すべて消す。(0.5.0 から)"}</P>
            <P>{"期限で消す仕組みは無い。sogh が自分で消すのは、Sogh の asyncDeleteIssueComment で、コメントを GitHub から消せたときだけ。"}</P>
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
