import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import GlobalAppBar from '../components/GlobalAppBar.js';

import sogh from '../sogh.js';

import {
    fetchProjectsNextByID,
} from '../slices/page_project_next.js';

export default function PageProjectNext (props) {
    const [load, setLoad] = React.useState(false);

    const data = useSelector(state => state.page_project_next);
    const dispatch = useDispatch();

    const project_next_id = useParams().id;

    const project_next = sogh.projectNext(project_next_id);

    React.useEffect(()=> setLoad(true), [project_next]);

    if (load) {
        setLoad(false);
        dispatch(fetchProjectsNextByID(project_next_id));
    }

    return (
        <div>
          <GlobalAppBar title="Project Next"/>

          <div style={{display:'flex', justifyContent: 'center'}}>
          </div>
        </div>
    );
}
