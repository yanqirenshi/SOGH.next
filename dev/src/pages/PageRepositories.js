import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchRepositoriesByViewer } from '../slices/page_repositories.js';

import GlobalAppBar from '../components/GlobalAppBar.js';
import {Repositories} from '../lib/index.js';

import sogh from '../sogh.js';

export default function PageRepositories (props) {
    const page_repositories = useSelector(state => state.page_repositories);

    const dispatch = useDispatch();

    if (isNeedFirstLoad(page_repositories))
        dispatch(fetchRepositoriesByViewer(sogh));

    return (
        <div>
          <GlobalAppBar title="Repositories"/>

          <div style={{margin:22, display:'flex', justifyContent: 'center'}}>
            <div style={{width:1111}}>
              <Repositories data={page_repositories.repositories}
                            sogh={sogh}/>
            </div>
          </div>
        </div>
    );
}

function isNeedFirstLoad (page_repositories) {
    return sogh.isConnected()
        && page_repositories.fetch.start===null
        && page_repositories.fetch.end===null;
}
