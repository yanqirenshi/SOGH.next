import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス ProjectV2Item のページ
//   src/js/models/ProjectV2Item.js
//   extends GraphQLNode
const CLASS = 'ProjectV2Item';

export default function P1000015 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の ProjectV2Item)
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
const CODE = "'Title'                → title()\n'Status'               → status()\n'Assignees'            → assignees()\n'Labels'               → labels()\n'Linked pull requests' → linkedPullRequests()\n'Reviewers'            → reviewers()\n'Repository'           → repository()\n'Milestone'            → milestone()\n'Archived'             → archived()\n'Plan.Start'           → planStart()\n'Plan.End'             → planEnd()\n'Plan.Points'          → planPoints()\n'Result.Points'        → resultPoints()\n'NextAction.Date'      → nextActionDate()\n'Due.Date'             → dueDate()";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GitHub の Projects (ProjectV2) の、1 つのアイテム (Issue・Pull request・Draft issue) を表すモデル。"}</P>
            <P>{"GraphQL で取得した ProjectV2Item のノード (core) を包み、フィールドの値・入っているプロジェクト・中身 (content) などを読む。"}</P>
            <P>{"GraphQLNode を継承する。"}</P>
            <P>{"Sogh の node2projectV2Item(node) が作り、Pool に入れる。(asyncFetchProjectV2ItemByID(id) や、ProjectV2 の itemsWith2ProjectV2Item() など)"}</P>
            <P>{"フィールドの値は、フィールドの名前で fieldValues() から探して読む。(getFieldValueByName(name))"}</P>
            <P>{"値が無いときは null (配列を返すメソッドは []) を返すが、同じ名前で種類の違うフィールド (例: テキストの Archived) のときは undefined を返す。"}</P>
            <P>{"path() と projectPath() は Sogh の href(to, data) を使うので、Sogh を持っていないとき (Pool を通さずに作ったとき) はエラーになる。"}</P>
            <P>{"読むフィールドの名前と、メソッドは次のとおり。"}</P>
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
