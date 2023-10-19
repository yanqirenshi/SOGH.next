import React from 'react';

import Box from '@mui/material/Box';
import Filter from './repositories/Filter.js';
import Table from './repositories/Table.js';

export default function Repositories (props) {
    const data = props.data;
    const sogh = props.sogh;

    const [filter, setFilter] = React.useState({
        keyword: '',
    });

    const filtering = (v)=> sogh.get(v).name().toUpperCase().indexOf(filter.keyword.toUpperCase()) !== -1;

    const sorter = (a,b)=> {
        return sogh.repository(a).pushedAt() < sogh.repository(b).pushedAt() ? 1 : -1;
    };

    const data_filterd
          = filter.keyword.trim().length===0 ? [...data] : data.filter(filtering);

    const data_sorted = data_filterd.sort(sorter);

    return (
        <Box>
          <Box sx={{mb:2}}>
            <Filter value={filter} onChange={(v)=>setFilter(v)}/>
          </Box>

          <Table data={data_sorted} sogh={sogh}/>
        </Box>
    );
}
