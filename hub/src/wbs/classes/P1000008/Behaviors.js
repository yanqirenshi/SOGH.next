import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// GraphQLNode の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/models/GraphQLNode.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"sogh(v)"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"graphQLNode.sogh(v)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"v"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"core(v)"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"graphQLNode.core(v)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"v"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"id()"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"graphQLNode.id()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"createdAt()"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"graphQLNode.createdAt()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"updatedAt()"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"graphQLNode.updatedAt()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

        </Container>
    );
}
