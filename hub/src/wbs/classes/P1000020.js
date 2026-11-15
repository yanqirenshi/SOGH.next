import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス User のページ
//   src/js/models/User.js
//   extends GraphQLNode
const CLASS = 'User';

export default function P1000020 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の User)
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
            <P>{"GitHub のユーザーを 1 人表すモデル。"}</P>
            <P>{"GraphQL で取得した User のノード (core) を包み、login・名前・メールアドレス・URL・会社・アバター画像の URL を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Sogh の node2user(node) が作り、Pool に入れる。(connect(token, successed, failed) や fetchUserByID(id, success, fail) で取得したとき)"}</P>
            <P>{"ログインしているユーザー (viewer) も User にする。connect(token, successed, failed) でも asyncFetchViewer() でも、User にして user の Pool に入れ、viewer() に入れる。"}</P>
            <P>{"Matchmaker も、入れ子で来た担当者 (Issue の assignees など) は node2user(node) で、型が複数ありうる人 (author・リポジトリの持ち主 (owner) など) は __typename が User のときに node2model(node) で、User にする。"}</P>
            <P>{"人は、__typename で User・Organization・Bot・Mannequin・EnterpriseUserAccount に分かれる。持ち主が組織のときは User ではなく Organization になる。"}</P>
            <P>{"そのとき同じ id の User が既にあると、core に入れ子のノードが重なる。(重ねるだけなので、入れ子のノードに無い email・company などは残る)"}</P>
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
