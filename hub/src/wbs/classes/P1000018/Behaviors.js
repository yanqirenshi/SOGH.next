import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane } from 'tion';

// Repository の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/models/Repository.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"name()"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"repository.name()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"url()"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"repository.url()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"description()"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"repository.description()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"descriptionHTML()"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"repository.descriptionHTML()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"owner()"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"repository.owner()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"pushedAt()"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"repository.pushedAt()"}</Plane>
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
