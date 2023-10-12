import React from 'react';

// import { useRecoilState } from "recoil";
// import * as atoms from '../recoil/ATOMS.js';

import Container from '@mui/material/Container';

import Frame from '../assemblies/frames/Frame.js';

// import Wbs from '../panels/Wbs.js';
// import HelpEmpty from '../panels/HelpEmpty.js';

// import Panels from '../panels/design/Panels.js';
// import Assemblies from '../panels/design/Assemblies.js';
// import Parts from '../panels/design/Parts.js';
// import Events from '../panels/design/Events.js';

import {ProjectV2} from '../lib/index.js';

export default function SoghProject () {
    // const [page_data, setPageData] = useRecoilState(atoms.PAGE_DESIGN);

    /*
      1. Project のデータを取得する。
      2. Project Items を取得する。
     */

    return (
        <Frame>
          <Container maxWidth="lg">
            <ProjectV2/>
          </Container>
        </Frame>
    );
}
