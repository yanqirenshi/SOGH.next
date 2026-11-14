import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// Label の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/models/Label.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"color()"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"label.color()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"name()"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"label.name()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"url()"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"label.url()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"description()"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"label.description()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fontColor(hexcolor)"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"label.fontColor(hexcolor)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"hexcolor"}</LI>
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
