import React from 'react';

export default function LinkSogh (props) {
    const to = props.to || props.href;
    const data = props.data;
    const sogh = props.sogh;

    const children = props.children;

    const style = props.style;

    const style_a = {
        ...{
            color: 'rgba(0, 0, 0, 0.87)',
            textDecorationStyle: 'dotted',
            textDecorationColor: '#ddd',
        },
        ...style,
    };

    return (
        <a href={sogh.href(to, data)} style={style_a}>
          {children}
        </a>
    );
}
