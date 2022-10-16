import React from 'react';

import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Measure from 'react-measure';

import Tabs from './Tabs.js';

const style = {
    height:'100%',
};

export default function ContentsWithTabs (props) {
    const [bounds, setBounds] = React.useState({height:0});

    const data = props.data;
    const onChange = props.onChange;
    const children = props.children;

    const style_contents = {
        height:`calc(100% - ${bounds.height}px)`,
        width: '100%',
        overflow: 'auto',
    };

    return (
        <div style={style}>
          <TabContext value={data.selected}>
            <Measure bounds onResize={rect => setBounds(rect.bounds)}>
              {({ measureRef }) => (
                  <div ref={measureRef}>
                    <Tabs data={data} onChange={onChange}/>
                  </div>
              )}
            </Measure>

            <div style={style_contents}>
              {children}
            </div>
          </TabContext>
        </div>
    );
}
