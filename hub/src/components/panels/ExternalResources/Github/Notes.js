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
              <LI>失敗したときの戻り値が、メソッドごとに違う。
                <UL>
                  <LI>途中まで集めた配列を返すもの。(<C>asyncFetchRepositoriesByViewer</C> など)</LI>
                  <LI>Error をそのまま返すもの。(<C>asyncFetchIssueByID</C> など)</LI>
                  <LI>呼ぶ側は、戻り値の型を見ないと、成功か失敗かを区別できない。</LI>
                </UL>
              </LI>
            </OL>
          </Section>

          <Section title="決めたほうがよいもの" num="6.2" lev="5">
            <OL>
              <LI>取得のメソッドが、2 世代ある。
                <UL>
                  <LI>fetch〜 (コールバック) は、1 ページしか取らず、レスポンスの errors も見ない。</LI>
                  <LI>asyncFetch〜 は、全ページを取り、errors を見る。</LI>
                  <LI>asyncFetch〜 にそろえるかどうかを、決めたい。</LI>
                </UL>
              </LI>
              <LI>取得のクエリは、値を文字列の置き換えで埋め込んでいる。
                <UL>
                  <LI>値に <C>"</C> や改行が入ると、クエリが壊れる。</LI>
                  <LI>更新は variables を使っているので、取得もそろえたい。</LI>
                </UL>
              </LI>
              <LI>ProjectV2 の Item を取る asyncFetch〜 は、繰り返していないので、1 ページ (100 件) で止まる。
                <UL>
                  <LI>Item を取る 3 つのクエリは、ページ送りの印はあるが、<C>pageInfo</C> を取っていない。</LI>
                </UL>
              </LI>
              <LI>クエリと、応答の取り出し (<C>d.data.node.comments</C> など) が、別の場所にある。
                <UL>
                  <LI>片方を変えると、もう片方も直すことになる。</LI>
                </UL>
              </LI>
              <LI>値の印の置き換えは、最初の 1 か所だけ。(同じ印を、1 つのクエリで 2 回使えない)</LI>
              <LI>projectCards (Projects classic) を取るクエリは、いまの GitHub では動かない。
                <UL>
                  <LI>GitHub がエラーを返し、Issue が丸ごと取れない。(projectCards だけが抜けるのではない)</LI>
                  <LI>使用中のクエリからは、外してある。(<C>issue_by_id</C> は、GitHub に送って確かめたときに見つけて、外した)</LI>
                  <LI>使われていないクエリには、残っている。(9 個)</LI>
                </UL>
              </LI>
              <LI><C>projects_next_items_by_id</C> は、いまの GitHub では動かない。
                <UL>
                  <LI>ProjectNextItem という型が、GitHub のスキーマから無くなっているため。</LI>
                  <LI><C>fetchProjectNextItemByID(id)</C> が使っている。</LI>
                </UL>
              </LI>
              <LI>ProjectV2Item の content で、Issue の state と PullRequest の state を、同じ場所で取っている。(7 個のクエリ)
                <UL>
                  <LI>型が違う (IssueState と PullRequestState) ので、GraphQL の決まりでは正しくない。</LI>
                  <LI>直すには、別名を付けることになり、応答の形が変わる。(<C>content.state</C> で読んでいる利用側が壊れる)</LI>
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
              <LI>クエリの名前に <C>viwer</C> がある。(<C>viwer</C>・<C>issues_by_viwer</C>)</LI>
              <LI>項目の部品の名前の付け方が、3 通りある。(<C>issue_comment</C>・<C>projectv2Fields</C>・<C>ProjectV2ItemFieldDateValue</C>)</LI>
              <LI>項目の部品が返す形が、2 通りある。(項目だけを返すものと、{'{ }'} で囲んで返すもの)</LI>
              <LI>使われていないクエリには、項目を、部品を使わずに直に書いているものが残っている。</LI>
              <LI>入れ子の件数の上限が、クエリごとに違う。(20 と 30。定数を宣言しているが、使っていないクエリもある)</LI>
              <LI>組織 (org) のクエリでも、値の印の名前が <C>@user-login</C> になっている。</LI>
              <LI>Sogh のメソッドから使われていないクエリが、15 個ある。(「3.6 クエリの使われ方」を見る)</LI>
              <LI><C>fetchX</C> は、エンドポイントを直に書いている。(<C>endpoint()</C> を使っていない)</LI>
              <LI>src/js/models/README.markdown が、古い。</LI>
            </OL>
            <P>どれから手を付けるかは、まだ決めていません。</P>
          </Section>
        </Section>
    );
}
