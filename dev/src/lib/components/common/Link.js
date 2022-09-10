import React from 'react';

import * as router from "react-router-dom";

export default function Link (props) {
    const children = props.children;

    const href = props.href;

    return (
        <router.Link to={href}>
          {children}
        </router.Link>
    );
}
