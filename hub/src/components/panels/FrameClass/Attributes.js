import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import { Section, P, Plane, UL, LI } from 'tion';

import { nameOf, linesOf, memberOf, SX_MEMBER_TITLE, VISIBILITY_SYMBOLS } from './utils.js';

// 属性タブ。属性のデータから、属性ごとに
// Value Type / Initial Value / Description / Examples / Affected By / See Also を描く。
// (振舞タブと同じく、CLHS の項目の形。属性は、変数の項目にならう)
//
// props:
//   data … 属性のデータの配列。1 件は次の形。(data/classes/classes.json の attributes と同じ)
//     {
//       name:         '_priority',               // 名前
//       visibility:   'private',                 // public / private / protected / package (見出しに記号で出す。省略したときは public)
//       type:         'String | null',           // Value Type (省略できる。クラス図の型にも出る)
//       initialValue: '"?"',                     // Initial Value (省略できる。コードの形で書く)
//       description:  ['段落', ...],             // Description (省略できる。1 行 1 要素)
//       examples:     ['コードの行', ...],       // Examples (省略できる。1 行 1 要素)
//       affectedBy:   ['priority(v)', ...],      // Affected By: 値を変えるもの (省略できる)
//       seeAlso:      ['priorityData()', ...],   // See Also: 関係するもの (省略できる)
//     }
export default function Attributes (props) {
    const attributes = (props.data || []).map(memberOf);

    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          { attributes.length===0 && <P>属性はありません。</P> }

          { attributes.map((a, i)=> (
              <Attribute key={`${nameOf(a.name)}-${i}`} data={a}/>
          )) }
        </Container>
    );
}

function Attribute ({ data }) {
    const description = linesOf(data.description);
    const examples = linesOf(data.examples);
    const affected_by = linesOf(data.affectedBy);
    const see_also = linesOf(data.seeAlso);

    return (
        <Section title={<Title data={data}/>} lev="4" sx={SX_MEMBER_TITLE}>
          <Section title="Value Type" lev="5">
            { data.type && <P>{data.type}</P> }
          </Section>

          <Section title="Initial Value" lev="5">
            { data.initialValue && <Plane>{data.initialValue}</Plane> }
          </Section>

          <Section title="Description" lev="5">
            { description.map((s, i)=> <P key={i}>{s}</P>) }
          </Section>

          <Section title="Examples" lev="5">
            { examples.length > 0 && <Plane>{examples.join('\n')}</Plane> }
          </Section>

          <Section title="Affected By" lev="5">
            <Names list={affected_by}/>
          </Section>

          <Section title="See Also" lev="5">
            <Names list={see_also}/>
          </Section>
        </Section>
    );
}

// 見出しの、可視性の記号の <pre>。
// <pre> は、そのままだと行を分けて幅いっぱいに広がるので、見出しの 1 行の中に置く。
const SX_VISIBILITY = {
    display: 'inline',
    m: 0,
    mr: 1,
    px: 1,
    py: 0.25,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    backgroundColor: 'grey.100',
    borderRadius: 1,
};

// 見出し。可視性の記号 (<pre> でくくる) と名前。(例: - _priority)
// 記号はクラス図 (d3.classes) と同じ。可視性が無いときは、クラス図と同じく public (+) にする。
// 記号にマウスを乗せると、可視性 (public など) をツールチップで出す。
function Title ({ data }) {
    const visibility = data.visibility || 'public';
    const symbol = VISIBILITY_SYMBOLS[visibility] || '';

    return (
        <>
          { symbol &&
            <Tooltip title={visibility} arrow>
              <Box component="pre" sx={SX_VISIBILITY}>{symbol}</Box>
            </Tooltip> }
          {nameOf(data.name)}
        </>
    );
}

function Names ({ list }) {
    if (list.length === 0) return null;

    return (
        <UL>
          { list.map((s, i)=> <LI key={i}>{s}</LI>) }
        </UL>
    );
}
