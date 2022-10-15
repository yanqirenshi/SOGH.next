import React from 'react';

import TableContainer from '@mui/material/TableContainer';
import MTable from '@mui/material/Table';
import Paper from '@mui/material/Paper';

import Header from './Header.js';
import Body from './Body.js';

export default function Table (props) {
    const [common_fields, setCommonFields] = React.useState({
        TITLE:                { num:  1, show: true },
        ASSIGNEES:            { num:  2, show: false },
        LABELS:               { num:  3, show: false },
        MILESTONE:            { num:  4, show: false },
        REPOSITORY:           { num:  5, show: false },
        LINKED_PULL_REQUESTS: { num:  7, show: false }, // TODO: 未調整
        REVIEWERS:            { num:  6, show: false }, // TODO: 未調整
        TRACKS:               { num:  8, show: false }, // TODO: 未調整
        // common fields
        TYPE:                 { num:  9, show: true },
        IS_ARCHIVED:          { num: 10, show: true },
        CREATED_AT:           { num: 11, show: false },
        UPDATED_AT:           { num: 12, show: false },
        // xxx
        DATE: {
            'Date.Due':        { num: 13, show: false },
            'Date.NextAction': { num: 14, show: false },
        },
    });

    const data = props.data;
    const sogh = props.sogh;

    if (!data) return null;

    const fields = getFields(data, common_fields);

    const items = data.items;

    return (
        <TableContainer component={Paper}>
          <MTable sx={{ minWidth: 650 }} aria-label="simple table">
            <Header fields={fields} common_fields={common_fields} />

            <Body data={items}
                  fields={fields}
                  common_fields={common_fields}
                  sogh={sogh}/>
          </MTable>
        </TableContainer>
    );
}

function getFields (data, common_fields) {
    return data.fields.filter(d=> {
        const common_field = common_fields[d.dataType];

        return common_field ? common_field.show : true;
    });
}
