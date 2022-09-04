import React from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import * as page from './pages/index.js';
import Modals from './Modals.js';

export default function App() {
    const sogh = useSelector(state => state.github.sogh);

    return (
        <>
          <Modals />
          <BrowserRouter>
            <Routes>
              <Route path="/"                                  element={<page.PageRepositories />} />
              <Route path="/repositories/:id/issues"           element={<page.PageRepositoryIssues />} />
              <Route path="/repositories/:id/projects"         element={<page.PageRepositoryProjects />} />
              <Route path="/repositories/:id/classic-projects" element={<page.PageRepositoryClassicProjects />} />
              <Route path="/samples/redux"                     element={<page.PageSampleRedux />} />
            </Routes>
          </BrowserRouter>
        </>
    );
}
