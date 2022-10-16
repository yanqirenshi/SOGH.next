import React from 'react';

import * as router from "react-router-dom";

export default function LinkSogh (props) {
    const to = props.to;
    const data = props.data;
    const sogh = props.sogh;

    const children = props.children;

    const style = props.style;

    return (
        <router.Link to={sogh.href(to, data)} style={style}>
          {children}
        </router.Link>
    );
}
