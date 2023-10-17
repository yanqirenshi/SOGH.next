import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import * as atoms from '../recoil/PAGE_SCRUM_PROJECT_ITEM.js';

import sogh from '../manegers/sogh.js';

import Loading from '../panels/Loading.js';
import Frame from '../assemblies/frames/Frame.js';

import {ProjectV2Item} from '../lib/index.js';


export default function ScrumProjectItem (props) {
    return (
        <Suspense fallback={<Loading/>}>
          <XXX/>
        </Suspense>
    );
}

function XXX () {
    let {login, number, id} = useParams();

    const authed = useRecoilValue(GITHUB_AUTH);
    const project_item = useRecoilValue(atoms.PROJECTV2_ITEM({
        authed: authed,
        id: id,
    }));

    const item = sogh.projectV2Item(project_item);

    // const project_items = useRecoilValue(atoms.PROJECTV2_ITEM_CONTENTS({
    //     authed: authed ,
    //     id: id,
    //     typename: item.contentTypename(),
    // }));


    return (
        <Frame>
          <Box sx={{width:'100%', height:'100%', overflow: 'auto'}}>
            <ProjectV2Item item={item}/>
          </Box>
        </Frame>
    );
}
