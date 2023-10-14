import React from 'react';

export default function Link (props) {
    const children = props.children;

    const href = props.href;

    const style = {
        color: 'rgba(0, 0, 0, 0.87)',
        textDecorationStyle: 'dotted',
        textDecorationColor: '#ddd',
    };

    return (
        <a href={href}
           style={style}>
          {children}
        </a>
    );
}
