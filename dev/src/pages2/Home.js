import React, {Suspense} from 'react';

import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRecoilState, useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import { getOrganaization } from '../recoil2/ORGANAIZATION.js';

import Loading from '../panels/Loading.js';

import sogh from '../manegers/sogh.js';

export default function Home () {
    const github_auth = useRecoilValue(GITHUB_AUTH);

    return (
        <Box sx={{height:'100%',width:'100%'}}>

          <Box sx={{p:3}}>

            <Island title="Organaizations"/>
            <Island title="Teams"/>
            <Island title="Pull Requests"/>
            <Island title="Draft Issues"/>
            <Island title="Issues"/>

          </Box>

        </Box>
    );
}

function Island (props) {
    const viewer = sogh.viewer();

    return (
        <Box sx={{mb: 3}}>
          <Typography variant="h4" component="div">
            {props.title}
          </Typography>

          <Suspense fallback={<Loading/>}>
            <IslandContents login={viewer.login()}/>
          </Suspense>
        </Box>
    );
}

function IslandContents (props) {
    const { login } = props;

    const x = useRecoilValue(getOrganaization(login));

    return (
        <Box sx={{mb: 3}}>
          {props.children}
        </Box>
    );
}
