import React from 'react';

import { Section, P, Panel, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C } from './utils.js';

// 「Github」タブの「6. 気づいた点」。
// いまの動きを整理する中で見つけた、食い違いと、決めていないこと。
export default function Notes () {
    return (
        <Section title="気づいた点" num="6." lev="4" sx={SX_MEMBER_TITLE}>
          <Panel kind="note">いまの動きを整理する中で見つけた、食い違いと、決めていないことです。</Panel>

          <Section title="動きが食い違っているもの" num="6.1" lev="5">
            <OL>
              <LI>親の updatedAt が動かない変更は、取り直しても、反映されない場合があった。(0.4.2 で直した)
                <UL>
                  <LI>Pool は、同じ id の node が来ると、updatedAt を比べて、重ねるかどうかを決めるため。</LI>
                  <LI>GitHub で調べると、動かないのは、Issue をプロジェクトに足す・外す、の 1 種類だけだった。(Issue の projectItems。Item の Status を変えたときも、Issue の updatedAt は動かない)</LI>
                  <LI>0.4.2 で、Issue の projectItems だけは、日時が同じときも、中身が違えば重ねるようにした。(Issue 51。くわしくは「7.5 (1) updatedAt が動かない変更」を見る)</LI>
                  <LI>項目の少ない node が先に来て、古い項目が残る場合は、0.4.1 で直した。(Issue 34)</LI>
                </UL>
              </LI>
              <LI>失敗したときの戻り値が、メソッドごとに違っていた。(0.5.0 で直した)
                <UL>
                  <LI>途中まで集めた配列を返すもの。(<C>asyncFetchRepositoriesByViewer</C> など)</LI>
                  <LI>Error をそのまま返すもの。(<C>asyncFetchIssueByID</C> など)</LI>
                  <LI>呼ぶ側は、戻り値の型を見ないと、成功か失敗かを区別できなかった。</LI>
                  <LI>0.5.0 で、asyncFetch〜 は、失敗したときに例外 <C>GitHubError</C> を投げるようにした。(Issue 61。「3.5 エラーの扱い」を見る)</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="決めたほうがよいもの" num="6.2" lev="5">
            <OL>
              <LI>取得のクエリは、値を文字列の置き換えで埋め込んでいた。(0.5.0 で直した)
                <UL>
                  <LI>値に <C>"</C> や改行が入ると、クエリが壊れた。</LI>
                  <LI>0.5.0 で、取得も、更新と同じく variables で渡すようにした。(Issue 63。「3.1 クエリの作り方」を見る)</LI>
                </UL>
              </LI>
              <LI>クエリと、応答の取り出し (<C>d.data.node.comments</C> など) が、別の場所にあった。(0.5.0 で直した)
                <UL>
                  <LI>片方を変えると、もう片方も直すことになった。</LI>
                  <LI>0.5.0 で、クエリのファイルが、応答から取り出す関数 <C>pick</C> も持つようにした。(Issue 65)</LI>
                </UL>
              </LI>
              <LI>値の印の置き換えは、最初の 1 か所だけだった。(同じ印を、1 つのクエリで 2 回使えなかった。0.5.0 で、variables にして、値の印は無くなった)</LI>
              <LI>ProjectV2Item の content で、Issue の state と PullRequest の state を、同じ場所で取っていた。(5 個のクエリ。0.5.0 で直した)
                <UL>
                  <LI>型が違う (IssueState と PullRequestState) ので、GraphQL の決まりでは正しくなかった。</LI>
                  <LI>0.5.0 で、PullRequest の state を、別名 <C>pullRequestState</C> で取るようにした。(Issue 68)</LI>
                  <LI>Pool に入れる前に、<C>node2pullRequest(node)</C> が state に戻すので、PullRequest のモデルの core は、state のまま。</LI>
                  <LI>ProjectV2Item の core に残る content の JSON も、Pool に入れる前に <C>node2projectV2Item(node)</C> が state に戻す。</LI>
                </UL>
              </LI>
              <LI>Pool に、消す操作と期限が無い。(取り直しは、重ねるだけ)</LI>
              <LI>個人用アクセストークンを、REACT_APP_ の環境変数で渡している。
                <UL>
                  <LI>ビルドした JS に埋め込まれる。</LI>
                  <LI>公開するビルドには含めない、という使い方が前提になる。</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="小さな不ぞろい" num="6.3" lev="5">
            <OL>
              <LI>ProjectV2 の <C>owner()</C> は、GitHub の owner ではなく、README の <C>$Owner</C> の値を返す。(GitHub の owner は、<C>ownerNode()</C>)</LI>
              <LI>環境変数の名前が <C>REACT_APP_GITHU_PARSONAL_TOKEN</C>。(GITHU・PARSONAL のつづり)</LI>
              <LI>クエリの名前に <C>viwer</C> があった。(0.5.0 で、<C>viewer</C>・<C>issues_by_viewer</C> に直した。Issue 73)</LI>
              <LI>項目の部品の名前の付け方が、3 通りあった。(下線でつなぐもの・小文字で始まるもの・大文字で始まるもの。0.5.0 で、小文字で始まり途中が大文字、にそろえた。Issue 74)</LI>
              <LI>項目の部品が返す形が、2 通りあった。(項目だけを返すものと、{'{ }'} で囲んで返すもの。0.5.0 で、項目だけを返す形にそろえた。Issue 74)</LI>
              <LI>入れ子の件数の上限が、クエリごとに違っていた。(0.5.0 で直した)
                <UL>
                  <LI>ProjectV2Item の fieldValues は、20 件まで (<C>projectsv2_with_items_by_team</C>・<C>projectv2_by_org_login_projectv2_number</C>) と、30 件まで (<C>projectv2item_by_id</C>・<C>projectv2items_by_org_login_projectv2_number</C>・<C>projectv2items_by_user_login_projectv2_number</C>・<C>issue_by_org_repo_issue_number</C>) だった。</LI>
                  <LI>上限は、クエリごとの定数か、直に書いた数で決めていた。</LI>
                  <LI>0.5.0 で、<C>attributes.js</C> の <C>NESTED_LIMIT</C> (30) の 1 か所で決めるようにした。クエリごとの定数は、消した。(Issue 75)</LI>
                </UL>
              </LI>
              <LI>組織 (org) のクエリでも、値の印の名前が、ユーザーの login の印になっていた。(0.5.0 で、値の印は無くなった。組織のクエリの変数は <C>$org</C>)</LI>
              <LI><C>fetchX</C> は、エンドポイントを直に書いている。(<C>endpoint()</C> を使っていない)</LI>
              <LI>src/js/models/README.markdown が、古い。</LI>
            </OL>
            <P>どれから手を付けるかは、まだ決めていません。</P>
          </Section>
        </Section>
    );
}
