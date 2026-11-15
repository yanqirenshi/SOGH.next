import React from 'react';

import { Table, P } from 'tion';

import { nameOf, linesOf, memberOf } from './utils.js';

// メソッドの一覧の表。(メソッド・戻り値・戻り値の型・説明)
// 説明は、Description の 1 行目だけを出す。(詳しくは振舞タブ)
//
// props:
//   data … メソッドのデータの配列。(data/classes/classes.json の methods。形は Behaviors.js を見る)
const COLUMNS = [
    { code: 'method',      label: 'メソッド',     val: (m)=> `${nameOf(m.name)}(${paramNamesOf(m).join(', ')})` },
    { code: 'returns',     label: '戻り値',       val: (m)=> returnsOf(m) },
    { code: 'type',        label: '戻り値の型',   val: (m)=> (m.returns && m.returns.type) || '' },
    { code: 'description', label: '説明',         val: (m)=> linesOf(m.description)[0] || '' },
];

export default function BehaviorsTable (props) {
    const rows = (props.data || []).map(memberOf);

    if (rows.length === 0)
        return <P>メソッドはありません。</P>;

    return (
        <Table columns={COLUMNS}
               rows={rows}
               ids={{ column: (c)=> c.code, row: (r, i)=> `${nameOf(r.name)}-${i}` }}/>
    );
}

// 引数の名前。('callbacks={}' → 'callbacks')
function paramNamesOf (m) {
    return (m.parameters || []).map(p=> p.split('=')[0].trim());
}

// 戻り値の名前。戻り値なし (returns: null) は None、書いていないときは空。
function returnsOf (m) {
    if (m.returns === null) return 'None';
    if (!m.returns) return '';

    return nameOf(m.returns.name);
}
