import React from 'react';

import { Table, P } from 'tion';

import { nameOf, linesOf, memberOf } from './utils.js';
import VisibilityMark from './VisibilityMark.js';

// 属性の一覧の表。(可視性・名前・型・説明)
// 説明は、Description の 1 行目だけを出す。(詳しくは属性タブ)
//
// props:
//   data … 属性のデータの配列。(data/classes/classes.json の attributes。形は Attributes.js を見る)
const COLUMNS = [
    { code: 'visibility',  label: '可視性', val: (a)=> <VisibilityMark visibility={a.visibility} sx={{ mr: 0 }}/> },
    { code: 'name',        label: '名前',   val: (a)=> nameOf(a.name) },
    { code: 'type',        label: '型',     val: (a)=> a.type || '' },
    { code: 'description', label: '説明',   val: (a)=> linesOf(a.description)[0] || '' },
];

export default function AttributesTable (props) {
    const rows = (props.data || []).map(memberOf);

    if (rows.length === 0)
        return <P>属性はありません。</P>;

    return (
        <Table columns={COLUMNS}
               rows={rows}
               ids={{ column: (c)=> c.code, row: (r, i)=> `${nameOf(r.name)}-${i}` }}/>
    );
}
