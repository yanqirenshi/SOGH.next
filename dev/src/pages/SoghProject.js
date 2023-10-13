import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import { useRecoilState, useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import * as atoms from '../recoil/PAGE_SCRUM_PROJECT.js';


import Frame from '../assemblies/frames/Frame.js';

// import Wbs from '../panels/Wbs.js';
// import HelpEmpty from '../panels/HelpEmpty.js';

// import Panels from '../panels/design/Panels.js';
// import Assemblies from '../panels/design/Assemblies.js';
// import Parts from '../panels/design/Parts.js';
// import Events from '../panels/design/Events.js';

import {ProjectV2} from '../lib/index.js';

export default function SoghProject (props) {
    return (
        <Suspense fallback={<div>サスペンドしたらこれが表示される</div>}>
          <XXX/>
        </Suspense>
    );
}

function XXX () {
    let {login, number} = useParams();

    const [tabs, setTabs] = useRecoilState(atoms.PAGE_SCRUM_PROJECT_TABS);
    const authed = useRecoilValue(GITHUB_AUTH);
    const project = useRecoilValue(atoms.PROJECTV2({
        authed: authed ,
        login: login,
        number: number,
    }));
    const project_items = useRecoilValue(atoms.PROJECTV2_ITEMS({
        authed: authed ,
        login: login,
        number: number,
    }));

    return (
        <Frame>
          <ProjectV2 project={project} items={project_items}/>
        </Frame>
    );
}
