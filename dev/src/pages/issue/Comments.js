import React from 'react';

import Comment from './Comment.js';

export default function Comments (props) {
    const data = props.data;
    const sogh = props.sogh;

    const comments = (data.comments.data || []).map(id=> sogh.issueComment(id));

    return (
        <div style={{display:'flex', justifyContent: 'center'}}>
          <div style={{width:888}}>
            {comments.map(comment=> <Comment key={comment.id()} data={comment}/>)}
          </div>
        </div>
    );
}
