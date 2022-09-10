import React from 'react';

import { Link } from "react-router-dom";

export default (props)=> {
    const children = props.children;

    const href = props.href;

    return (
        <Link to={href}>
          {children}
        </Link>
    );
}
