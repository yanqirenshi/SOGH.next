import React from 'react';

// import { useSelector, useDispatch } from 'react-redux';
// import { fetchRepositoriesByViewer } from '../slices/page_repositories.js';

import {useParams} from "react-router-dom";

import Page from '../components/Page.js';

import SideMenu from './repository/SideMenu.js';
import Actions from './repository/Actions.js';
import Discussions from './repository/Discussions.js';
import Pullrequests from './repository/Pullrequests.js';
import Issues from './repository/Issues.js';
import Cockpit from './repository/Cockpit.js';

import sogh from '../sogh.js';

const menu = [
    { code: 'cockpit',      label: 'Cockpit' },
    { code: 'issues',       label: 'Issues' },
    { code: 'pullrequests', label: 'Pull requests' },
    { code: 'discussions',  label: 'Discussions' },
    { code: 'actions',      label: 'Actions' },
];

export default function PageRepository (props) {
    const repository_id = useParams().id;
    const repository = sogh.repository(repository_id);
    // const page_repositories = useSelector(state => state.page_repositories);

    // const dispatch = useDispatch();

    // if (isNeedFirstLoad(page_repositories))
    //     dispatch(fetchRepositoriesByViewer(SOGH));

    return (
        <Page data={repository} mode="repository">
          <div style={{display:'flex', justifyContent: 'center'}}>
            <div style={{minWidth:222, maxWidth: 333}}>
              <SideMenu data={menu}/>
            </div>

            <div style={{flexGrow:1, background: '#eee'}}>
              <Cockpit />
              <Issues />
              <Actions />
              <Pullrequests />
              <Discussions />
            </div>
          </div>
        </Page>
    );
}

// function isNeedFirstLoad (page_repositories) {
//     return SOGH.isConnected()
//         && page_repositories.fetch.start===null
//         && page_repositories.fetch.end===null;
// }
