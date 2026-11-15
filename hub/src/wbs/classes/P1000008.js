import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス GraphQLNode のページ
//   src/js/models/GraphQLNode.js
const CLASS = 'GraphQLNode';

export default function P1000008 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の GraphQLNode)
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
const CODE = "const graphQLNode = new GraphQLNode({ id: 'MDQ6VXNlcjU4MzIzMQ==', createdAt: '2011-01-25T18:44:36Z' });\n\ngraphQLNode.id();\n// => \"MDQ6VXNlcjU4MzIzMQ==\"\ngraphQLNode.updatedAt();\n// => null";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GraphQL で取得したノードを包む、モデルの基底クラス。"}</P>
            <P>{"ノード (core) を _core に、モデルを持っている Sogh を _sogh に持つ。"}</P>
            <P>{"id()・createdAt()・updatedAt() で、どのノードにもある値を読む。"}</P>
            <P>{"Repository・User・Organization・Bot・Mannequin・EnterpriseUserAccount・Team・ProjectV2・ProjectV2Item・DraftIssue・Issue・IssueComment・PullRequest・Label・Milestone などが継承する。"}</P>
            <P>{"relation(node)・relations(connection) は、core に入れ子で残っている関連の JSON の id で、Pool からモデルを引く。(Pool に無いとき・JSON が無いときは、null か空の配列)"}</P>
            <P>{"関連を返すメソッド (Issue の assignees()・Repository の owner() など) は、これを使う。"}</P>
            <P>{"同じファイルの nodesOf(connection) は、関連の JSON ({ nodes: [...] } か { edges: [{ node }] }) から node の配列を取り出す関数で、Matchmaker も使う。"}</P>
            <P>{"Pool は、モデルを Pool に入れるときに sogh(v) で Sogh を入れ、同じ id のノードを取得し直したときに merge(node) でノードを重ねる。"}</P>
            <P>{"merge(node) は、core をまるごと差し替えずに、最終更新日時 (updatedAt) を比べて、来た項目を重ねる。(来たノードのほうが新しいときは来た項目を重ね、そうでないときは手元に無い項目だけを足す)"}</P>
            <P>{"来たノードのほうが新しくて重ねたときは、そのときの日時を _reload に入れる。(reload(v) で読む)"}</P>
            <P>{"Pool は、入れ子で来たノードで、初めてモデルを作ったときにも、_reload に日時を入れる。"}</P>
            <P>{"_reload は、「同じ日時のノードが来たら、重ねてよい」という印。入っているあいだは、merge(node) が、日時が同じノードでも、来た項目を重ねる。(項目の少ないノードが、先に updatedAt だけを進めていることがあるため)"}</P>
            <P>{"値を読むメソッドは「core の値 || null」を返すので、空文字 ('') なども null になる。"}</P>
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
