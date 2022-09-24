import React from 'react';

import RedactedItem from './RedactedItem.js';
import PullRequest from './PullRequest.js';
import DraftIssue from './DraftIssue.js';
import Issue from './Issue.js';

const style ={
    width: '100%',
    height: '100%',
    overflow: 'hidden',
};

export default function ProjectNextItem (props) {
    const data = props.data;
    const sogh = props.sogh;
    const issue = props.issue;

    return (
        <div style={style}>
          {'DRAFT_ISSUE'===data.type()  && <DraftIssue data={data}/>}
          {'ISSUE'===data.type()        && <Issue data={issue}/>}
          {'PULL_REQUEST'===data.type() && <PullRequest data={data}/>}
          {'REDACTED'===data.type()     && <RedactedItem data={data}/>}
        </div>
    );
}
