import React from 'react';

import { Section, P, Plane, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, SX_PLANE } from './utils.js';

// 「Github」タブの「1. 全体像」と「2. 認証と接続」。

// 層のつながり。(上から下に呼ぶ)
// 全角の文字が混じると桁がそろわないので、桁をそろえる書き方はしない。
const LAYERS = [
    'hub/src/index.js',
    '  config.github.token (REACT_APP_GITHU_PARSONAL_TOKEN)',
    '    |',
    '    v',
    'ihub.core の Github.js',
    '  トークンを決めて sogh.connect(token) を呼ぶ',
    '    |',
    '    v',
    'Sogh (src/js/Sogh.js)',
    '  取得メソッド (asyncFetch〜)',
    '    | extends',
    'Pooler (src/js/Pooler.js)',
    '  node2xxx() で node をモデルにして Pool に入れる',
    '    | extends',
    'Loader (src/js/Loader.js)',
    '  token / endpoint / request / postData',
    '    |',
    '    v',
    'POST https://api.github.com/graphql',
].join('\n');

export default function Overview () {
    return (
        <>
          <Section title="全体像" num="1." lev="4" sx={SX_MEMBER_TITLE}>
            <P>GitHub のデータは、sogh (src/js/) が GraphQL API (v4) で取得し、モデルにして持ちます。</P>
            <P>REST API (v3) は使っていません。</P>

            <Plane sx={SX_PLANE}>{LAYERS}</Plane>

            <P>層の役割は、次のとおりです。</P>
            <OL>
              <LI><C>Loader</C> は、HTTP と認証を受け持つ。GitHub の GraphQL のエンドポイントに POST する。(取得は <C>request(query, variables)</C> で送り、応答の data を返す。失敗したときは GitHubError を投げる)</LI>
              <LI><C>Pooler</C> は、取得した node (JSON) をモデルに変換し、種類ごとの Pool に id で保存する。</LI>
              <LI><C>Matchmaker</C> (src/js/Matchmaker.js) は、node に入れ子で付いてくる関連を、モデルにして Pool に入れる。<C>Pooler</C> が呼ぶ。(「7. 関連をモデルにする」を見る)</LI>
              <LI><C>Sogh</C> は、「何を取得するか」のメソッドを持つ。クエリ (src/js/queries/) と組み合わせる。</LI>
              <LI>モデル (src/js/models/) は、node を包んで、読みやすいメソッドを生やしたクラス。</LI>
            </OL>
          </Section>

          <Section title="認証と接続" num="2." lev="4" sx={SX_MEMBER_TITLE}>
            <OL>
              <LI>トークンは、iHub (ihub.core の Github.js) が決める。
                <UL>
                  <LI>先に、OAuth のトークンを使う。(<C>GET /api/github/token</C>。API サーバーがメモリに持つ)</LI>
                  <LI>無ければ、個人用アクセストークン (<C>config.github.token</C>) を使う。</LI>
                </UL>
              </LI>
              <LI><C>sogh.connect(token, successed, failed)</C> が、トークンを Loader に覚えさせ、viewer のクエリで確かめる。</LI>
              <LI>成功すると、viewer を <C>User</C> として Pool に入れ、<C>viewer()</C> で読めるようにする。</LI>
              <LI><C>isConnected()</C> は、<C>viewer() !== null</C> かどうかを返す。</LI>
              <LI>認証のヘッダーは、<C>Authorization: bearer &lt;token&gt;</C>。</LI>
            </OL>
          </Section>
        </>
    );
}
