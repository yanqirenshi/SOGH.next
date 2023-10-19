import React from 'react';

import Box from '@mui/material/Box';
import S from '@mui/material/Typography';

import TableProjectV2Items from '../common/TableProjectV2Items.js';

export default function Items (props) {
    const items = props.items;

    const x = items.reduce((ht,item)=> {
        if (!ht[item.status()])
            ht[item.status()] = [];

        ht[item.status()].push(item);

        return ht;
    }, {});

    const statuses = ['null', 'In Progress', 'Todo', 'Done'];

    return (
        <Box sx={{pb:22}}>
          {statuses.map(status=> {
              const status_items = x[status] || [];
              return (
                  <Box key={status} sx={{mb: 6}}>
                    <S variant="h5">
                      {status}
                    </S>
                    <TableProjectV2Items items={status_items}/>
                  </Box>
              );
          })}
        </Box>
    );
}
