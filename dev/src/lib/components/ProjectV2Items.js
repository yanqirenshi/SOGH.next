import React from 'react';

import Table from './project_next_items/Table.js';

const style = {
    overflow: 'auto',
};

export default function ProjectV2Items (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <div style={style}>
          <Table data={data} sogh={sogh}/>
        </div>
    );
}
