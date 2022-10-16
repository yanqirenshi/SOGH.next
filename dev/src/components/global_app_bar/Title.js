import React from 'react';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

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

    if (mode==='project')
        return '【Project】';

    if (mode==='issue')
        return '【Issue】';

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

    if (mode==='project' && data) {
        return (
            <>
              <span style={{marginRight:6}}>
                {data.title()}
              </span>
              <span>
                (
                <Link href={data.url()}>
                  {data.number()}
                </Link>
                )
              </span>
            </>
        );
    }

    if (mode==='issue')
        return '???issue???';

    return `????????`;
}
