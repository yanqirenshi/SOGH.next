import React from 'react';

import Typography from '@mui/material/Typography';

export default function Title (props) {
    const data = props.data;
    const mode = props.mode;

    return (
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <span style={{marginRight:11}}>
            {label(mode, data)}
          </span>
          <span>
            {contents(mode,data)}
          </span>
        </Typography>
    );
}

function label (mode, data) {
    if (mode==='project-item')
        return '【Project Item】';

    if (mode==='repositories')
        return '';

    if (mode==='repository')
        return '【Repository】';

    if (mode==='user')
        return '【User】';

    if (mode==='projects')
        return '【Projects】';

    return `【${mode}】`;
}

function contents (mode, data) {
    if (mode==='project-item' && data)
        return data.title();

    if (mode==='repositories')
        return 'Repositories';

    if (mode==='repository')
        return '???';

    if (mode==='user' && data) {
        if (!data.name())
            return data.login();

        return `${data.name()} (${data.login()})`;
    }

    if (mode==='projects' && data)
        return `${data.title()} (${data.number()})`;

    return `????????`;
}
