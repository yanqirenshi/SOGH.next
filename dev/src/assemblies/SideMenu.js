import React from 'react';
import { useRecoilValue } from "recoil";

import Box from '@mui/material/Box';
import LinkIS from '../parts/LinkInSite.js';

import { GITHUB_AUTH } from '../recoil/GITHUB.js';

import sogh from '../manegers/sogh.js';

export default function SideMenu (props) {
    const github_auth = useRecoilValue(GITHUB_AUTH);

    return (
        <Box sx={{
            position:'fixed',
            top:0, left:0,
            background: 'rgba(157,91,139,1)',
            p: 1,
            height:'100%',
        }}>
          {sogh.organizations().map((org) => {
              return (
                  <MenuItem key={org.id()}
                            data={org}
                            href={org.url()}/>
              );
          })}
        </Box>
    );
}

function MenuItem (props) {
    const org = props.data;

    return (
        <LinkIS href={`/next/organaizations/${org.name()}`}>
          <Box key={org.id()}
               sx={{
                   p: 0.5,
                   background: 'rgba(157,91,139,0.3)',
                   borderRadius: 0.5,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   width: 44,
                   height: 44,
               }}>
            <img src={org.avatarUrl()}
                 alt={org.name()}
                 style={{
                     width: 33,
                     height: 33,
                     border: `1px solid rgba(157,91,139,0.3)`,
                     borderRadius: 2,
                 }}/>
          </Box>
        </LinkIS>
    );
}
