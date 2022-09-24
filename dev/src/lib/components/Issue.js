import React from 'react';

import SideMenu from './issue/SideMenu.js';
import Inspector from './issue/Inspector.js';
import Contents from './issue/Contents.js';

const style = {
    width: '100%',
    height: '100%',
    display: 'flex',
    side_menu: {
        position: 'absolute',
    },
    contents: {
        flexGrow: 1,
        height: '100%',
    },
    inspector: {
        width: '30%',
        maxWidth: 555,
        height: '100%',
    },
};

export default function Issue (props) {
    const issue = props.data;
    const item = props.item;
    const comments = props.comments;

    return (
        <div style={style}>
          <div style={style.side_menu}>
            <SideMenu />
          </div>

          <div style={style.contents}>
            <Contents issue_comments={comments}/>
          </div>

          <div style={style.inspector}>
            {issue &&
             <Inspector data={issue} item={item} />}
          </div>
        </div>
    );
}
