// check-updated-at.mjs の、GitHub につながない部分。(テストから読む)
//
//   parseTarget(text)          … 「owner/repo#番号」を読む。
//   toSnapshot(target, data)   … GraphQL の応答から、覚えるもの (スナップショット) を作る。
//   compareSnapshots(prev, curr) … 前の回と、いまのスナップショットを比べる。
//   formatReport(result)       … 比べた結果を、表示する行にする。
//
// スナップショットには、取得した値そのものは、なるべく入れない。
//   - id は、SHA-256 にした短い鍵にする。
//   - 関連の中身は、SHA-256 のダイジェストにする。
//   - updatedAt は、比べるために、そのまま入れる。(表示はしない)
//   - ProjectV2 の id だけは、そのまま入れる。(watch.projectIds)
//     Issue をプロジェクトから外すと、Issue から辿れなくなるので、次の回に、id で読み直すため。
//     スナップショットは OS の一時フォルダに置き、表示はしない。
import crypto from 'node:crypto';

export const SNAPSHOT_VERSION = 1;

// 新しい順に覚えるコメントの数。
export const COMMENT_COUNT = 5;

/* ****************************************************************
 * クエリ (読むだけ。値は variables で渡す)
 * **************************************************************** */

const FIELD = `field {
  ... on ProjectV2Field { name }
  ... on ProjectV2IterationField { name }
  ... on ProjectV2SingleSelectField { name }
}`;

const PROJECT = `id
updatedAt
items(first: 100) {
  totalCount
  nodes { id }
}`;

// 対象の Issue と、その関連を読む。
export const ISSUE_QUERY = `query ($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    updatedAt
    issue(number: $number) {
      updatedAt
      assignees(first: 50) { nodes { id } }
      labels(first: 50) { nodes { id } }
      milestone { id updatedAt }
      comments(last: ${COMMENT_COUNT}) {
        totalCount
        nodes { id updatedAt }
      }
      projectItems(first: 20) {
        nodes {
          id
          updatedAt
          fieldValues(first: 50) {
            totalCount
            nodes {
              __typename
              ... on ProjectV2ItemFieldTextValue { text ${FIELD} }
              ... on ProjectV2ItemFieldSingleSelectValue { name optionId ${FIELD} }
              ... on ProjectV2ItemFieldDateValue { date ${FIELD} }
              ... on ProjectV2ItemFieldNumberValue { number ${FIELD} }
              ... on ProjectV2ItemFieldIterationValue { title iterationId ${FIELD} }
              ... on ProjectV2ItemFieldUserValue { users(first: 50) { nodes { id } } ${FIELD} }
              ... on ProjectV2ItemFieldLabelValue { labels(first: 50) { nodes { id } } ${FIELD} }
              ... on ProjectV2ItemFieldMilestoneValue { milestone { id } ${FIELD} }
              ... on ProjectV2ItemFieldRepositoryValue { repository { id } ${FIELD} }
              ... on ProjectV2ItemFieldPullRequestValue { pullRequests(first: 50) { nodes { id } } ${FIELD} }
              ... on ProjectV2ItemFieldReviewerValue {
                reviewers(first: 50) {
                  nodes {
                    ... on User { id }
                    ... on Team { id }
                    ... on Mannequin { id }
                    ... on Bot { id }
                  }
                }
                ${FIELD}
              }
            }
          }
          project { ${PROJECT} }
        }
      }
    }
  }
}`;

// 前の回に覚えた ProjectV2 を、id で読み直す。
export const PROJECTS_QUERY = `query ($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ProjectV2 { ${PROJECT} }
  }
}`;

/* ****************************************************************
 * GitHub のエラー
 * **************************************************************** */

