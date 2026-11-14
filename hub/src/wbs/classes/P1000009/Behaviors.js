import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// Issue の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/models/Issue.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"core(v)"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.core(v)"}</Plane>
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

          <Section title={"number()"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.number()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"title()"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.title()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"url()"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.url()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"milestone()"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.milestone()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"assignees()"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.assignees()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"labels()"} lev="4" num={"7."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.labels()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"owner()"} lev="4" num={"8."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.owner()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getOwnerFromBody(body)"} lev="4" num={"9."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getOwnerFromBody(body)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"body"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"author()"} lev="4" num={"10."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.author()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"closedAt()"} lev="4" num={"11."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.closedAt()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"project()"} lev="4" num={"12."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.project()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"repository()"} lev="4" num={"13."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.repository()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"points()"} lev="4" num={"14."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.points()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"pointPlansTotal()"} lev="4" num={"15."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.pointPlansTotal()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"pointResultTotal()"} lev="4" num={"16."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.pointResultTotal()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getPointResultsFromBody(body)"} lev="4" num={"17."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getPointResultsFromBody(body)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"body"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getPointPlansFromBody(body)"} lev="4" num={"18."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getPointPlansFromBody(body)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"body"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getPointFromBody(body)"} lev="4" num={"19."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getPointFromBody(body)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"body"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"body(v)"} lev="4" num={"20."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.body(v)"}</Plane>
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

          <Section title={"bodyHTML()"} lev="4" num={"21."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.bodyHTML()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fieldItem()"} lev="4" num={"22."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.fieldItem()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fieldValueContents(name)"} lev="4" num={"23."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.fieldValueContents(name)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"name"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fieldValues()"} lev="4" num={"24."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.fieldValues()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getFieldValueByName(name)"} lev="4" num={"25."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getFieldValueByName(name)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"name"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"dueDate(v)"} lev="4" num={"26."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.dueDate(v)"}</Plane>
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

          <Section title={"nextActionDate(v)"} lev="4" num={"27."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.nextActionDate(v)"}</Plane>
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

          <Section title={"getDueDateFromBody(body)"} lev="4" num={"28."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getDueDateFromBody(body)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"body"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getNextActionFromBody(body)"} lev="4" num={"29."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getNextActionFromBody(body)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"body"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"addAnotetionValue(issue)"} lev="4" num={"30."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.addAnotetionValue(issue)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"issue"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"addAnotetionValueNew(issue)"} lev="4" num={"31."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.addAnotetionValueNew(issue)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"issue"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"makeIssueData()"} lev="4" num={"32."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.makeIssueData()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"issueData2requestDataDescription(data)"} lev="4" num={"33."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.issueData2requestDataDescription(data)"}</Plane>
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

          <Section title={"issueData2requestData(data)"} lev="4" num={"34."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.issueData2requestData(data)"}</Plane>
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

          <Section title={"projectV2Items()"} lev="4" num={"35."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projectV2Items()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectV2Item()"} lev="4" num={"36."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projectV2Item()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectsV2()"} lev="4" num={"37."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projectsV2()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectV2()"} lev="4" num={"38."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projectV2()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectCards()"} lev="4" num={"39."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projectCards()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getColumnFirst()"} lev="4" num={"40."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getColumnFirst()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getFirstColumnProject()"} lev="4" num={"41."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getFirstColumnProject()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"getFirstColumnProjectID()"} lev="4" num={"42."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.getFirstColumnProjectID()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"milestoneId()"} lev="4" num={"43."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.milestoneId()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projects()"} lev="4" num={"44."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projects()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"projectIds()"} lev="4" num={"45."}>
            <Section title="Syntax" lev="5">
              <Plane>{"issue.projectIds()"}</Plane>
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
