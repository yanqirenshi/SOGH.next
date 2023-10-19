import React from 'react';

import Link from './Link.js';

export default function UserName (props) {
    const user = props.user;

    return (
        <span>
            <Link href={user.url}>
              <img src={user.avatarUrl}
                   alt={user.avatarUrl}
                   style={{width:17,height:17, marginRight:2}}/>
            </Link>

            {user.name || user.login}
        </span>
    );
}
