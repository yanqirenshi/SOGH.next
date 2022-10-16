import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import fetchIssueByID from './page_issue/fetchIssueByID.js';
import fetchIssueComments from './page_issue/fetchIssueComments.js';

export const page_owner = createSlice({
    name: 'page/issue',
    initialState: {
        issue: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
        comments: {
            data: [],
            fetch: {
                start: null,
                end: null,
                pageInfo: null,
            },
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIssueByID.pending, (state) => {
                const issue = state.issue;
                issue.fetch.start = DateTime.now().toISO();
                issue.fetch.end = null;
            })
            .addCase(fetchIssueByID.fulfilled, (state, action) => {
                const issue = state.issue;
                issue.fetch.end = DateTime.now().toISO();
                issue.data = action.payload;
            })
            .addCase(fetchIssueByID.rejected, (state) => {
                const issue = state.issue;
                issue.fetch.end = DateTime.now().toISO();
            });

        builder
            .addCase(fetchIssueComments.pending, (state) => {
                const comments = state.comments;
                comments.fetch.start = DateTime.now().toISO();
                comments.fetch.end = null;
            })
            .addCase(fetchIssueComments.fulfilled, (state, action) => {
                const comments = state.comments;
                comments.fetch.end = DateTime.now().toISO();

                comments.fetch.pageInfo = action.payload.pageInfo;
                comments.data = action.payload.contents;
            })
            .addCase(fetchIssueComments.rejected, (state) => {
                const comments = state.comments;
                comments.fetch.end = DateTime.now().toISO();
            });
    },
});

export default page_owner.reducer;

export {
    fetchIssueByID,
    fetchIssueComments,
};
