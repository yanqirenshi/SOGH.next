import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
// import * as atoms from '../recoil/PAGE_SCRUM_PROJECT.js';

import Loading from '../panels/Loading.js';
import Frame from '../assemblies/frames/Frame.js';

export default function ScrumProjectItem (props) {
    return (
        <Suspense fallback={<Loading/>}>
          <XXX/>
        </Suspense>
    );
}

function XXX () {
    let {login, number, id} = useParams();
    console.log([login, number, id]);

    // let {login, number} = useParams();

    const authed = useRecoilValue(GITHUB_AUTH);
    // const project = useRecoilValue(atoms.PROJECTV2({
    //     authed: authed,
    //     login: login,
    //     number: number,
    // }));
    // const project_items = useRecoilValue(atoms.PROJECTV2_ITEMS({
    //     authed: authed ,
    //     login: login,
    //     number: number,
    // }));

    return (
        <Frame>
          <Box sx={{width:'100%', height:'100%', overflow: 'auto'}}>
            XXXXXXXXXXXXXXXXXXXXX
          </Box>
        </Frame>
    );
}
