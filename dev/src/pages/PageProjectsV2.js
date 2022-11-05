import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import { ProjectV2Items } from '../lib/index.js';

import Page from '../components/Page.js';

import sogh from '../sogh.js';

import {
    fetchProjectsV2ByID,
    fetchProjectV2ItemsByProjectNext,
} from '../slices/page_projectV2.js';

export default function PageProjectV2 (props) {
    const [load, setLoad] = React.useState(false);
    const [loadItems, setLoadItems] = React.useState(false);

    const data = useSelector(state => state.page_projectV2);
    const dispatch = useDispatch();

    const project_next_id = useParams().id;
    const project_next = sogh.projectNext(project_next_id);

    React.useEffect(()=> {
        setLoad(true);
    }, [project_next]);

    if (load) {
        setLoad(false);
        setLoadItems(true);

        dispatch(fetchProjectsV2ByID(project_next_id));
    }

    if (loadItems && project_next) {
        setLoadItems(false);
        dispatch(fetchProjectV2ItemsByProjectNext(project_next));
    }

    return (
        <Page data={project_next} mode="project">
          <div style={{
              display:'flex',
              justifyContent: 'center',
              padding: 22,
          }}>
            <ProjectV2Items data={data.project_next_items.data} sogh={sogh}/>
          </div>
        </Page>
    );
}
