import React from 'react';
import moment from 'moment';

import TableBodyRowProject from './TableBodyRowProject.js';
import TableBodyRowTasks from './TableBodyRowTasks.js';

export default function TableBodyRow (props) {
    const project = props.project;
    const columns = props.columns;
    const now = props.now;
    const actions = props.actions;
    const is_opened = props.opened;
    const onChange = props.onChange;

    const project_id = project.id();

    console.log('TableBodyRow --');
    console.log(is_opened);

    return (
        <>
          <TableBodyRowProject project={project}
                               columns={columns}
                               now={now}
                               actions={actions}
                               opened={is_opened}
                               onChange={onChange}/>
          {is_opened &&
           <TableBodyRowTasks project={project}
                              columns={columns}/>}
        </>

    );
}
