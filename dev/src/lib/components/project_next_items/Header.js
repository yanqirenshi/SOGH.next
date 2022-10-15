import React from 'react';

import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import CellFieldLabel from './CellFieldLabel.js';

export default function Header (props) {
    const fields = props.fields;
    const common_fields = props.common_fields;

    return (
        <TableHead>
          <TableRow>
            {fields.map(field=>
                <CellFieldLabel  key={field.id} field={field}/>)}

            {common_fields.TYPE.show &&
             <TableCell>type</TableCell>}

            {common_fields.IS_ARCHIVED.show &&
             <TableCell>isArchived</TableCell>}

            {common_fields.CREATED_AT.show &&
             <TableCell>Create</TableCell>}

            {common_fields.UPDATED_AT.show &&
             <TableCell>Update</TableCell>}
          </TableRow>
        </TableHead>
    );
}
