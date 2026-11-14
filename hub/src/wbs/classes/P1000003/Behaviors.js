import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// Pool の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/Pool.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"itemClass()"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pool.itemClass()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"ht()"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pool.ht()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"list()"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pool.list()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"add(data)"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pool.add(data)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"data"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"get(id)"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pool.get(id)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"id"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"ensure(node, makeInstance, updater)"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pool.ensure(node, makeInstance, updater)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
                <LI>{"makeInstance"}</LI>
                <LI>{"updater"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

        </Container>
    );
}
