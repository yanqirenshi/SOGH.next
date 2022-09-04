import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../slices/github.js';

import GlobalAppBar from '../components/GlobalAppBar.js';
import {Repositories} from '../lib/index.js';

export default function PageRepositories () {
    const sogh = useSelector(state => state.github.sogh);
    const dispatch = useDispatch();

    return (
        <div>
          <GlobalAppBar title="Repositories"/>

          <div style={{margin:22}}>
            <Repositories />
          </div>
        </div>
    );
}
