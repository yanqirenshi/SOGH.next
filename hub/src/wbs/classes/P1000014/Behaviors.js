import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// ProjectV2 の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/models/ProjectV2.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"core(v)"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.core(v)"}</Plane>
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

          <Section title={"initReadmeAttributes()"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.initReadmeAttributes()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"initRegexs()"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.initRegexs()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"parseReadmeItem(readme, regex)"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.parseReadmeItem(readme, regex)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"readme"}</LI>
                <LI>{"regex"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"parseReadmeItemPlan(readme, regex)"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.parseReadmeItemPlan(readme, regex)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"readme"}</LI>
                <LI>{"regex"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"parseReadmeItemResult(readme, regexs)"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.parseReadmeItemResult(readme, regexs)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"readme"}</LI>
                <LI>{"regexs"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"parseReadme()"} lev="4" num={"7."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.parseReadme()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"number()"} lev="4" num={"8."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.number()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"title()"} lev="4" num={"9."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.title()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"url()"} lev="4" num={"10."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.url()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fields()"} lev="4" num={"11."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.fields()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"shortDescription()"} lev="4" num={"12."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.shortDescription()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"readme()"} lev="4" num={"13."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.readme()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"public()"} lev="4" num={"14."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.public()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"owner(v)"} lev="4" num={"15."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.owner(v)"}</Plane>
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

          <Section title={"creator()"} lev="4" num={"16."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.creator()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"items()"} lev="4" num={"17."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.items()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"itemsWith2ProjectV2Item()"} lev="4" num={"18."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.itemsWith2ProjectV2Item()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"priority(v)"} lev="4" num={"19."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.priority(v)"}</Plane>
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

          <Section title={"priorityData()"} lev="4" num={"20."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.priorityData()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"maneger(v)"} lev="4" num={"21."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.maneger(v)"}</Plane>
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

          <Section title={"type(v)"} lev="4" num={"22."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.type(v)"}</Plane>
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

          <Section title={"release(v)"} lev="4" num={"23."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.release(v)"}</Plane>
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

          <Section title={"plan(start, end)"} lev="4" num={"24."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.plan(start, end)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"start"}</LI>
                <LI>{"end"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"result(start, end)"} lev="4" num={"25."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.result(start, end)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"start"}</LI>
                <LI>{"end"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"action(v)"} lev="4" num={"26."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.action(v)"}</Plane>
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

          <Section title={"backlog(v)"} lev="4" num={"27."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.backlog(v)"}</Plane>
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

          <Section title={"systems(v)"} lev="4" num={"28."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.systems(v)"}</Plane>
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

          <Section title={"agency(v)"} lev="4" num={"29."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.agency(v)"}</Plane>
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

          <Section title={"customer(v)"} lev="4" num={"30."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.customer(v)"}</Plane>
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

          <Section title={"scenario(v)"} lev="4" num={"31."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.scenario(v)"}</Plane>
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

          <Section title={"progress(v)"} lev="4" num={"32."}>
            <Section title="Syntax" lev="5">
              <Plane>{"projectV2.progress(v)"}</Plane>
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

        </Container>
    );
}
