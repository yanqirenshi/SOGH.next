import React from 'react';

import Table from './project_next_items/Table.js';

export default function ProjectNextsItems (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <div>
          <Table data={data} sogh={sogh}/>
        </div>
    );
}
