import ProjectV2Item from './components/ProjectV2Item.js';
import ProjectV2Items from './components/ProjectV2Items.js';
import ProjectsV2 from './components/ProjectsV2.js';
import Repositories from './components/Repositories.js';
import ProjectV2Contents from './components/ProjectV2Contents.js';
import ProjectV2Details from './components/ProjectV2Details.js';
import PanelIssue from './components/Issue.js';
import PanelIssueComments from './components/IssueComments.js';
import TableProjectV2Items from './components/common/TableProjectV2Items.js';

import Sogh from './js/Sogh.js';

// 取得に失敗したときに投げる例外のクラス。(利用側が instanceof で受けられるように。yanqirenshi/SOGH.next#61)
import { GitHubError } from './js/Loader.js';

import {Issue}       from './js/models/index.js';
import {Label}       from './js/models/index.js';
import {Milestone}   from './js/models/index.js';
import {Repository}  from './js/models/index.js';

// モデルを、まとめて 1 つの名前で export する。(yanqirenshi/SOGH.next#38)
// 部品の ProjectV2Item と名前が重なるので、モデルは models.ProjectV2Item のように読む。
import * as models   from './js/models/index.js';

export default Sogh;

export {
    ProjectV2Item,
    ProjectV2Items,
    ProjectsV2,
    ProjectV2Contents,
    ProjectV2Details,
    Repositories,
    PanelIssue,
    PanelIssueComments,
    TableProjectV2Items,
}

export {
    Issue,
    Label,
    Milestone,
    Repository,
}

export {
    models,
}

export {
    GitHubError,
}
