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
              <LI>Issue の <C>dueDate()</C>・<C>nextActionDate()</C>・<C>fieldItem()</C>・<C>fieldValues()</C>・<C>project()</C> は、取り方によって TypeError になる。
                <UL>
                  <LI>これらは、core に projectItems があることを前提にしている。</LI>
                  <LI>projectItems を取るクエリは、<C>issue_by_org_repo_issue_number</C> と <C>search_issues</C> だけ。</LI>
                  <LI><C>issue_by_id</C> と <C>issues_by_viwer</C> は、projectItems を取らない。</LI>
                  <LI><C>projectV2Items()</C> は、projectItems が無ければ空の配列を返すので、同じクラスの中で扱いがそろっていない。</LI>
                </UL>
              </LI>
              <LI>項目の少ない node を Pool に入れると、いまあるモデルの値が消える。
                <UL>
                  <LI>Pool は、同じ id の node が来ると、core を丸ごと差し替えるため。</LI>
                  <LI>例: viewer が owner のリポジトリを取ると、viewer の <C>name()</C> や <C>email()</C> が null になる。</LI>
                  <LI>直し方は、「7. 関連をモデルにする」で決めている。</LI>
                </UL>
              </LI>
              <LI>viewer の作り方が、2 通りある。
                <UL>
                  <LI><C>connect</C> は、<C>User</C> を作る。</LI>
                  <LI><C>asyncFetchViewer</C> は、<C>Viewer</C> を作る。</LI>
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
              <LI>Pool に、消す操作と期限が無い。(取り直しは、上書きだけ)</LI>
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
              <LI><C>User</C>・<C>Viewer</C>・<C>Assignee</C> が、ほぼ同じ項目を持つ。</LI>
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
