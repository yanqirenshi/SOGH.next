import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchRepositoriesByViewer } from '../slices/page_repositories.js';

import GlobalAppBar from '../components/GlobalAppBar.js';
import {Repositories} from '../lib/index.js';

import SOGH from '../sogh.js';

export default function PageRepositories () {
    const github = useSelector(state => state.github);
    const page_repositories = useSelector(state => state.page_repositories);

    const dispatch = useDispatch();

    if (SOGH.isConnected()
        && page_repositories.fetch.start===null
        && page_repositories.fetch.end===null)
        dispatch(fetchRepositoriesByViewer(SOGH));

    return (
        <div>
          <GlobalAppBar title="Repositories"/>

          <div style={{margin:22}}>
            <Repositories />
          </div>
        </div>
    );
}
