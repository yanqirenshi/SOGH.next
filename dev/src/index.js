import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './index.css';

import store from './store.js';
import { Provider } from 'react-redux';

import * as serviceWorkerRegistration from './js/serviceWorkerRegistration';
import reportWebVitals from './js/reportWebVitals';

import * as page from './Pages.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/"                                  element={<page.PageRepositories />} />
            <Route path="/repositories/:id/issues"           element={<page.PageRepositoryIssues />} />
            <Route path="/repositories/:id/projects"         element={<page.PageRepositoryProjects />} />
            <Route path="/repositories/:id/classic-projects" element={<page.PageRepositoryClassicProjects />} />
            <Route path="/samples/redux"                     element={<page.PageSampleRedux />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
