import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import S from '@mui/material/Typography';

import Link from './common/Link.js';
// import RedactedItem from './RedactedItem.js';
// import PullRequest from './PullRequest.js';
// import DraftIssue from './DraftIssue.js';
// import Issue from './Issue.js';

const style ={
    width: '100%',
    height: '100%',
    overflow: 'hidden',
};

export default function ProjectV2Item (props) {
    const item = props.item;

    if (!item)
        return null;

    const type = item.contentTypename();

    const project = item.project();

    return (
        <Box style={style}>
          <Container maxWidth="lg" sx={{pt:3}}>
            <Box>
              <S>{project.title} (<Link href={project.url}>{project.number}</Link>)</S>
              <S variant="h4">{item.title()}</S>
            </Box>

            <Box sx={{mt: 2, display:'flex', flexWrap:'wrap'}}>
              {item.assignees().map(assignee=> {
                  return (
                      <S key={assignee.id}>
                        <Link href={assignee.url}>
                          <img style={{height:17,width:17}}
                               src={assignee.avatarUrl}
                               alt={assignee.avatarUrl}/>
                        </Link>
                        {assignee.name || assignee.login}
                      </S>
                  );
              })}
            </Box>

            <Box sx={{mt: 1, display:'flex', flexWrap:'wrap'}}>
              <S>{item.planStart()}</S>
              <S>{item.planEnd()}</S>
            </Box>

            <Box>
              {/* console.log(item.linkedPullRequests()); */}
              {/* console.log(item.reviewers()); */}
              {/* console.log(item.repository()); */}
              {/* console.log(item.milestone()); */}
              {/* console.log(item.labels()); */}

              {'Issue'===type && <div>Issue .............</div>}
            </Box>
          </Container>
        </Box>
    );
}
