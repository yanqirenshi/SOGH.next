import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

import { nameOf, linesOf, memberOf } from './utils.js';

// 振舞タブ。メソッドのデータから、メソッドごとに
// Syntax / Arguments and Values / Description / Examples を描く。
//
// props:
//   data … メソッドのデータの配列。1 件は次の形。(data/classes/classes.json の methods と同じ)
//     {
//       name:        'body',               // 名前
//       parameters:  ['v', 'callbacks={}'], // 引数。'名前=既定値' は、省略できる引数
//       returnType:  'any',                // 'Promise' のときは、Syntax に await を付ける
//       description: ['段落', ...],        // Description (省略できる。1 行 1 要素)
//       examples:    ['コードの行', ...],  // Examples (省略できる。1 行 1 要素)
//     }
//   name … クラスの名前。Syntax の受け手の変数名にする。(例: Issue → issue)
export default function Behaviors (props) {
    const methods = (props.data || []).map(memberOf);
    const receiver = lowerFirst(props.name || '');

    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>
          { methods.length===0 && <P>メソッドはありません。</P> }

          { methods.map((m, i)=> (
              <Method key={`${nameOf(m.name)}-${i}`} data={m} num={i + 1} receiver={receiver}/>
          )) }
        </Container>
    );
}

function Method ({ data, num, receiver }) {
    const name = nameOf(data.name);
    const params = (data.parameters || []).map(paramOf);
    const description = linesOf(data.description);
    const examples = linesOf(data.examples);

    return (
        <Section title={`${name}(${params.map(p=> p.name).join(', ')})`} lev="4" num={`${num}.`}>
          <Section title="Syntax" lev="5">
            <Plane>{syntaxOf(data, name, params, receiver)}</Plane>
          </Section>

          <Section title="Arguments and Values" lev="5">
            { params.length===0
              ? <P>なし</P>
              : <UL>
                  { params.map(p=> (
                      <LI key={p.name}>
                        {p.def===null ? p.name : `${p.name} (省略できる。既定値は ${p.def})`}
                      </LI>
                  )) }
                </UL> }
          </Section>

          <Section title="Description" lev="5">
            { description.map((s, i)=> <P key={i}>{s}</P>) }
          </Section>

          <Section title="Examples" lev="5">
            { examples.length > 0 && <Plane>{examples.join('\n')}</Plane> }
          </Section>
        </Section>
    );
}

// 'callbacks={}' → { name: 'callbacks', def: '{}' }
function paramOf (p) {
    const i = p.indexOf('=');

    return i < 0
        ? { name: p.trim(), def: null }
        : { name: p.slice(0, i).trim(), def: p.slice(i + 1).trim() };
}

// 呼び出しの形。省略できる引数は [ ] で囲む。Promise を返すメソッドには await を付ける。
//   例: await sogh.asyncFetchProjectsV2ByTeam(team_id[, callbacks])
function syntaxOf (data, name, params, receiver) {
    const args = params.reduce((out, p, i)=> {
        if (p.def === null) return out + (i === 0 ? '' : ', ') + p.name;

        return out + (i === 0 ? `[${p.name}]` : `[, ${p.name}]`);
    }, '');

    const call = `${receiver ? receiver + '.' : ''}${name}(${args})`;

    return data.returnType === 'Promise' ? `await ${call}` : call;
}

function lowerFirst (v) {
    return v.charAt(0).toLowerCase() + v.slice(1);
}
