import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane } from 'tion';

import { nameOf, linesOf, memberOf } from './utils.js';

// 振舞タブ。メソッドのデータから、メソッドごとに
// Syntax / Arguments and Values / Description / Examples を描く。
//
// props:
//   data … メソッドのデータの配列。1 件は次の形。(data/classes/classes.json の methods と同じ)
//     {
//       name:        'body',               // 名前
//       parameters:  ['v', 'callbacks={}'], // 引数。'名前=既定値' は、省略できる引数
//       arguments:   [                     // 引数の型と説明 (省略できる。name で parameters の引数に結びつける)
//         { name: 'v', type: 'String', description: ['段落', ...],
//           optional: true },              // 既定値の無い、省略できる引数 (Syntax で [v] にする)
//       ],
//       syntax:      'x.plan([start, end])', // Syntax の呼び出しの形 (省略できる。自動では表せないときに書く)
//       returnType:  'any',                // 'Promise' のときは、Syntax に await を付ける
//       returns:     { name: 'body',       // 戻り値の名前。Syntax に「⇒ body」と出し、Arguments and Values に並べる
//                      type: 'String',     // 戻り値の型 (省略できる)
//                      description: [...] }, // 戻り値の説明 (省略できる。1 行 1 要素)
//                                          // null のときは、戻り値なし (Syntax に「⇒ None」と出す)
//                                          // 省略したときは、Syntax に ⇒ を出さない
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
              <Method key={`${nameOf(m.name)}-${i}`} data={m} receiver={receiver}/>
          )) }
        </Container>
    );
}

// メソッドの見出し (Section の見出し要素) の下に、横幅いっぱいの線を引く。
// Section は、見出しを data-lev 属性の付いた要素で描くので、それを選ぶ。
// (子孫の Section の見出し (Syntax など) には効かないように、直下の見出しだけを選ぶ)
const SX_METHOD = {
    '& > div:first-of-type > [data-lev]': {
        borderBottom: '1px solid',
        borderColor: 'grey.500',
        pb: 0.5,
    },
};

// Syntax の呼び出しの形 (Plane) を、大きく、余白を広くして見せる。
const SX_SYNTAX = {
    fontSize: '22px',
    padding: '22px 33px',
};

function Method ({ data, receiver }) {
    const name = nameOf(data.name);
    // 引数の型と説明 (arguments) を、名前で引けるようにする。
    const docs = Object.fromEntries((data.arguments || []).map(memberOf).map(a=> [nameOf(a.name), a]));
    // 省略できる引数: 既定値があるもの、と arguments で optional: true のもの。
    const params = (data.parameters || [])
          .map(paramOf)
          .map(p=> ({ ...p, optional: p.def !== null || !!(docs[p.name] && docs[p.name].optional) }));
    const description = linesOf(data.description);
    const examples = linesOf(data.examples);
    // 戻り値。(null は戻り値なし。名前が無いときは、Arguments and Values に並べない)
    const returns = data.returns && nameOf(data.returns.name) ? data.returns : null;
    const values = valuesOf(params, docs, returns);

    return (
        <Section title={`${name}(${params.map(p=> p.name).join(', ')})`} lev="4" sx={SX_METHOD}>
          <Section title="Syntax" lev="5">
            <Plane sx={SX_SYNTAX}>{syntaxOf(data, name, params, receiver)}</Plane>
          </Section>

          <Section title="Arguments and Values" lev="5">
            { values.length===0 && <P>なし</P> }

            { values.map(v=> (
                <Section key={v.key} title={v.title} lev="6">
                  <Section title="Type" lev="7">
                    { v.type && <P>{v.type}</P> }
                  </Section>

                  <Section title="Description" lev="7">
                    { v.description.map((s, i)=> <P key={i}>{s}</P>) }
                  </Section>
                </Section>
            )) }
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

// Arguments and Values に並べるもの。(引数のあとに戻り値)
//   [{ key, title, type, description: [行, ...] }]
// 引数の型と説明は、arguments の同じ名前のもの (docs) から取る。
// 省略できる引数は、説明の先頭に「省略できる。(既定値は …)」を足す。
function valuesOf (params, docs, returns) {
    const values = params.map(p=> {
        const doc = docs[p.name] || {};
        const optional = p.def !== null
              ? [`省略できる。既定値は ${p.def}`]
              : (p.optional ? ['省略できる。'] : []);

        return {
            key:   `argument:${p.name}`,
            title: p.name,
            type:  doc.type || null,
            description: [...optional, ...linesOf(doc.description)],
        };
    });

    if (returns)
        values.push({
            key:   'returns',
            title: `${nameOf(returns.name)} (戻り値)`,
            type:  returns.type || null,
            description: linesOf(returns.description),
        });

    return values;
}

// 'callbacks={}' → { name: 'callbacks', def: '{}' }
function paramOf (p) {
    const i = p.indexOf('=');

    return i < 0
        ? { name: p.trim(), def: null }
        : { name: p.slice(0, i).trim(), def: p.slice(i + 1).trim() };
}

// 呼び出しの形。省略できる引数は [ ] で囲む。Promise を返すメソッドには await を付ける。
// データに syntax があるときは、呼び出しの形にそれを使う。
// 戻り値は「⇒ 名前」、戻り値なし (returns: null) は「⇒ None」。(returns が無いときは付けない)
//   例: await sogh.asyncFetchProjectsV2ByTeam(team_id[, callbacks]) ⇒ projectV2Ids
function syntaxOf (data, name, params, receiver) {
    const args = params.reduce((out, p, i)=> {
        if (!p.optional) return out + (i === 0 ? '' : ', ') + p.name;

        return out + (i === 0 ? `[${p.name}]` : `[, ${p.name}]`);
    }, '');

    const call = `${receiver ? receiver + '.' : ''}${name}(${args})`;
    const form = data.syntax
          ? data.syntax
          : (data.returnType === 'Promise' ? `await ${call}` : call);

    if (data.returns === undefined) return form;

    const value = data.returns === null ? 'None' : nameOf(data.returns.name) || 'None';

    return `${form} ⇒ ${value}`;
}

function lowerFirst (v) {
    return v.charAt(0).toLowerCase() + v.slice(1);
}
