import React from 'react';

export default function Link (props) {
    const children = props.children;
    const style = props.style || {};
    const href = props.href;

    const style_a = {
        ...{
            color: 'rgba(0, 0, 0, 0.87)',
            textDecorationStyle: 'dotted',
            textDecorationColor: '#ddd',
        },
        ...style,
    };

    return (
        <a href={href}
           style={style_a}
           target="_blank"
           rel="noopener noreferrer">
          {children}
        </a>
    );
}
