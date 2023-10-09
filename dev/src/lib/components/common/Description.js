import React from 'react';

import S from '@mui/material/Typography';

export default function Description (props) {
    const value = props.value;

    if (!value)
        return null;

    return value.split('\n').map(line=> {
        return (
            <S>
              {line}
              <br/>
            </S>
        );
    });
}
