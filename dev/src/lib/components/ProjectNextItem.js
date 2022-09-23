import React from 'react';

import RedactedItem from './RedactedItem.js';
import PullRequest from './PullRequest.js';
import DraftIssue from './DraftIssue.js';
import Issue from './Issue.js';

const style ={
    width: '100%',
    height: '100%',
};

export default function ProjectNextItem (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <div style={style}>
          {'DRAFT_ISSUE'===data.type() && <DraftIssue/>}
          {'ISSUE'===data.type() && <Issue/>}
          {'PULL_REQUEST'===data.type() && <PullRequest/>}
          {'REDACTED'===data.type() && <RedactedItem/>}
        </div>
    );
}
