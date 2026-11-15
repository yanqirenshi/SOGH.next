import React from 'react';

import { Section, P, Plane } from 'tion';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import AttributesTable from '../../components/panels/FrameClass/AttributesTable.js';
import BehaviorsTable from '../../components/panels/FrameClass/BehaviorsTable.js';
import { SX_MEMBER_TITLE } from '../../components/panels/FrameClass/utils.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Loader のページ
//   src/js/Loader.js
const CLASS = 'Loader';

export default function P1000000 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Loader)
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
const CODE = "const sogh = new Sogh();\n\nsogh.token('ghp_xxxxxxxx');\n\nconst response = await fetch(sogh.endpoint(), sogh.postData('{ viewer { login } }'))\n      .then(r=> sogh.text2json(r))\n      .then(r=> sogh.json2response(r, d=> d.data.viewer))\n      .catch(err=> sogh.error2response(err));\n// => { type: \"success\", data: { login: \"octocat\" } }";

// 概要タブの中身。(概要・属性の一覧・振舞の一覧)
function Overview ({ data }) {
    return (
        <>
          <Section title="概要" lev="4" sx={SX_MEMBER_TITLE}>
            <P>{"GitHub の GraphQL API を呼ぶための、土台のクラス。"}</P>
            <P>{"トークン (_token)・ログインしているユーザー (_viewer)・API の URL (_endpoint) を持ち、リクエストのヘッダーと本文を作って fetch で送る。"}</P>
            <P>{"ページ送りのためにクエリを書き換える makeQuery(query, endCursor) と、レスポンスを { type, data } の形にする text2json(r)・json2response(r, getData)・error2response(error) も持つ。"}</P>
            <P>{"Pooler が Loader を継承し、Sogh が Pooler を継承する。(Loader → Pooler → Sogh)"}</P>
            <P>{"そのため、Loader のメソッドは Sogh のインスタンス (const sogh = new Sogh()) から使う。"}</P>
            <P>{"Sogh の asyncFetch〜 は、postData(query, variables) で作ったリクエストを fetch で送り、text2json(r)・json2response(r, getData)・error2response(error) で結果を { type, data } にする。"}</P>
            <P>{"fetchX(query, response2data, success, error) は、結果を { status, data } の形でコールバックに渡す古い形で、Sogh の connect(token, successed, failed) と fetch〜 が使う。"}</P>
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
