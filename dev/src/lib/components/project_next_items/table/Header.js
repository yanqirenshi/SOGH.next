import React from 'react';

import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function Header (props) {
    const fields = props.fields;
    const columns = props.columns;

    return (
        <TableHead>
          <TableRow>
            {columns.map((column,i)=> {
                if (!column.show)
                    return null;

                return (
                    <TableCell key={i}>
                      {getContents(column, fields)}
                    </TableCell>
                );
            })}
          </TableRow>
        </TableHead>
    );
}

function getContents (column, fields) {
    if ('ATTRIBUTE'===column.type)
        return column.label;

    if ('FIELD'===column.type) {
        const data_type = column.dataType;

        let y;
        if ('DATE'===data_type || 'TEXT'===data_type)
            y = fields[column.dataType][column.name];
        else
            y = fields[column.dataType];

        return y.name;
    }

    return null;
}
