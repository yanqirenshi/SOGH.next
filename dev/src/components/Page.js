import React from 'react';

import Measure from 'react-measure';

import GlobalAppBar from './GlobalAppBar.js';

export default function Page (props) {
    const [bounds, setBounds] = React.useState({height:0});

    const mode = props.mode;
    const data = props.data;
    const children = props.children;

    return (
        <div>
          <Measure bounds onResize={rect => setBounds(rect.bounds)}>
            {({ measureRef }) => (
                <div ref={measureRef}>
                  <GlobalAppBar mode={mode} data={data}/>
                </div>
            )}
          </Measure>

          <div style={{height:`calc(100vh - ${bounds.height}px)`, width: '100%'}}>
            {children}
          </div>
        </div>
    );
}
