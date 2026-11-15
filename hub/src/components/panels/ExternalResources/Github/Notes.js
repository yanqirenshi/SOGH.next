import React from 'react';

import { Section, P, Panel, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C } from './utils.js';

// 「Github」タブの「6. 気づいた点」。
// いまの動きを整理する中で見つけた、食い違いと、決めていないこと。
export default function Notes () {
    return (
        <Section title="気づいた点" num="6." lev="4" sx={SX_MEMBER_TITLE}>
          <Panel kind="note">ここまでは「いまの動き」です。ここからは、これから整理する候補です。</Panel>

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
              <LI>ProjectV2 の Item を取る asyncFetch〜 は、繰り返していないので、1 ページ (100 件) で止まる。</LI>
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
              <LI><C>fetchX</C> は、エンドポイントを直に書いている。(<C>endpoint()</C> を使っていない)</LI>
              <LI>src/js/models/README.markdown が、古い。</LI>
            </OL>
            <P>どれから手を付けるかは、まだ決めていません。</P>
          </Section>
        </Section>
    );
}
