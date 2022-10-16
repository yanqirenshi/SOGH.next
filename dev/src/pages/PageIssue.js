import React from 'react';

import {useSelector, useDispatch } from 'react-redux';
import {useParams} from "react-router-dom";

import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

import Page from '../components/Page.js';
import ContentsWithTabs from '../components/ContentsWithTabs.js';

import sogh from '../sogh.js';

import {ProjectsNext} from '../lib/index.js';

import {
    fetchIssueByID,
    fetchIssueComments,
} from '../slices/page_issue.js';

const style = {
    tabs: {
    },
    contents: {
        height:'100%',
        background:'#eee',
        boxSizing: 'border-box',
    },
};

export default function PageIssue (props) {
    const [load, setLoad] = React.useState(false);
    const [tabs, setTabs] = React.useState({
        selected: '1',
        list: [
            { code: '1', label: 'Comments' },
            { code: '2', label: 'Attributes' },
            { code: '3', label: 'Project' },
            { code: '4', label: 'Milestone' },
        ],
    });

    const data = useSelector(state => state.page_issue);
    const dispatch = useDispatch();

    const issue_id = useParams().id;
    const issue = sogh.issue(issue_id);

    React.useEffect(()=> setLoad(true), [issue]);

    if (isNeedFirstLoad(data))
        dispatch(fetchIssueByID(issue_id));

    if (load && issue) {
        setLoad(false);
        dispatch(fetchIssueComments(issue));
    }

    return (
        <Page data={issue} mode="issue">
          <ContentsWithTabs data={tabs}
                            onChange={(code)=> setTabs(selectTab(code, tabs))}>

            <TabPanel value="1" style={style.contents}>
              Comments
            </TabPanel>

            <TabPanel value="2" style={style.contents}>
              Attributes
            </TabPanel>

            <TabPanel value="3" style={style.contents}>
              Project
            </TabPanel>

            <TabPanel value="4" style={style.contents}>
              Milestone
            </TabPanel>

          </ContentsWithTabs>
        </Page>
    );
}

function isNeedFirstLoad (state) {
    return sogh.isConnected()
        && state.issue.fetch.start===null
        && state.issue.fetch.end===null;
}

function selectTab (code, tabs) {
    if (tabs.selected===code)
        return tabs;

    const new_tabs = {...tabs};

    new_tabs.selected = code;

    return new_tabs;
};
