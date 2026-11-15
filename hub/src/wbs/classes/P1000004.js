import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Matchmaker のページ
//   src/js/Matchmaker.js
const CLASS = 'Matchmaker';

export default function P1000004 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Matchmaker)
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
const CODE = "const issue = sogh.node2issue({\n    __typename: 'Issue', id: 'I_kwDOAB',\n    author: { __typename: 'Bot', id: 'BOT_kgDOAB', login: 'dependabot' },\n    assignees: { nodes: [{ __typename: 'User', id: 'U_kgDOAB', login: 'octocat' }] },\n});\n\nissue.author() === sogh.bot('BOT_kgDOAB');\n// => true\nissue.assignees()[0] === sogh.user('U_kgDOAB');\n// => true\nissue.core().assignees.nodes[0].login;   // core には JSON が残る\n// => \"octocat\"";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"ノードを Pool に入れるときに、そのノードに入れ子で来た関連のノードも、モデルにして Pool に入れるためのクラス。"}</P>
            <P>{"Pooler の constructor が new Matchmaker(this) で作り、matchmaker に入れる。"}</P>
            <P>{"Pooler の node2〜(node) が、親を Pool に入れる前に、親の型のメソッド (repository(node)・user(node)・issue(node)・issueComment(node)・pullRequest(node)・projectV2(node)・projectV2Item(node)) を呼ぶ。"}</P>
            <P>{"型が 1 つに決まっている関連は、その型の node2〜(node) でモデルにする。(Issue の labels は node2label(node) など)"}</P>
            <P>{"型が複数ありうる関連 (人・ProjectV2 の owner・ProjectV2Item の content・reviewers) は、model(node) で、__typename に合うモデルにする。"}</P>
            <P>{"人は、__typename で User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれかになる。(リポジトリの owner が組織のときは Organization)"}</P>
            <P>{"入れ子の node も node2〜(node) を通るので、そこからさらに中の関連も辿る。"}</P>
            <P>{"入れ子の node を辿っているあいだは、isNesting() が true を返す。(one(node, node2obj) と model(node) が、nest(fn) の中で、node を Pool に入れる)"}</P>
            <P>{"Pool は、入れ子で来た node で、初めてモデルを作ったときに、モデルの reload に日時を入れる。(入れ子の node は項目が少ないので、同じ日時の node があとから来たら、重ねられるようにするため)"}</P>
            <P>{"親の core には、入れ子の JSON をそのまま残す。関連を返すメソッド (issue.assignees() など) は、JSON の id で Pool からモデルを引く。(GraphQLNode の relation(node)・relations(connection))"}</P>
            <P>{"件数の上限で切れた関連は、取れた分だけをモデルにする。"}</P>
            <P>{"逆向きの関連 (User から、その人の Issue など) は持たない。"}</P>
            <P>{"一周する関連 (Issue → ProjectV2Item → ProjectV2 → owner の Issue など) は、特別に扱わない。(JSON は木なので、辿りは必ず終わる)"}</P>
            <P>{"ProjectV2Item の fieldValues の箱と、箱に付いている creator はモデルにしない。PullRequest の関連は、assignees だけをモデルにする。"}</P>
            <P>{"同じ id のモデルがあるときは、core に node を重ねるだけなので、Sogh の connect(token, successed, failed) で viewer にした User の name()・email() などは、自分のリポジトリを取得しても残る。"}</P>
            <P>{"決まりの元は、GitHub の Issue yanqirenshi/SOGH.next#25〜30。"}</P>
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