// GitHub の errors を、表示してよい形にする。
//   type があるもの (NOT_FOUND・FORBIDDEN など。対象が読めないときのもの) … type だけを出す。
//     (message には、対象の owner/repo や番号が入るので、出さない)
//   type が無いもの (クエリの書き方の誤りなど) … message を出す。(項目の名前が出るだけで、対象の値は出ない)
// 返す値:
//   notFound … NOT_FOUND があったか。(呼ぶ側が、見つからない、という文を出す)
//   text     … 表示する文。NOT_FOUND のほかに出すものが無ければ ''。
export function describeGitHubErrors (errors) {
    const list = Array.isArray(errors) ? errors : [];

    const not_found = list.some(e=> e && e.type === 'NOT_FOUND');

    const types = [...new Set(list.filter(e=> e && e.type && e.type !== 'NOT_FOUND').map(e=> String(e.type)))];
    const messages = [...new Set(list.filter(e=> e && !e.type).map(e=> String(e.message || '(文の無いエラー)')))];

    const parts = [
        ...types,
        ...messages.slice(0, 3),
    ];

    const rest = messages.length > 3 ? ` ほか ${messages.length - 3} 件` : '';

    return {
        notFound: not_found,
        text: parts.length > 0 ? `${parts.join(' / ')}${rest}` : '',
    };
}

/* ****************************************************************
 * 対象
 * **************************************************************** */

