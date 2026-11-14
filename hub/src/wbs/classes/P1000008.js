import React from 'react';

import FrameClass from '../../components/assemblies/frames/FrameClass.js';
import useClassData from '../../hooks/useClassData.js';

// クラス GraphQLNode のページ
//   src/js/models/GraphQLNode.js
const CLASS = 'GraphQLNode';

export default function P1000008 (props) {
    // 属性・振舞のデータ。(data/classes/classes.json の GraphQLNode)
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
