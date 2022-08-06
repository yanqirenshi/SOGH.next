import React from 'react';


import GlobalAppBar from './components/GlobalAppBar.js';
import Repositories from './components/Repositories.js';

export default function PageRepositories () {
    return (
        <div>
          <GlobalAppBar title="Repositories"/>

          <div style={{margin:22}}>
            <Repositories />
          </div>
        </div>
    );
}