// 「owner/repo#番号」を読む。形が違うときは null。
export function parseTarget (text) {
    if (!text)
        return null;

    const m = /^\s*([A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)\/([A-Za-z0-9._-]+)#([1-9][0-9]*)\s*$/.exec(text);

    if (!m)
        return null;

    return { owner: m[1], name: m[2], number: Number(m[3]) };
}

/* ****************************************************************
 * ダイジェスト
 * **************************************************************** */

export function digest (value) {
    return crypto.createHash('sha256').update(JSON.stringify(value === undefined ? null : value)).digest('hex');
}

// id の代わりに使う、短い鍵。
export function keyOf (id) {
    return digest(id).slice(0, 16);
}

/* ****************************************************************
 * スナップショット
 * **************************************************************** */

const ids = (connection)=> ((connection && connection.nodes) || [])
      .filter(node=> node && node.id)
      .map(node=> node.id)
      .sort();

const idOf = (node)=> (node && node.id) ? node.id : null;

// fieldValues の箱を、比べられる形にする。(フィールドの名前の順に並べる)
function normalizeFieldValues (connection) {
    const nodes = (connection && connection.nodes) || [];

    const values = nodes
          .filter(node=> node && node.__typename)
          .map(node=> ({
              type:         node.__typename,
              field:        node.field ? (node.field.name || null) : null,
              text:         node.text ?? null,
              name:         node.name ?? null,
              optionId:     node.optionId ?? null,
              date:         node.date ?? null,
              number:       node.number ?? null,
              title:        node.title ?? null,
              iterationId:  node.iterationId ?? null,
              users:        node.users ? ids(node.users) : null,
              labels:       node.labels ? ids(node.labels) : null,
              milestone:    node.milestone !== undefined ? idOf(node.milestone) : null,
              repository:   node.repository !== undefined ? idOf(node.repository) : null,
              pullRequests: node.pullRequests ? ids(node.pullRequests) : null,
              reviewers:    node.reviewers ? ids(node.reviewers) : null,
          }));

    values.sort((a, b)=> `${a.field}\u0000${a.type}`.localeCompare(`${b.field}\u0000${b.type}`));

    return { totalCount: connection ? (connection.totalCount ?? null) : null, values };
}

// GraphQL の応答 (data) から、スナップショットを作る。
//   target  … 対象の指定の文字列。(「owner/repo#番号」。そのまま入れず、ダイジェストにする)
//   data    … { repository: { updatedAt, issue: {...} } }
//   watched … 前の回に見えていて、いまは Issue から辿れない ProjectV2 の node の配列。(id で読み直したもの)
export function toSnapshot (target, data, watched = []) {
    const repository = data.repository;
    const issue = repository.issue;

    const comments = (issue.comments && issue.comments.nodes) || [];
    const item_nodes = ((issue.projectItems && issue.projectItems.nodes) || []).filter(node=> node && node.id);

    const items = {};
    const projects = {};
    const project_ids = [];

    const addProject = (project, linked)=> {
        if (!project || !project.id || projects[keyOf(project.id)])
            return;

        project_ids.push(project.id);

        projects[keyOf(project.id)] = {
            order: Object.keys(projects).length + 1,
            // Issue の Item から辿れるか。(false は、id で読み直したもの)
            linked,
            updatedAt: project.updatedAt || null,
            relations: {
                items: digest({ totalCount: project.items ? (project.items.totalCount ?? null) : null, ids: ids(project.items) }),
            },
        };
    };

    item_nodes.forEach((item, i)=> {
        items[keyOf(item.id)] = {
            order: i + 1,
            updatedAt: item.updatedAt || null,
            relations: {
                fieldValues: digest(normalizeFieldValues(item.fieldValues)),
            },
        };

        addProject(item.project, true);
    });

    for (const project of watched)
        addProject(project, false);

    return {
        version: SNAPSHOT_VERSION,
        target: digest(target),
        watch: { projectIds: project_ids },
        issue: {
            updatedAt: issue.updatedAt || null,
            relations: {
                assignees:    digest(ids(issue.assignees)),
                labels:       digest(ids(issue.labels)),
                milestone:    digest(idOf(issue.milestone)),
                comments:     digest({ totalCount: issue.comments ? (issue.comments.totalCount ?? null) : null, ids: ids(issue.comments) }),
                projectItems: digest(ids(issue.projectItems)),
            },
        },
        comments: {
            totalCount: issue.comments ? (issue.comments.totalCount ?? 0) : 0,
            // 新しい順。(クエリは last で取るので、古い順に来る。逆にする)
            recent: comments
                .filter(node=> node && node.id)
                .reverse()
                .map((node, i)=> ({ key: keyOf(node.id), order: i + 1, updatedAt: node.updatedAt || null })),
        },
        items,
        projects,
        repository: { updatedAt: repository.updatedAt || null },
        milestone: issue.milestone && issue.milestone.id
            ? { key: keyOf(issue.milestone.id), updatedAt: issue.milestone.updatedAt || null }
            : null,
    };
}

/* ****************************************************************
 * 比べる
 * **************************************************************** */

const MOVED = '動いた';
const STILL = '動かない';
const CHANGED = '変わった';
const SAME = '変わらない';
const NONE = '-';

function compareUpdatedAt (prev, curr) {
    if (!prev || !curr)
        return NONE;

    return prev === curr ? STILL : MOVED;
}

// 関連のダイジェストを比べて、変わった関連の名前を返す。
function changedRelations (prev, curr) {
    const names = [...new Set([...Object.keys(prev || {}), ...Object.keys(curr || {})])];

    return names.filter(name=> (prev || {})[name] !== (curr || {})[name]);
}

// 1 つの対象の行を作る。
function row (label, prev, curr) {
    const updated_at = compareUpdatedAt(prev.updatedAt, curr.updatedAt);

    let relations = NONE;
    let changed = [];

    if (prev.relations || curr.relations) {
        changed = changedRelations(prev.relations, curr.relations);
        relations = changed.length > 0 ? `${CHANGED} (${changed.join(', ')})` : SAME;
    }

    return {
        label,
        updatedAt: updated_at,
        relations,
        changed,
        // 見つけたいもの: 関連が変わったのに、updatedAt が動いていない。
        alert: changed.length > 0 && updated_at === STILL,
    };
}

// 増えた・減ったを見る対象 (Item・ProjectV2) を比べる。
function compareGroup (name, prev, curr, rows, notes) {
    const curr_keys = Object.keys(curr).sort((a, b)=> curr[a].order - curr[b].order);
    const prev_keys = Object.keys(prev).sort((a, b)=> prev[a].order - prev[b].order);

    for (const key of curr_keys) {
        // Issue の Item から辿れなくなった ProjectV2 は、そうと分かるようにする。
        const label = `${name} ${curr[key].order}${curr[key].linked === false ? ' (外)' : ''}`;

        if (prev[key])
            rows.push(row(label, prev[key], curr[key]));
        else
            notes.push(`${label} が増えた。`);

        if (prev[key] && prev[key].linked !== false && curr[key].linked === false)
            notes.push(`${name} ${curr[key].order} は、Issue の Item から辿れなくなった。(前の回に覚えた id で読み直して、比べた)`);
    }

    for (const key of prev_keys)
        if (!curr[key])
            notes.push(`${name} が 1 つ減った。(前の回の ${name} ${prev[key].order})`);
}

// 前の回と、いまのスナップショットを比べる。
//   { compared: false, reason }  … 比べなかったとき。(前の回が無い・対象が違う・形が違う)
//   { compared: true, rows, notes } … 比べたとき。
export function compareSnapshots (prev, curr) {
    if (!prev)
        return { compared: false, reason: 'none' };

    if (prev.version !== curr.version)
        return { compared: false, reason: 'version' };

    if (prev.target !== curr.target)
        return { compared: false, reason: 'target' };

    const rows = [];
    const notes = [];

    rows.push(row('Issue', prev.issue, curr.issue));

    compareGroup('Item', prev.items, curr.items, rows, notes);
    compareGroup('ProjectV2', prev.projects, curr.projects, rows, notes);

    rows.push(row('Repository', prev.repository, curr.repository));

    if (!prev.milestone && curr.milestone)
        notes.push('Milestone が付いた。');
    else if (prev.milestone && !curr.milestone)
        notes.push('Milestone が外れた。');
    else if (prev.milestone && curr.milestone) {
        if (prev.milestone.key === curr.milestone.key)
            rows.push(row('Milestone', prev.milestone, curr.milestone));
        else
            notes.push('Milestone が、別の Milestone に変わった。');
    }

    // コメント
    const diff = curr.comments.totalCount - prev.comments.totalCount;

    if (diff > 0)
        notes.push(`コメントが ${diff} 件増えた。`);
    else if (diff < 0)
        notes.push(`コメントが ${-diff} 件減った。`);
    else
        notes.push('コメントの数は、変わらない。');

    const prev_comments = new Map(prev.comments.recent.map(c=> [c.key, c]));

    for (const comment of curr.comments.recent) {
        const before = prev_comments.get(comment.key);

        if (before)
            rows.push(row(`コメント ${comment.order}`, before, comment));
    }

    return { compared: true, rows, notes };
}

/* ****************************************************************
 * 表示
 * **************************************************************** */

const ALERT = '← 関連が変わったのに、updatedAt が動いていない';

// 表示の幅をそろえる。(全角は 2 として数える)
function width (text) {
    let w = 0;

    for (const ch of text)
        w += /[\u0000-ÿ]/.test(ch) ? 1 : 2;

    return w;
}

function pad (text, size) {
    return text + ' '.repeat(Math.max(1, size - width(text)));
}

// 比べた結果を、表示する行の配列にする。
export function formatReport (result) {
    if (!result.compared) {
        const reasons = {
            none:    '前の回の記録が無いので、いまの状態を覚えました。(比べていません)',
            target:  '対象の Issue が、前の回と違うので、比べずに、いまの状態を覚え直しました。',
            version: '前の回の記録の形が古いので、比べずに、いまの状態を覚え直しました。',
            reset:   '--reset なので、比べずに、いまの状態を覚え直しました。',
        };

        return [reasons[result.reason] || '比べずに、いまの状態を覚えました。'];
    }

    const lines = [];

    lines.push(`${pad('対象', 20)}${pad('updatedAt', 12)}関連`);

    for (const r of result.rows) {
        const line = `${pad(r.label, 20)}${pad(r.updatedAt, 12)}${r.relations}`;

        lines.push(r.alert ? `${pad(line, 64)}${ALERT}` : line);
    }

    if (result.rows.some(r=> r.label.endsWith('(外)'))) {
        lines.push('');
        lines.push('(外) … Issue の Item からは辿れなくなった ProjectV2。前の回に覚えた id で読み直した。');
    }

    if (result.notes.length > 0) {
        lines.push('');

        for (const note of result.notes)
            lines.push(note);
    }

    const alerts = result.rows.filter(r=> r.alert).length;

    lines.push('');
    lines.push(alerts > 0
               ? `関連が変わったのに、updatedAt が動いていない対象: ${alerts} 件`
               : '関連が変わったのに、updatedAt が動いていない対象は、ありません。');

    return lines;
}

// いまのスナップショットの、件数だけの説明。(覚えただけのときに出す)
export function describeSnapshot (snapshot) {
    return `覚えたもの: Issue 1 件・Item ${Object.keys(snapshot.items).length} 件・ProjectV2 ${Object.keys(snapshot.projects).length} 件・`
        + `コメント (新しい順) ${snapshot.comments.recent.length} 件・Milestone ${snapshot.milestone ? 1 : 0} 件。`;
}
