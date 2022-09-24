import { createSlice } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import {
    fetchProjectNextItemByID,
    fetchIssueByID,
    fetchIssueCommentsByIssueID,
} from './page_project_next_item/actions.js';

export const page_project_next_item = createSlice({
    name: 'page/page_project_next_item',
    initialState: {
        project_next_item: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
        issue: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
            comments: {
                data: null,
                fetch: {
                    start: null,
                    end: null,
                    pageInfo: {},
                },
            }
        },
        pull_request: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
        redacted: {
            data: null,
            fetch: {
                start: null,
                end: null,
            },
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectNextItemByID.pending, (state) => {
                state.project_next_item.fetch.start = DateTime.now().toISO();
                state.project_next_item.fetch.end = null;
            })
            .addCase(fetchProjectNextItemByID.fulfilled, (state, action) => {
                state.project_next_item.fetch.end = DateTime.now().toISO();
                state.project_next_item.data = action.payload.contents;
            })
            .addCase(fetchProjectNextItemByID.rejected, (state) => {
                state.project_next_item.fetch.end = DateTime.now().toISO();
            });

        builder
            .addCase(fetchIssueByID.pending, (state) => {
                state.issue.fetch.start = DateTime.now().toISO();
                state.issue.fetch.end = null;
            })
            .addCase(fetchIssueByID.fulfilled, (state, action) => {
                state.issue.fetch.end = DateTime.now().toISO();
                state.issue.data = action.payload.contents;
            })
            .addCase(fetchIssueByID.rejected, (state) => {
                state.issue.fetch.end = DateTime.now().toISO();
            });

        builder
            .addCase(fetchIssueCommentsByIssueID.pending, (state) => {
                state.issue.comments.fetch.start = DateTime.now().toISO();
                state.issue.comments.fetch.end = null;
            })
            .addCase(fetchIssueCommentsByIssueID.fulfilled, (state, action) => {
                state.issue.comments.fetch.end = DateTime.now().toISO();
                state.issue.comments.fetch.pageInfo = action.payload.pageInfo;

                state.issue.comments.data = action.payload.contents;
            })
            .addCase(fetchIssueCommentsByIssueID.rejected, (state) => {
                state.issue.comments.fetch.end = DateTime.now().toISO();
            });
    },
});

export default page_project_next_item.reducer;

export {
    fetchProjectNextItemByID,
    fetchIssueByID,
    fetchIssueCommentsByIssueID,
};
