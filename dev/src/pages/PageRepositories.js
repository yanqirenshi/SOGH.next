import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchRepositoriesByViewer } from '../slices/page_repositories.js';

import GlobalAppBar from '../components/GlobalAppBar.js';
import {Repositories} from '../lib/index.js';

import SOGH from '../sogh.js';

export default function PageRepositories (props) {
    const page_repositories = useSelector(state => state.page_repositories);

    const dispatch = useDispatch();

    if (isNeedFirstLoad(page_repositories))
        dispatch(fetchRepositoriesByViewer(SOGH));

    return (
        <div>
          <GlobalAppBar title="Repositories"/>

          <div style={{margin:22}}>
            <Repositories data={page_repositories.repositories}
                          sogh={SOGH}/>
          </div>
        </div>
    );
}

function isNeedFirstLoad (page_repositories) {
    return SOGH.isConnected()
        && page_repositories.fetch.start===null
        && page_repositories.fetch.end===null;
}
