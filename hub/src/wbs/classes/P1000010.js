import React from 'react';

import { Section, P } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス IssueComment のページ
//   src/js/models/IssueComment.js
//   extends GraphQLNode
const CLASS = 'IssueComment';

export default function P1000010 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の IssueComment)
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
            <P>{"Issue のコメントを 1 つ表すモデル。"}</P>
            <P>{"GraphQL で取得した IssueComment のノード (core) を包み、本文・URL・公開した日時・書いた人を読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Sogh の node2issueComment(node) が作り、Pool に入れる。(asyncFetchIssueCommentsByID(id) で取得したときや、createIssueComment()・updateIssueComment() の結果)"}</P>
            <P>{"node2issueComment(node) は、Pool に入れる前に、Matchmaker の issueComment(node) で、入れ子で来た author・editor・pullRequest もモデルにして Pool に入れる。"}</P>
            <P>{"author()・editor() は、書いた人・編集した人を、__typename に合うモデル (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか) で返す。"}</P>
            <P>{"pullRequest() は、コメントが付いている Pull request を、PullRequest のモデルで返す。"}</P>
            <P>{"どれも、core の JSON の id で Pool からモデルを引く。(無いときは null)"}</P>
            <P>{"本文が空 ('') のとき、body() は null を返す。(PullRequest の body() は '' を返す)"}</P>
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
