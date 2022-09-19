import React from 'react';

import Table from './projects_next/Table.js';

export default function ProjectsNext (props) {
    const data = props.data;
    const sogh = props.sogh;

    return (
        <div>
          <Table data={data} sogh={sogh}/>
        </div>
    );
}
