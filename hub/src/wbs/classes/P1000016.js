import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス PullRequest のページ
//   src/js/models/PullRequest.js
//   extends GraphQLNode
const CLASS = 'PullRequest';

export default function P1000016 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の PullRequest)
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
            <P>{"Pull request を 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した PullRequest のノード (core) を包み、タイトル・番号・本文・リポジトリ・作者・担当者を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Pooler の node2pullRequest(node) が作り、Pool に入れる。"}</P>
            <P>{"今の Sogh の取得メソッドには、node2pullRequest(node) を呼ぶものは無い。"}</P>
            <P>{"body()・bodyHTML() は、ほかのモデルと違い、無いときに null ではなく '' を返す。"}</P>
            <P>{"assignees() は core の assignees.edges を読むので、取得していないときはエラーになる。"}</P>
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
