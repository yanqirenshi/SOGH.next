import React from 'react';

import Container from '@mui/material/Container';
import { Section, P, Plane, UL, LI } from 'tion';

// Sogh の振舞 (メソッド)。
// メソッドごとに、Syntax / Arguments and Values / Description / Examples を書く。
// Syntax と Arguments and Values (引数) は、src/js/Sogh.js から書き出したもの。
// Description と Examples は、まだ空。
export default function Behaviors () {
    return (
        <Container maxWidth="lg" sx={{ pt: 3 }}>

          <Section title={"query(code)"} lev="4" num={"1."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.query(code)"}</Plane>
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

          <Section title={"routes(v)"} lev="4" num={"2."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.routes(v)"}</Plane>
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

          <Section title={"href(to, data)"} lev="4" num={"3."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.href(to, data)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"to"}</LI>
                <LI>{"data"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"connect(token, successed, failed)"} lev="4" num={"4."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.connect(token, successed, failed)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"token"}</LI>
                <LI>{"successed"}</LI>
                <LI>{"failed"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"members(v)"} lev="4" num={"5."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.members(v)"}</Plane>
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

          <Section title={"member(code)"} lev="4" num={"6."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.member(code)"}</Plane>
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

          <Section title={"node2objs(node_or_nodes, make)"} lev="4" num={"7."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.node2objs(node_or_nodes, make)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"node_or_nodes"}</LI>
                <LI>{"make"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"data2data(data, make, appender)"} lev="4" num={"8."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.data2data(data, make, appender)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"data"}</LI>
                <LI>{"make"}</LI>
                <LI>{"appender"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"zzz(data, make)"} lev="4" num={"9."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.zzz(data, make)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"data"}</LI>
                <LI>{"make"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchRepositoriesByViewer(success, fail)"} lev="4" num={"10."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchRepositoriesByViewer(success, fail)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"success"}</LI>
                <LI>{"fail"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchUserByID(id, success, fail)"} lev="4" num={"11."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchUserByID(id, success, fail)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"id"}</LI>
                <LI>{"success"}</LI>
                <LI>{"fail"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchProjectsV2ByUser(user, success, fail)"} lev="4" num={"12."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchProjectsV2ByUser(user, success, fail)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"user"}</LI>
                <LI>{"success"}</LI>
                <LI>{"fail"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchProjectsV2ByID(id, success, fail)"} lev="4" num={"13."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchProjectsV2ByID(id, success, fail)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"id"}</LI>
                <LI>{"success"}</LI>
                <LI>{"fail"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchProjectV2ItemsByProjectNext(project_next, success, fail)"} lev="4" num={"14."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchProjectV2ItemsByProjectNext(project_next, success, fail)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"project_next"}</LI>
                <LI>{"success"}</LI>
                <LI>{"fail"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"fetchProjectNextItemByID(id)"} lev="4" num={"15."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchProjectNextItemByID(id)"}</Plane>
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

          <Section title={"fetchIssueByID(id)"} lev="4" num={"16."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchIssueByID(id)"}</Plane>
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

          <Section title={"fetchIssueCommentsByIssueID(id)"} lev="4" num={"17."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.fetchIssueCommentsByIssueID(id)"}</Plane>
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

          <Section title={"updateIssueComment(id, body, callbacks)"} lev="4" num={"18."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.updateIssueComment(id, body[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"id"}</LI>
                <LI>{"body"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"createIssueComment(id, body, callbacks)"} lev="4" num={"19."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.createIssueComment(id, body[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"id"}</LI>
                <LI>{"body"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"deleteIssueComment(id, callbacks)"} lev="4" num={"20."}>
            <Section title="Syntax" lev="5">
              <Plane>{"sogh.deleteIssueComment(id[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"id"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchViewer()"} lev="4" num={"21."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchViewer()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchRepositoriesByViewer()"} lev="4" num={"22."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchRepositoriesByViewer()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchIssueByID(id)"} lev="4" num={"23."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchIssueByID(id)"}</Plane>
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

          <Section title={"asyncFetchIssueByViewer()"} lev="4" num={"24."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchIssueByViewer()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchIssueByOrgRepoIssueNumber(org_login, repo_name, issue_number)"} lev="4" num={"25."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchIssueByOrgRepoIssueNumber(org_login, repo_name, issue_number)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"org_login"}</LI>
                <LI>{"repo_name"}</LI>
                <LI>{"issue_number"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchIssueCommentsByID(id)"} lev="4" num={"26."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchIssueCommentsByID(id)"}</Plane>
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

          <Section title={"asyncFetchIssueCommentsByOrgRepoIssueNumber(org_login, repo_name, issue_number)"} lev="4" num={"27."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchIssueCommentsByOrgRepoIssueNumber(org_login, repo_name, issue_number)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"org_login"}</LI>
                <LI>{"repo_name"}</LI>
                <LI>{"issue_number"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectsV2ByViewer()"} lev="4" num={"28."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectsV2ByViewer()"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <P>なし</P>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectsV2ByTeam(team_id, callbacks)"} lev="4" num={"29."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectsV2ByTeam(team_id[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"team_id"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectsV2WithItemsByTeam(team_id, callbacks)"} lev="4" num={"30."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectsV2WithItemsByTeam(team_id[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"team_id"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectV2ByUserLoginProjectV2Number(login, number, callbacks)"} lev="4" num={"31."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectV2ByUserLoginProjectV2Number(login, number[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"login"}</LI>
                <LI>{"number"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectV2ByOrgLoginProjectV2Number(login, number, callbacks)"} lev="4" num={"32."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectV2ByOrgLoginProjectV2Number(login, number[, callbacks])"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"login"}</LI>
                <LI>{"number"}</LI>
                <LI>{"callbacks (省略できる。既定値は {})"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectV2ItemsByUserLoginProjectV2Number(login, number)"} lev="4" num={"33."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectV2ItemsByUserLoginProjectV2Number(login, number)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"login"}</LI>
                <LI>{"number"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectV2ItemsByOrgLoginProjectV2Number(login, number)"} lev="4" num={"34."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectV2ItemsByOrgLoginProjectV2Number(login, number)"}</Plane>
            </Section>
            <Section title="Arguments and Values" lev="5">
              <UL>
                <LI>{"login"}</LI>
                <LI>{"number"}</LI>
              </UL>
            </Section>
            <Section title="Description" lev="5">
            </Section>
            <Section title="Examples" lev="5">
            </Section>
          </Section>

          <Section title={"asyncFetchProjectV2ItemByID(id)"} lev="4" num={"35."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchProjectV2ItemByID(id)"}</Plane>
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

          <Section title={"asyncFetchItemByID(id)"} lev="4" num={"36."}>
            <Section title="Syntax" lev="5">
              <Plane>{"await sogh.asyncFetchItemByID(id)"}</Plane>
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

        </Container>
    );
}
