import React from 'react';

import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import TableCellDateTime from '../common/TableCellDateTime.js';

import CellFieldValue from './CellFieldValue.js';

export default function Body (props) {
    const items = props.data;
    const fields = props.fields;
    const common_fields = props.common_fields;
    const sogh = props.sogh;

    return (
        <TableBody>
          {items.map((id) => {
              const row = sogh.projectNextItem(id);
              const href = sogh.href(row,'project-next-item', {id: row.id()});

              return (
                  <TableRow key={id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>

                    // common fields
                    {fields.map(field=>
                        <CellFieldValue field={field} row={row}/>)}

                    {common_fields.TYPE.show &&
                     <TableCell>{row.type()}</TableCell>}

                    {common_fields.IS_ARCHIVED.show &&
                     <TableCell>{row.isArchived()}</TableCell>}

                    {common_fields.CREATED_AT.show &&
                     <TableCellDateTime data={row.createdAt()}/>}

                    {common_fields.UPDATED_AT.show &&
                     <TableCellDateTime data={row.updatedAt()}/>}
                  </TableRow>
              );
          })}
        </TableBody>
    );
}
