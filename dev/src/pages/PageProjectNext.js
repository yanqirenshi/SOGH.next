import React from 'react';

// import { useSelector, useDispatch } from 'react-redux';
// import { useParams } from "react-router-dom";

import GlobalAppBar from '../components/GlobalAppBar.js';

// import sogh from '../sogh.js';

// import {
//     fetchUserByID,
//     fetchProjectsNextByUser,
// } from '../slices/page_owner.js';

export default function PageProjectNext (props) {
    // const data = useSelector(state => state.page_project_next);
    // const dispatch = useDispatch();

    // const project_next_id = useParams().id;
    // const user = sogh.projectNext(project_next_id);

    // React.useEffect(()=> {
    //     user && dispatch(fetchProjectsNextByUser(user));
    // }, [user]);

    // if (isNeedFirstLoad(data))
    //     dispatch(fetchUserByID(project_next_id));

    return (
        <div>
          <GlobalAppBar title="Project Next"/>

          <div style={{display:'flex', justifyContent: 'center'}}>
          </div>
        </div>
    );
}

// function isNeedFirstLoad (page_owner) {
//     return sogh.isConnected()
//         && page_owner.user.fetch.start===null
//         && page_owner.user.fetch.end===null;
// }
