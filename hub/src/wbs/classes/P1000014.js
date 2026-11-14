import React from 'react';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import useClassData from '../../hooks/useClassData.js';

// クラス ProjectV2 のページ
//   src/js/models/ProjectV2.js
//   extends GraphQLNode
const CLASS = 'ProjectV2';

export default function P1000014 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の ProjectV2)
    const data = useClassData(CLASS);

    return (
        <FrameClass wbs_node={props.wbs_node}
                    wbs_id={props.wbs_node.id}
                    name={CLASS}
                    overview={<Overview/>}
                    attributes={data.attributes}
                    behaviors={data.methods}/>
    );
}

// 概要タブの中身。(まだ空)
function Overview () {
    return null;
}
