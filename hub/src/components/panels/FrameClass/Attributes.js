import React from 'react';

import Container from '@mui/material/Container';
import { Table, P } from 'tion';

import { nameOf, linesOf, memberOf, VISIBILITY_SYMBOLS } from './utils.js';

// 属性タブ。属性のデータから、表 (名前・型・可視性・説明) を描く。
//
// props:
//   data … 属性のデータの配列。1 件は次の形。(data/classes/classes.json の attributes と同じ)
//     {
//       name:        '_core',              // 名前
//       type:        'object',             // 型 (省略できる)
//       visibility:  'private',            // public / private / protected / package (省略したときは public)
//       description: ['段落', ...],        // 説明 (省略できる。1 行 1 要素)
//     }
const COLUMNS = [
    { code: 'name',        label: '名前',   val: (a)=> nameOf(a.name) },
    { code: 'type',        label: '型',     val: (a)=> a.type || '' },
    { code: 'visibility',  label: '可視性', val: (a)=> visibilityOf(a.visibility) },
    { code: 'description', label: '説明',   val: (a)=> linesOf(a.description).map((s, i)=> <div key={i}>{s}</div>) },
];

export default function Attributes (props) {
    const rows = (props.data || []).map(memberOf);

    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          { rows.length===0
            ? <P>属性はありません。</P>
            : <Table columns={COLUMNS}
                     rows={rows}
                     ids={{ column: (c)=> c.code, row: (r, i)=> `${nameOf(r.name)}-${i}` }}/> }
        </Container>
    );
}

function visibilityOf (v) {
    const visibility = v || 'public';

    return `${VISIBILITY_SYMBOLS[visibility] || ''} ${visibility}`.trim();
}
