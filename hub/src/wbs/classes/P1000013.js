import React from 'react';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import useClassData from '../../hooks/useClassData.js';

// クラス Project のページ
//   src/js/models/Project.js
//   extends GraphQLNode
//   Projects (classic) 用のクラス。GitHub では廃止。
const CLASS = 'Project';

export default function P1000013 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の Project)
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
