import React from 'react';

import Comment from './comments/Comment.js';
import FormComment from './comments/FormComment.js';

export default function Comments (props) {
    const data = props.data;
    const sogh = props.sogh;

    const comments = (data.comments.data || []).map(id=> sogh.issueComment(id));

    return (
        <div style={{display:'flex', justifyContent: 'center', overflow: 'auto'}}>
          <div style={{width:888}}>
            <FormComment />

            {comments.map(comment=> <Comment key={comment.id()} data={comment}/>)}
          </div>
        </div>
    );
}
