import React from 'react';

import * as router from "react-router-dom";

export default function LinkSogh (props) {
    const obj = props.data;
    const sogh = props.sogh;
    const to = props.to;
    const children = props.children;
    const style = props.style;

    const href = sogh.href(obj, to, { id: to });

    return (
        <router.Link to={href} style={style}>
          {children}
        </router.Link>
    );
}
