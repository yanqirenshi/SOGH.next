import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {useParams} from "react-router-dom";

import Page from '../components/Page.js';

import sogh from '../sogh.js';

import {ProjectsNext} from '../lib/index.js';

import {
    fetchUserByID,
    fetchProjectsNextByUser,
} from '../slices/page_owner.js';

export default function PageOwner (props) {
    const [load, setLoad] = React.useState(false);

    const data = useSelector(state => state.page_owner);
    const dispatch = useDispatch();

    const owner_id = useParams().id;
    const user = sogh.user(owner_id);

    React.useEffect(()=> setLoad(true), [user]);

    if (isNeedFirstLoad(data))
        dispatch(fetchUserByID(owner_id));

    if (load && user) {
        setLoad(false);
        dispatch(fetchProjectsNextByUser(user));
    }

    return (
        <Page data={user}>
          <div style={{display:'flex', justifyContent: 'center', padding: 22}}>
            <ProjectsNext data={data.projects_next.data} sogh={sogh}/>
          </div>
        </Page>
    );
}

function isNeedFirstLoad (page_owner) {
    return sogh.isConnected()
        && page_owner.user.fetch.start===null
        && page_owner.user.fetch.end===null;
}
