import React from 'react';

import BodyHtml from '../../../lib/components/common/BodyHtml.js';

const style = {
    background:'#fff',
    padding: 22,
    borderRadius: 5,
    marginBottom: 33,
};

export default function Comment (props) {
    const data = props.data;

    return (
        <div style={style}>
          <BodyHtml data={data.bodyHTML()}/>
        </div>
    );
}
