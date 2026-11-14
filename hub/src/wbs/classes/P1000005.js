import React from 'react';

import Container from '@mui/material/Container';

import { FrameWbsNodeTabs as Frame, WBSTable } from '@yanqirenshi/ihub.core';

import TABS from './TABS.js';
import Behaviors from './P1000005/Behaviors.js';

// クラス Assignee のページ
//   src/js/models/Assignee.js
//   extends GraphQLNode
export default function P1000005 (props) {
    // 選んでいるタブの code。null のときは、URL の ?tab= (無ければ先頭のタブ) になる。
    const [tab, setTab] = React.useState(null);

    return (
        <Frame tabs={TABS} tab={tab} onChangeTab={setTab} wbs_node={props.wbs_node} centered>
          {/* 概要 (overview)・属性 (attributes) の中身は、まだ空。 */}
          { tab==='behaviors' && <Behaviors/> }

          { tab==='wbs' &&
            <Container maxWidth="lg" sx={{ pt: 3 }}>
              <WBSTable start_id={String(props.wbs_node.id)}/>
            </Container> }
        </Frame>
    );
}
