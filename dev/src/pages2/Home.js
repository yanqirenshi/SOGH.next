import React from 'react';
import { useRecoilState, useRecoilValue } from "recoil";

import Box from '@mui/material/Box';
// import SideMenu from '../assemblies/SideMenu.js';

import { GITHUB_AUTH } from '../recoil/GITHUB.js';

import sogh from '../manegers/sogh.js';

export default function Home () {
    const github_auth = useRecoilValue(GITHUB_AUTH);

    return (
        <Box sx={{height:'100%',width:'100%'}}>
            Organaization List
        </Box>
    );
}
