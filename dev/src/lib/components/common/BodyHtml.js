import React from 'react';

export default function BodyHtml (props) {
    const comment = props.value;

    const html =  {__html: comment};

    return (
        <div dangerouslySetInnerHTML={html} >
        </div>
    );
}
