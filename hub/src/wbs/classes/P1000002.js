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
            <P>{"asyncFetch… は、取得に失敗したときに、例外 GitHubError を投げる。(0.5.0 から。それまでは、エラーをそのまま返すか、それまでに取得した id の配列を返していた。yanqirenshi/SOGH.next#61)"}</P>
            <P>{"コールバックを受け取る asyncFetch… は、失敗したとき、failed(error, …) を呼んでから投げる。(コメントの追加・更新・削除は、例外を投げず、failed を呼ぶ)"}</P>
            <P>{"asyncUpdateIssueBody(id, body) は、Issue の本文だけを書き換え、Issue の id を返す。(asyncFetchIssueByID と同じ。モデルは issue(id) で Pool から引く。Promise の形。失敗したときは GitHubError を投げる。0.5.0 から。yanqirenshi/SOGH.next#119)"}</P>
            <P>{"asyncUpdateIssueBody の戻りの Issue は projectItems を持たないが、Pool の Issue に重なるのは来た項目だけなので、Pool の Issue の projectItems は消えない。"}</P>
            <P>{"deleteIssueComment は、GitHub でコメントを消せたら、issue-comment の Pool からも消してから、successed を呼ぶ。(Pool の remove(id) を使う。0.5.0 から。yanqirenshi/SOGH.next#69)"}</P>
            <P>{"_queries の値は、クエリの定義 { query, pick }。query(code) はクエリの文字列を、queryDefinition(code) は定義を返す。クエリの値は、GraphQL の variables で渡す。(yanqirenshi/SOGH.next#63・yanqirenshi/SOGH.next#65)"}</P>
            <P>{"asyncFetch… は、取得の部品 fetchNode(code, variables) (1 回送り、pick で取り出す)・fetchPages(code, variables, onPage, connectionOf) (最後のページまで取る)・connection2ids(connection, make) (一覧をモデルにして id の配列にする) で組み立てる。team の 2 つは、fetchProjectsV2OfTeam(code, team_id, callbacks) を使う。"}</P>
            <P>{"asyncFetchProjectV2ItemsByUserLoginProjectV2Number・ByOrg〜 は、最後のページまで取り終えたら、その ProjectV2 の Item のうち、今回取れなかったものを、Pooler の removeProjectV2ItemsExcept(project_id, ids) で Pool から消す。(途中で失敗したときは消さない。中身の Issue などは残す。0.5.0 から。yanqirenshi/SOGH.next#108)"}</P>
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
