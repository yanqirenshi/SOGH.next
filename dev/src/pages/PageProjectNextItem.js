import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import { ProjectNextItem } from '../lib/index.js';

import Page from '../components/Page.js';

import sogh from '../sogh.js';

import {
    fetchProjectNextItemByID,
} from '../slices/page_project_next_item.js';

export default function PageProjectNextItem (props) {
    const data = useSelector(state => state.page_project_next_item);
    const dispatch = useDispatch();

    const project_next_item_id = useParams().id;
    const project_next_item = sogh.projectNextItem(project_next_item_id);

    if (isNeedLoad(data))
        dispatch(fetchProjectNextItemByID(project_next_item_id));

    return (
        <Page data={project_next_item}>
          {project_next_item
           && <ProjectNextItem data={project_next_item} />}
        </Page>
    );
}

function isNeedLoad (data) {
    return data.project_next_item.data===null
        && data.project_next_item.fetch.start===null;
}
