import React from 'react';

import Container from '@mui/material/Container';
import { Section, Plane, UL, LI } from 'tion';

// Pooler の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/Pooler.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"pool(v)"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.pool(v)"}</Plane>
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

          <Section title={"get(id)"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.get(id)"}</Plane>
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

          <Section title={"getPoolAndItemClass(code)"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.getPoolAndItemClass(code)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"code"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"node2viewer(d)"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2viewer(d)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"d"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"node2repository(node)"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2repository(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"repositories(v)"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.repositories(v)"}</Plane>
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

          <Section title={"repository(v)"} lev="4" num={"7."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.repository(v)"}</Plane>
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

          <Section title={"node2user(node)"} lev="4" num={"8."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2user(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"user(v)"} lev="4" num={"9."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.user(v)"}</Plane>
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

          <Section title={"node2projectV2(node)"} lev="4" num={"10."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2projectV2(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectsV2(v)"} lev="4" num={"11."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.projectsV2(v)"}</Plane>
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

          <Section title={"projectV2(v)"} lev="4" num={"12."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.projectV2(v)"}</Plane>
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

          <Section title={"node2projectV2Item(node)"} lev="4" num={"13."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2projectV2Item(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectV2Item(v)"} lev="4" num={"14."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.projectV2Item(v)"}</Plane>
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

          <Section title={"node2issue(node)"} lev="4" num={"15."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2issue(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"issues(v)"} lev="4" num={"16."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.issues(v)"}</Plane>
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

          <Section title={"issue(v)"} lev="4" num={"17."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.issue(v)"}</Plane>
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

          <Section title={"node2issueComment(node)"} lev="4" num={"18."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2issueComment(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"issueComment(v)"} lev="4" num={"19."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.issueComment(v)"}</Plane>
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

          <Section title={"node2pullRequest(node)"} lev="4" num={"20."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.node2pullRequest(node)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"pullRequests(v)"} lev="4" num={"21."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.pullRequests(v)"}</Plane>
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

          <Section title={"pullRequest(v)"} lev="4" num={"22."}>
            <Section title="Syntax" lev="5">
              <Plane>{"pooler.pullRequest(v)"}</Plane>
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
