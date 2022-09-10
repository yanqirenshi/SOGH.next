import React from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { connectGithubAsync } from './slices/github.js';

import * as page from './pages/index.js';
import Modals from './Modals.js';

export default function App() {
    const [githubToken, setGithubToken] = React.useState(null);

    const github = useSelector(state => state.github);

    const dispatch = useDispatch();

    React.useState(()=> {
    }, []);


    React.useState(()=> {
        const token = process.env.REACT_APP_GITHUB_TOKEN;
        if (githubToken!==null || !token || !token.length===0)
            return;

        setGithubToken(token);

        dispatch(connectGithubAsync({token: token}));
    }, [githubToken]);

    const callbacks = {
        github: {
            auth: (token, cb)=> {
                dispatch(connectGithubAsync({token: token, callbacks: cb}));
            }
        }
    };

    return (
        <>
          <Modals github={github} callbacks={callbacks}/>
          <BrowserRouter>
            <Routes>

              <Route path="/"
                     element={<page.PageRepositories github={github} />} />

              <Route path="/repositories/:id/issues"
                     element={<page.PageRepositoryIssues />} />

              <Route path="/repositories/:id/projects"
                     element={<page.PageRepositoryProjects />} />

              <Route path="/repositories/:id/classic-projects"
                     element={<page.PageRepositoryClassicProjects />} />

            </Routes>
          </BrowserRouter>
        </>
    );
}
