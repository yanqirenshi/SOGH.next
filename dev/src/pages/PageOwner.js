import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
    fetchUserByID,
    fetchProjectsNextByUser,
} from '../slices/page_owner.js';

import {useParams} from "react-router-dom";

import GlobalAppBar from '../components/GlobalAppBar.js';

import sogh from '../sogh.js';

export default function PageOwner (props) {
    const data = useSelector(state => state.page_owner);
    const dispatch = useDispatch();

    const owner_id = useParams().id;
    const user = sogh.user(owner_id);

    React.useEffect(()=> {
        user && dispatch(fetchProjectsNextByUser(user));
    }, [user]);

    if (isNeedFirstLoad(data))
        dispatch(fetchUserByID(owner_id));

    return (
        <div>
          <GlobalAppBar title="Owner"/>

          <div style={{display:'flex', justifyContent: 'center'}}>
          </div>
        </div>
    );
}

function isNeedFirstLoad (page_owner) {
    return sogh.isConnected()
        && page_owner.user.fetch.start===null
        && page_owner.user.fetch.end===null;
}
