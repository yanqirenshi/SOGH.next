import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchRepositoriesByViewer } from '../slices/page_repositories.js';

import Page from '../components/Page.js';

import {Repositories} from '../lib/index.js';

import sogh from '../sogh.js';

export default function PageRepositories (props) {
    const page_repositories = useSelector(state => state.page_repositories);

    const dispatch = useDispatch();

    if (isNeedFirstLoad(page_repositories))
        dispatch(fetchRepositoriesByViewer(sogh));

    return (
        <Page mode="repositories">
          <div style={{margin:22, display:'flex', justifyContent: 'center'}}>
            <Repositories data={page_repositories.repositories}
                          sogh={sogh}/>
          </div>
        </Page>
    );
}

function isNeedFirstLoad (page_repositories) {
    return sogh.isConnected()
        && page_repositories.fetch.start===null
        && page_repositories.fetch.end===null;
}
