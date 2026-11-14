import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane } from 'tion';

// Viewer の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/models/Viewer.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"login()"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"viewer.login()"}</Plane>
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
              <Plane>{"viewer.name()"}</Plane>
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
              <Plane>{"viewer.url()"}</Plane>
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
