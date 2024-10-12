import React from 'react';

import Box from '@mui/material/Box';
import SideMenu from './assemblies/SideMenu.js';

import Account from './assemblies/Account.js';
import Operators from './assemblies/Operators.js';

import { useRecoilState, useRecoilValue } from "recoil";
import * as atoms from './recoil/ATOMS.js';
import { GITHUB_AUTH } from './recoil/GITHUB.js';

import Router from './Router.js';
import Github from './Github.js';

export default function App () {
    const [window_size, setWindowSize] = useRecoilState(atoms.WINDOW);
    const [account_menu, setAccountMenu] = useRecoilState(atoms.ACCOUNT_MENU);
    const [operators, setOperators] = useRecoilState(atoms.OPERATORS);
    const github_auth = useRecoilValue(GITHUB_AUTH);

    const actions = {
        menu: {
            change: (new_menu)=> setAccountMenu(new_menu),
        },
        operator: {
            change: (new_operators)=> setOperators(new_operators),
        },
    };

    React.useEffect(()=> {
        const handleResize = ()=> setWindowSize({w: window.innerWidth, h: window.innerHeight});
        handleResize();

        window.addEventListener("resize", handleResize);
    }, [setWindowSize]); // TODO: これなぁ。。。

    if (!window_size) return null;

    return (
        <Box className="theme-color5" sx={{height: window_size.h}}>

          <Github/>

          {/* <Account menu={account_menu} */}
          {/*          actions={actions}/> */}

          {github_auth &&
           <>
             <SideMenu />

             <Box sx={{pl:'68px', height:'100%'}}>
               <Router/>
             </Box>
           </>
          }
        </Box>
    );
}
