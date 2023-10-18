import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useRecoilValue } from "recoil";
import { GITHUB_AUTH } from '../recoil/GITHUB.js';
import * as atoms from '../recoil/PAGE_SCRUM_PROJECT_ITEM.js';

import Tabs from './ScrumProjectItem/Tabs.js';

import sogh from '../manegers/sogh.js';

import Loading from '../panels/Loading.js';
import Frame from '../assemblies/frames/Frame.js';

import {ProjectV2Item, PanelIssue} from '../lib/index.js';

export default function ScrumProjectItem (props) {
    // let {login, number, id} = useParams();
    let {id} = useParams();

    return (
        <Frame>
          <Container>
            <Suspense fallback={<Loading/>}>
              <Item item_id={id}/>
            </Suspense>
          </Container>
        </Frame>
    );
}

function Item (props) {
    const item_id = props.item_id;

    const [tabs, setTabs] = React.useState({
        selected: 'content',
        list: [
            { code: 'content', label: 'Content' },
            { code: 'PERT', label: 'pert' },
            { code: 'project', label: 'Project' },
            { code: 'milestone', label: 'Milestone' },
        ],
    });

    const authed = useRecoilValue(GITHUB_AUTH);
    const project_item = useRecoilValue(atoms.PROJECTV2_ITEM({
        authed: authed,
        id: item_id,
    }));

    const item = sogh.projectV2Item(item_id);

    const typename = item.contentTypename();

    return (
        <>
          {/* Item */}
          <Box>
            <ProjectV2Item item={item}/>
          </Box>

          <Box>
            <Tabs tabs={tabs}
                  onChange={new_tabs=> setTabs(new_tabs)}/>
          </Box>

          {/* Item Contents*/}
          <Box>
            {'Issue'===typename &&
             <Box>
               <Suspense fallback={<Loading/>}>
                 <IssueContent issue_id={item.content().id}/>
               </Suspense>
             </Box>}
          </Box>
        </>
    );
}

function IssueContent (props) {
    const id = props.issue_id;

    const issue_id = useRecoilValue(atoms.ISSUE({id: id}));

    const issue = sogh.issue(issue_id);

    return (
        <PanelIssue data={issue}/>
    );
}
