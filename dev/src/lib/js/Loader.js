import * as model from './models/index.js';

import * as query from './queries/index.js';
import GithubApiV4 from './GithubApiV4.js';

export default class Loader {
    constructor () {
        this._token = null;

        this._viewer = null;

        this._api = {
            v4: null,
        };
    }
    token (v) {
        if (arguments.length > 0)
            this._token = v;

        return this._token;
    }
    viewer (v) {
        if (arguments.length > 0){
            this._viewer = v;
        }

        return this._viewer;
    }
    api (v) {
        if (arguments.length > 0)
            this._api.v4 = v;

        return this._api.v4;
    }
    isConnected () {
        return this._viewer !== null && this.api() !== null;
    }
    ensureEndCursor (query, endCursor) {
        if (endCursor)
            return query.replace('after: "",', `after: "${endCursor}",`);

        return query.replace('after: "",', '');
    }
    makeGraphQLDataItem (v) {
        if ("string"===(typeof v))
            return JSON.stringify(v);

        if (Array.isArray(v))
            return '[' + v.map(d => this.makeGraphQLDataItem(d)).join(', ') + ']';

        return v;
    }
    makeGraphQLData (data) {
        const x = Object.keys(data).map(key => {
            const val = data[key];

            if (val===null
                || (Array.isArray(val) && val.length===0))
                return null;

            return key + ': ' + this.makeGraphQLDataItem(data[key]);
        });

        return '{ ' + x.filter(d=>d!==null).join(', ') + ' }';
    }
    getIssuesByMilestone (milestone, cb) {
        if (!this.api()._token)
            cb([]);

        if (!milestone) return;

        const api = this.api();

        const base_query = query.issues_by_milestone
              .replace('@milestone-id', milestone.id());

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.node.issues;
                const page_info = data.pageInfo;

                for(const issue of data.nodes)
                    issues.push(new model.Issue(issue));

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else
                    cb(issues);
            });
        };

        getter();
    }
    getIssuesByRepository (repository, cb) {
        if (!this.api()._token || !repository)
            cb([]);

        const api = this.api();

        const base_query = query.issues_by_repository
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.issues;
                const page_info = data.pageInfo;

                for(const issue of data.nodes)
                    issues.push(new model.Issue(issue));

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else
                    cb(issues);
            });
        };

        getter();
    }
    getIssuesOpenByRepository (repository, cb, cb2) {
        console.warn('このメソッドは利用しないでください。\nGtd.getIssuesOpenByRepository の内容で置きかえる予定です。');
        if (!this.api()._token || !repository)
            cb([]);

        this._data.viwer.issues.fetch.start = new Date();
        this._data.viwer.issues.fetch.end = null;

        const api = this.api();

        const base_query = query.issues_open_by_repository
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.issues;
                const page_info = data.pageInfo;

                const tmp = [];
                for(const issue of data.nodes) {
                    const obj = new model.Issue(issue);
                    tmp.push(obj);
                    issues.push(obj);
                }

                if (cb2)
                    cb2(tmp, page_info);

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else {
                    this._data.viwer.issues.fetch.end = new Date();

                    this._data.viwer.issues.pool.list = issues;

                    cb(issues);
                }
            });
        };

        getter();
    }
    getIssuesOpenByRepositoryAndViewer (repository, viewer, cb) {
        console.warn('このメソッドは利用しないでください。\nGtd.getIssuesOpenByRepository の内容で置きかえる予定です。');
        if (!this.api()._token || !repository)
            cb([]);

        this._data.viwer.issues.fetch.start = new Date();
        this._data.viwer.issues.fetch.end = null;

        const api = this.api();

        const base_query = query.issues_open_by_repository
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        const isViewer = (issue) => issue.assignees.nodes.find(d=>d.id===viewer.id());

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.issues;
                const page_info = data.pageInfo;

                for(const issue of data.nodes)
                    if (isViewer(issue))
                        issues.push(new model.Issue(issue));

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else {
                    this._data.viwer.issues.fetch.end = new Date();

                    this._data.viwer.issues.pool.list = issues;

                    cb(issues);
                }
            });
        };

        getter();
    }
    getIssuesOpenByLabel (repository, label_name, cb) {
        if (!this.api()._token || !repository)
            cb([]);

        const api = this.api();

        const base_query = query.issues_open_by_label
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name())
              .replace('@label_name', label_name);

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                if (!results.data.repository.label) {
                    cb([]);
                } else {
                    const data = results.data.repository.label.issues;
                    const page_info = data.pageInfo;

                    for(const issue of data.nodes)
                        issues.push(new model.Issue(issue));

                    if (page_info.hasNextPage)
                        getter(page_info.endCursor);
                    else
                        cb(issues);
                }
            });
        };

        getter();
    }
    getIssuesByReportLabel (repository, cb) {
        if (!this.api()._token)
            cb([]);

        if (!repository)
            cb([]);

        const api = this.api();

        const base_query = query.issues_by_report_label
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const label = results.data.repository.label;

                if (!label)
                    return cb([]);

                const data = label.issues;
                const page_info = data.pageInfo;

                for(const issue of data.nodes)
                    issues.push(new model.Issue(issue));

                if (page_info.hasNextPage)
                    return getter(page_info.endCursor);
                else
                    return cb(issues);
            });
        };

        getter();
    }
    getIssuesByRepositoryProject (repository, project, cb) {
        if (!this.api()._token || !repository)
            cb([]);

        const api = this.api();

        const base_query = query.issues_by_repository
              .replace('issues(after: "", first: 100)', 'issues(after: "", first: 100, states: OPEN)')
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.issues;
                const page_info = data.pageInfo;

                const isTarget = (cards) => {
                    for (const card of cards) {
                        if (card.column.project.id===project.id)
                            return true;
                    }

                    return false;
                };

                data.nodes.reduce((list, d) => {
                    if (isTarget(d.projectCards.nodes))
                        list.push(new model.Issue(d));

                    return list;
                }, issues);

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else
                    cb(issues);
            });
        };

        getter();
    }
    getIssuesByViwer (cb) {
        if (!this.api()._token)
            return cb([]);

        this._data.viwer.issues.fetch.start = new Date();
        this._data.viwer.issues.fetch.end = null;

        const api = this.api();

        const base_query = query.issues_by_viwer;

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.viewer.issues;
                const page_info = data.pageInfo;

                for(const issue of data.nodes)
                    issues.push(new model.Issue(issue));

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else {
                    this._data.viwer.issues.fetch.end = new Date();

                    this._data.viwer.issues.pool.list = issues;

                    cb(issues);
                }
            });
        };

        getter();

        return this;
    }
    getIssuesByProjectColumn (column, cb) {
        if (!this.api()._token)
            cb([]);

        if (!column)
            cb([]);

        const api = this.api();

        const base_query = query.issues_open_by_project_column
              .replace('@column-id', column.id);

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const cards = results.data.node.cards;

                if (!cards)
                    return cb([]);

                cards.edges.reduce((list, d) => {
                    const issue = d.node.content;

                    if (issue && issue.id)
                        list.push(new model.Issue(issue));

                    return list;
                }, issues);

                const page_info = cards.pageInfo;

                if (page_info.hasNextPage)
                    return getter(page_info.endCursor);
                else
                    return cb(issues);
            });
        };

        getter();
    }
    getMilestonesByRepository (repository, cb) {
        if (!this.api()._token)
            cb([]);

        const api = this.api();

        const base_query = query.milestone_by_reposigory
              .replace('@owner', repository.owner().login)
              .replace('@name',  repository.name());

        let milestones = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.milestones;
                const page_info = data.pageInfo;

                milestones = milestones.concat(data.nodes.map(d=>new model.Milestone(d)));

                if (page_info.hasNextPage)
                    getter(page_info.endCursor);
                else
                    cb(milestones);
            });
        };

        getter();
    }
    getProjectByID (id, cb) {
        if (!this.api()._token || !id)
            cb(null);

        const api = this.api();

        const base_query = query.project_by_id
              .replace('@id', id);

        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                cb(new model.Project({...results.data.node}));
            });
        };

        getter();
    }
    getProjectsByRepository (repository, cb) {
        if (!this.api()._token || !repository)
            cb([]);

        const api = this.api();

        const base_query = query.projects_by_repository
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let projects = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.projects;
                const page_info = data.pageInfo;

                projects = projects.concat(data.nodes);

                if (page_info.hasNextPage) {
                    getter(page_info.endCursor);
                } else {
                    cb(projects.map(d=>new model.Project(d)));
                }
            });
        };

        getter();
    }
    getAssigneesByRepository (repository, cb) {
        if (!this.api()._token || !repository)
            cb([]);

        const api = this.api();

        const base_query = query.assignees_by_repository
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let assignees = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.assignableUsers;
                const page_info = data.pageInfo;

                assignees = assignees.concat(data.nodes.map(d=>new model.Assignee(d)));

                if (page_info.hasNextPage) {
                    getter(page_info.endCursor);
                } else {
                    cb(assignees);
                }
            });
        };

        getter();
    }
    getLabelsByRepository (repository, cb) {
        if (!this.api()._token || !repository)
            cb([]);

        const api = this.api();

        const base_query = query.labels_by_repository
              .replace('@owner', repository.owner().login)
              .replace('@name', repository.name());

        let labels = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                const data = results.data.repository.labels;
                const page_info = data.pageInfo;

                labels = labels.concat(data.nodes.map(d=>new model.Label(d)));

                if (page_info.hasNextPage) {
                    getter(page_info.endCursor);
                } else {
                    cb(labels);
                }
            });
        };

        getter();
    }
    createIssue (data, cb_success, cb_error) {
        if (!this.api()._token || !data)
            cb_success(null);

        const api = this.api();

        const q = query.create_issue
              .replace('@issue-data', this.makeGraphQLData(data));

        const getter = (endCursor) => {
            api.fetch(
                q,
                (results) => { if (cb_success) cb_success(results); },
                (error)   => { if (cb_error)   cb_error(error); },
            );
        };

        getter();
    }
    updateIssueBody (issue, cb_success, cb_error) {
        if (!this.api()._token || !issue)
            cb_success(null);

        const api = this.api();

        const q = query.update_issue_body
              .replace('@issue-data', this.makeGraphQLData({
                  id: issue.id(),
                  body: issue.body(),
              }));

        const getter = (endCursor) => {
            api.fetch(
                q,
                (results) => { if (cb_success) cb_success(results); },
                (error)   => { if (cb_error)   cb_error(error); },
            );
        };

        getter();
    }
    updateIssueMilestone (issue, milestoneId, cb_success, cb_error) {
        if (!this.api()._token || !issue)
            cb_success(null);

        const api = this.api();

        const q = query.update_issue_body
              .replace('@issue-data', this.makeGraphQLData({
                  id: issue.id(),
                  milestoneId: milestoneId,
              }));

        const getter = (endCursor) => {
            api.fetch(
                q,
                (results) => { if (cb_success) cb_success(results); },
                (error)   => { if (cb_error)   cb_error(error); },
            );
        };

        getter();
    }
    updateIssueProjects (issue, projectIds, cb_success, cb_error) {
        if (!this.api()._token || !issue)
            cb_success(null);

        const api = this.api();

        const q = query.update_issue_body
              .replace('@issue-data', this.makeGraphQLData({
                  id: issue.id(),
                  projectIds: projectIds,
              }));

        const getter = (endCursor) => {
            api.fetch(
                q,
                (results) => { if (cb_success) cb_success(results); },
                (error)   => { if (cb_error)   cb_error(error); },
            );
        };

        getter();
    }
    fetchRepositories (owner, name, cb) {
        if (!this.api()._token || !owner || !name)
            cb(null);

        const api = this.api();

        const base_query = query.repository
              .replace('@owner', owner)
              .replace('@name', name);

        const addReop = (success, data) => {
            const repos = this._data.repositories;

            if (!repos[owner])
                repos[owner] = {};

            repos[owner][name] = {
                data:  success ? new model.Repository(data) : null,
                valid: success,
                error: success ? null : data,
            };
        };

        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                if (results.errors)
                    addReop(false, results.errors);
                else
                    addReop(true, results.data.repository);

                if (cb) cb(!results.errors);
            });
        };

        getter();
    }
    fetchIssuesByProject (project, cb_success) {
        if (!project) return;

        const columns = project.columns();

        const progress = columns.reduce((ht,d)=>{
            ht[d.id] = null;
            return ht;
        }, {});

        const issues = [];

        for (const column of columns)
            this.getIssuesByProjectColumn(column, (ret)=> {
                // TODO: テストしてない。。。。
                // issues = issues.concat(ret);
                issues.push.apply(issues, ret);

                progress[column.id] = new Date();

                const is_finished = Object.values(progress).indexOf(null)===-1;

                if (is_finished)
                    cb_success(issues);
            });
    }
    /** **************************************************************** *
     * Search
     * **************************************************************** */
    searchIssues  (query_in, cb_success, cb_error)  {
        if (!this.api()._token || !query)
            cb_success([]);

        const api = this.api();

        const base_query = query.search_issues
              .replace('@QUERY', query_in);

        let issues = [];
        const getter = (endCursor) => {
            let query = this.ensureEndCursor(base_query, endCursor);

            api.fetch(query, (results) => {
                if ('errors' in results) {
                    cb_error({
                        errors: results.errors,
                        issues: [],
                    });
                    return;
                }

                const data = results.data.search.edges;
                const page_info = results.data.search.pageInfo;

                issues = issues.concat(data.map(d=> new model.Issue(d.node)));

                if (page_info.hasNextPage) {
                    getter(page_info.endCursor);
                } else {
                    cb_success(issues);
                }
            });
        };

        getter();
    }
    /** **************************************************************** *
     * New
     * **************************************************************** */
    connect (token, success, error) {
        const api = new GithubApiV4(token);

        // api を実行するための Promis を返す。
        return api.fetch(
            query.viwer,
            // コールバック： API実行結果 → 成功
            // SOGH としての処理を実行する。
            (results) => {
                const data = results.data;

                this.token(token);
                this.viewer(new model.Viewer(data.viewer));
                this.api(api);

                success && success();
            },
            // コールバック： API実行結果 → エラー
            // SOGH としての処理を実行する。
            (r) => {
                this.token(token);
                this.viewer(null);
                this.api(null);

                console.error(r);

                error && error(r);
            });
    }
    fetchRepositoriesByViewer (success, error) {
        // success, error は不要だな。
        const api = this.api();

        const base = query.repositories_by_viewer;
        const statmenet = this.ensureEndCursor(base, null);

        return api.fetch(
            statmenet,
            // success
            (results) => {
                const data = results.data;

                const list = data.viewer.repositories.nodes || [];

                success && success(list.map(d=> new model.Repository(d)));
            },
            // error
            (r) => {
                console.erro(r);

                error && error(r);
            });
    }
    fetchUserByID (id) {
        // success, error は不要だな。
        const api = this.api();

        const base = query.user_by_id.replace('@id', id);

        const statmenet = this.ensureEndCursor(base, null);

        return api.fetch(statmenet);
    }
}
