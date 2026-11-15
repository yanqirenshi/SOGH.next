import React from 'react';

import { Section, P, Table, OL, UL, LI } from 'tion';

import { SX_MEMBER_TITLE } from '../../FrameClass/utils.js';
import { C, TABLE_IDS, SX_AFTER_TABLE } from './utils.js';

// 「Github」タブの「3. 取得の仕様」。

// 取得メソッドの一覧。(src/js/Sogh.js)
const COLUMNS = [
    { code: 'target',  label: '取得するもの', key: 'target' },
    { code: 'methods', label: 'メソッド',     val: (r)=> r.methods.map(m=> <div key={m}><C>{m}</C></div>) },
    { code: 'style',   label: '形式',         key: 'style' },
    { code: 'paging',  label: 'ページング',   key: 'paging' },
    { code: 'returns', label: '戻り値',       key: 'returns' },
];

const CALLBACK = 'コールバック';
const ASYNC = 'async';

const METHODS = [
    { target: 'viewer',                     methods: ['connect'],                                                                                                  style: CALLBACK, paging: '-',        returns: 'User' },
    { target: 'viewer',                     methods: ['asyncFetchViewer'],                                                                                         style: ASYNC,    paging: '-',        returns: 'Viewer' },
    { target: 'viewer のリポジトリ',        methods: ['asyncFetchRepositoriesByViewer'],                                                                           style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'viewer のリポジトリ',        methods: ['fetchRepositoriesByViewer'],                                                                                style: CALLBACK, paging: '1 ページ', returns: '{ contents, pageInfo }' },
    { target: 'User',                       methods: ['fetchUserByID'],                                                                                            style: CALLBACK, paging: '-',        returns: '{ contents }' },
    { target: 'Issue (id)',                 methods: ['asyncFetchIssueByID', 'asyncFetchItemByID'],                                                                style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'Issue (org・repo・番号)',    methods: ['asyncFetchIssueByOrgRepoIssueNumber'],                                                                      style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'viewer の Issue (OPEN)',     methods: ['asyncFetchIssueByViewer'],                                                                                  style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'Issue のコメント',           methods: ['asyncFetchIssueCommentsByID', 'asyncFetchIssueCommentsByOrgRepoIssueNumber'],                               style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'コメントの追加・更新・削除', methods: ['createIssueComment', 'updateIssueComment', 'deleteIssueComment'],                                           style: CALLBACK, paging: '-',        returns: '-' },
    { target: 'ProjectV2 (viewer)',         methods: ['asyncFetchProjectsV2ByViewer'],                                                                             style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'ProjectV2 (team)',           methods: ['asyncFetchProjectsV2ByTeam', 'asyncFetchProjectsV2WithItemsByTeam'],                                        style: ASYNC,    paging: '全件',     returns: 'id の配列' },
    { target: 'ProjectV2 (1 件)',           methods: ['asyncFetchProjectV2ByUserLoginProjectV2Number', 'asyncFetchProjectV2ByOrgLoginProjectV2Number'],            style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'ProjectV2 の Item',          methods: ['asyncFetchProjectV2ItemsByUserLoginProjectV2Number', 'asyncFetchProjectV2ItemsByOrgLoginProjectV2Number'],  style: ASYNC,    paging: '1 ページ', returns: 'id の配列' },
    { target: 'ProjectV2 の Item (1 件)',   methods: ['asyncFetchProjectV2ItemByID'],                                                                              style: ASYNC,    paging: '-',        returns: 'id' },
    { target: 'ProjectV2 の Item (旧)',     methods: ['fetchProjectV2ItemsByProjectNext'],                                                                         style: CALLBACK, paging: '1 ページ', returns: '{ contents, fields, pageInfo }' },
];

export default function Fetching () {
    return (
        <Section title="取得の仕様" num="3." lev="4" sx={SX_MEMBER_TITLE}>

          <Section title="クエリの作り方" num="3.1" lev="5">
            <OL>
              <LI>クエリの本体は、src/js/queries/ の文字列。(1 ファイルに 1 クエリ)</LI>
              <LI>共通の項目 (user・repository・issue・projectv2 など) は、<C>queries/attributes.js</C> の関数に切り出してある。</LI>
              <LI>取得の値は、クエリの文字列の印 (<C>@id</C>・<C>@login</C>・<C>@name</C>・<C>@number</C> など) を <C>String.replace</C> で置き換えて渡す。</LI>
              <LI>更新 (mutation) の値だけは、GraphQL の variables で渡す。(<C>postData(query, variables)</C>)</LI>
            </OL>
          </Section>

          <Section title="ページング" num="3.2" lev="5">
            <OL>
              <LI>一覧のクエリには、<C>{'after: "", first: 100'}</C> という印が入っている。(<C>attributes.page_nation()</C>)</LI>
              <LI><C>makeQuery(query, cursor)</C> が、<C>{'after: "",'}</C> を書き換える。
                <UL>
                  <LI>cursor があれば、<C>{'after: "<cursor>",'}</C> にする。</LI>
                  <LI>無ければ、消す。</LI>
                </UL>
              </LI>
              <LI>asyncFetch〜 は、<C>pageInfo.hasNextPage</C> が false になるまで繰り返して、全件を集める。</LI>
              <LI>fetch〜 (古い形) は、1 ページ目しか取らない。</LI>
            </OL>
          </Section>

          <Section title="取得メソッドの一覧" num="3.3" lev="5">
            <Table columns={COLUMNS} rows={METHODS} ids={TABLE_IDS}/>
            <P sx={SX_AFTER_TABLE}>async のメソッドは、モデルではなく id を返します。モデルは、id で Pool から引きます。(<C>sogh.issue(id)</C> など)</P>
          </Section>

          <Section title="コールバックの決まり" num="3.4" lev="5">
            <OL>
              <LI>fetch〜 (古い形) は、<C>success(out)</C> と <C>error(out)</C> を呼ぶ。</LI>
              <LI>更新と、一部の asyncFetch〜 は、<C>{'callbacks = { start, successed, failed, fetched }'}</C> を受け取る。</LI>
              <LI>はじめに <C>start</C> を呼び、終わったら <C>successed</C> か <C>failed</C> を呼ぶ。</LI>
              <LI><C>fetched</C> は、1 ページ取るたびに呼ぶ。(team の ProjectV2 だけ)</LI>
            </OL>
          </Section>

          <Section title="エラーの扱い" num="3.5" lev="5">
            <OL>
              <LI>HTTP のステータスが 2xx でなければ、<C>text2json(r)</C> が失敗 (reject) にする。</LI>
              <LI>HTTP 200 でも、レスポンスに errors があれば、<C>json2response(r, getData)</C> が Error を投げる。(message を改行でつなぐ)</LI>
              <LI>投げた Error は、<C>error2response(error)</C> で <C>{"{ type: 'error', data: error }"}</C> にする。</LI>
              <LI>失敗したときの戻り値は、メソッドごとに違う。(「6. 気づいた点」を見る)</LI>
            </OL>
          </Section>

        </Section>
    );
}
