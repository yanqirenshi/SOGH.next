import React from 'react';

import Table from './project_nexts/Table.js';

export default function ProjectNexts (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <div>
          <Table data={data} sogh={sogh}/>
        </div>
    );
}
