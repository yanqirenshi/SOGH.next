import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// Loader の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/Loader.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"endpoint()"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.endpoint()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"token(v)"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.token(v)"}</Plane>
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

          <Section title={"viewer(v)"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.viewer(v)"}</Plane>
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

          <Section title={"isConnected()"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.isConnected()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"makeQuery(query, endCursor)"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.makeQuery(query, endCursor)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"query"}</LI>
                <LI>{"endCursor"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"ensureEndCursor(query, endCursor)"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.ensureEndCursor(query, endCursor)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"query"}</LI>
                <LI>{"endCursor"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"makeHeader()"} lev="4" num={"7."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.makeHeader()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"postData(query, variables)"} lev="4" num={"8."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.postData(query, variables)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"query"}</LI>
                <LI>{"variables"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetch(query, success, error)"} lev="4" num={"9."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.fetch(query, success, error)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"query"}</LI>
                <LI>{"success"}</LI>
                <LI>{"error"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchX(query, response2data, success, error)"} lev="4" num={"10."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.fetchX(query, response2data, success, error)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"query"}</LI>
                <LI>{"response2data"}</LI>
                <LI>{"success"}</LI>
                <LI>{"error"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"makeGraphQLDataItem(v)"} lev="4" num={"11."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.makeGraphQLDataItem(v)"}</Plane>
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

          <Section title={"makeGraphQLData(data)"} lev="4" num={"12."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.makeGraphQLData(data)"}</Plane>
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

          <Section title={"text2json(r)"} lev="4" num={"13."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.text2json(r)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"r"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"json2response(r, getData)"} lev="4" num={"14."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.json2response(r, getData)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"r"}</LI>
                <LI>{"getData"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"error2response(error)"} lev="4" num={"15."}>
            <Section title="Syntax" lev="5">
              <Plane>{"loader.error2response(error)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"error"}</LI>
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
