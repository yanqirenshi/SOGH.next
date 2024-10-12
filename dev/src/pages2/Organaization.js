import React, {Suspense} from 'react';

import { useRecoilValue } from "recoil";
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import { getOrganaization } from '../recoil2/ORGANAIZATION.js';

import sogh from '../manegers/sogh.js';

import { GITHUB_AUTH } from '../recoil/GITHUB.js';

import SideMenu from '../assemblies/SideMenu.js';
import Loading from '../panels/Loading.js';

export default function Organaization () {
    const { login } = useParams();

    const github_auth = useRecoilValue(GITHUB_AUTH);

    if (!github_auth)
        return null;


    return (
        <Box>
          <SideMenu />

          <Suspense fallback={<Loading/>}>
            <Contents login={login}/>
          </Suspense>

        </Box>
    );
}

function Contents (props) {
    const { login } = props;

    const x = useRecoilValue(getOrganaization(login));
    console.log(x);

    return (
        <Box/>
    );
}
