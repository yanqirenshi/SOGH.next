import React from 'react';

import Container from '@mui/material/Container';

import { FrameWbsNodeTabs as Frame, WBSTable } from '@yanqirenshi/ihub.core';

import Attributes from '../../panels/FrameClass/Attributes.js';
import Behaviors from '../../panels/FrameClass/Behaviors.js';

// クラスのページ (WBS のワークパッケージ。src/wbs/classes/P{id}.js) の枠。
// FrameWbsNodeTabs (見出し・タブ・下の WBS の表) に、クラスの 4 つのタブを出す。
//
// props:
//   wbs_node   … ページのノード。(FrameWbsNodeTabs に渡す。見出しと、下の WBS の表に使う)
//   wbs_id     … WBS タブで、この id のノードから下の WBS を出す。
//   name       … クラスの名前。(振舞の Syntax で、受け手の変数名にする。例: Issue → issue)
//   overview   … 概要タブの中身。利用元で作った部品を渡す。(例: overview={<Overview/>})
//   attributes … 属性のデータの配列。(data/classes/classes.json のクラスの attributes)
//   behaviors  … 振舞のデータの配列。(data/classes/classes.json のクラスの methods)
//
// 属性・振舞のデータの形は、components/panels/FrameClass/Attributes.js・Behaviors.js を見る。
const TABS = [
    { code: 'overview',   label: '概要' },
    { code: 'attributes', label: '属性' },
    { code: 'behaviors',  label: '振舞' },
    { code: 'wbs',        label: 'WBS' },
];

export default function FrameClass (props) {
    // 選んでいるタブの code。null のときは、URL の ?tab= (無ければ先頭のタブ) になる。
    const [tab, setTab] = React.useState(null);

    return (
        <Frame tabs={TABS} tab={tab} onChangeTab={setTab} wbs_node={props.wbs_node} centered>
          { tab==='overview' &&
            <Container maxWidth="lg" sx={{ pt: 3 }}>
              {props.overview || null}
            </Container> }

          { tab==='attributes' && <Attributes data={props.attributes}/> }

          { tab==='behaviors' && <Behaviors data={props.behaviors} name={props.name}/> }

          { tab==='wbs' &&
            <Container maxWidth="lg" sx={{ pt: 3 }}>
              <WBSTable start_id={String(props.wbs_id)}/>
            </Container> }
        </Frame>
    );
}
