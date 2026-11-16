// 同じ id の node を重ねる動き (GraphQLNode の merge(node) と、Pool の ensure) のテスト。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。にせの node を Pool に入れて確かめる。
import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';
import GraphQLNode from '../src/js/models/GraphQLNode.js';

const T1 = '2026-11-01T09:00:00Z';
const T2 = '2026-11-02T09:00:00Z';

const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/* ****************************************************************
 * 場合分け
 * **************************************************************** */

test('手元に無いときは、新しく作る。reload は入れない', ()=> {
    const sogh = new Sogh();

    const user = sogh.node2user({ id: 'U_1', login: 'octocat', updatedAt: T1 });

    assert.equal(user.login(), 'octocat');
    assert.equal(user.reload(), null);
    assert.equal(sogh.user('U_1'), user);
});

test('来たほうが新しいときは、来た項目を重ねて、reload に日時を入れる', ()=> {
    const sogh = new Sogh();

    const user = sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Old', email: 'octo@example.com', updatedAt: T1 });
    const again = sogh.node2user({ id: 'U_1', login: 'octocat', name: 'New', updatedAt: T2 });

    assert.equal(again, user, 'モデルは、同じものが残る');
    assert.equal(user.name(), 'New', '来た項目は、重ねる');
    assert.equal(user.email(), 'octo@example.com', '来ていない項目は、残る');
    assert.equal(user.updatedAt(), T2);
    assert.match(user.reload(), ISO);
});

test('日時が同じときは、手元に無い項目だけ足す。reload は入れない', ()=> {
    const sogh = new Sogh();

    const user = sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Held', updatedAt: T1 });

    sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Came', email: 'octo@example.com', updatedAt: T1 });

    assert.equal(user.name(), 'Held', '手元にある項目は、上書きしない');
    assert.equal(user.email(), 'octo@example.com', '手元に無い項目は、足す');
    assert.equal(user.reload(), null);
});

test('来たほうが古いときは、手元に無い項目だけ足す。reload は入れない', ()=> {
    const sogh = new Sogh();

    const user = sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Newer', updatedAt: T2 });

    sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Older', email: 'octo@example.com', updatedAt: T1 });

    assert.equal(user.name(), 'Newer', '手元の値は、上書きしない');
    assert.equal(user.email(), 'octo@example.com', '手元に無い項目は、足す');
    assert.equal(user.updatedAt(), T2, '日時は、新しいほうのまま');
    assert.equal(user.reload(), null);
});

test('来た node に updatedAt が無いときは、毎回重ねる。reload は入れない', ()=> {
    const sogh = new Sogh();

    const user = sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Held', updatedAt: T1 });

    sogh.node2user({ id: 'U_1', login: 'octocat', name: 'Came' });

    assert.equal(user.name(), 'Came');
    assert.equal(user.updatedAt(), T1, '来ていない updatedAt は、残る');
    assert.equal(user.reload(), null);
});

test('updatedAt が null のときも、毎回重ねる。reload は入れない', ()=> {
    const node = new GraphQLNode({ id: 'L_1', name: 'bug', color: 'ff0000', updatedAt: null });

    assert.equal(node.merge({ id: 'L_1', name: 'bug', color: '00ff00', updatedAt: null }), 'always');
    assert.equal(node.core().color, '00ff00');
    assert.equal(node.reload(), null);
});

test('手元の core に updatedAt が無いときも、毎回重ねる', ()=> {
    const node = new GraphQLNode({ id: 'U_1', name: 'Held' });

    assert.equal(node.merge({ id: 'U_1', name: 'Came', updatedAt: T1 }), 'always');
    assert.equal(node.core().name, 'Came');
    assert.equal(node.updatedAt(), T1);
    assert.equal(node.reload(), null);
});

/* ****************************************************************
 * 細部
 * **************************************************************** */

test('重ねる単位は、一番上の項目。入れ子の中身までは重ねない', ()=> {
    const node = new GraphQLNode({ id: 'I_1', owner: { id: 'U_1', login: 'octocat', name: 'Octo' }, updatedAt: T1 });

    node.merge({ id: 'I_1', owner: { id: 'U_1', login: 'octocat' }, updatedAt: T2 });

    assert.deepEqual(node.core().owner, { id: 'U_1', login: 'octocat' });
});

test('来た値が null の項目は、null で重ねる。来ていない項目 (undefined) は、触らない', ()=> {
    const node = new GraphQLNode({ id: 'I_1', closedAt: T1, title: 'Held', updatedAt: T1 });

    node.merge({ id: 'I_1', closedAt: null, title: undefined, updatedAt: T2 });

    assert.equal(node.core().closedAt, null);
    assert.equal(node.core().title, 'Held');
});

test('merge は、何をしたかを返す', ()=> {
    const node = new GraphQLNode({ id: 'U_1', name: 'A', updatedAt: T1 });

    // reload が無いあいだ。
    assert.equal(node.merge({ id: 'U_1', email: 'a@example.com', updatedAt: T1 }), 'filled');
    assert.equal(node.merge({ id: 'U_1', name: 'B', updatedAt: T1 }), 'kept');

    // 来たほうが新しい。(ここで、reload が入る)
    assert.equal(node.merge({ id: 'U_1', name: 'C', updatedAt: T2 }), 'newer');

    // reload が入ったあと。
    assert.equal(node.merge({ id: 'U_1', name: 'D', updatedAt: T2 }), 'same');
    assert.equal(node.merge({ id: 'U_1', name: 'E', updatedAt: T1 }), 'kept', '来たほうが古いときは、reload があっても、重ねない');

    assert.equal(node.merge({ id: 'U_1', name: 'F' }), 'always');
    assert.equal(node.merge(null), 'kept');
});

test('何も重ねなかったときは、core を作り直さない', ()=> {
    const node = new GraphQLNode({ id: 'U_1', name: 'A', updatedAt: T1 });
    const core = node.core();

    node.merge({ id: 'U_1', name: 'B', updatedAt: T1 });

    assert.equal(node.core(), core);
});

test('reload は、読み書きできる', ()=> {
    const node = new GraphQLNode({ id: 'U_1' });

    assert.equal(node.reload(), null);
    assert.equal(node.reload(T1), T1);
    assert.equal(node.reload(null), null);
});

/* ****************************************************************
 * 値が消えないこと (重ね方を変える前に、起きていた問題)
 * **************************************************************** */

test('viewer が owner のリポジトリを入れても、viewer の値は消えない', ()=> {
    const sogh = new Sogh();

    const viewer = sogh.node2user({
        id: 'U_1', login: 'octocat', name: 'The Octocat', email: 'octo@example.com', company: 'GitHub', updatedAt: T1,
    });

    sogh.viewer(viewer);

    // リポジトリの owner は、email・company を取らない。(型が複数ある場所のため)
    sogh.node2repository({
        id: 'R_1', name: 'hello', updatedAt: T1,
        owner: { __typename: 'User', id: 'U_1', login: 'octocat', resourcePath: '/octocat', updatedAt: T1 },
    });

    assert.equal(sogh.viewer().name(), 'The Octocat');
    assert.equal(sogh.viewer().email(), 'octo@example.com');
    assert.equal(sogh.viewer().company(), 'GitHub');
    assert.equal(sogh.viewer().core().resourcePath, '/octocat', '手元に無い項目は、足す');
});

test('本文の無い Issue を重ねても、本文と注釈は消えない', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ id: 'I_1', title: 't', body: '$Owner foo\n$Point.Plan 3', updatedAt: T1 });

    // ProjectV2Item の content の形。(本文が無い)
    sogh.node2issue({ id: 'I_1', title: 't', number: 1, updatedAt: T1 });

    assert.equal(issue.body(), '$Owner foo\n$Point.Plan 3');
    assert.equal(issue.owner(), 'foo');
    assert.equal(issue.pointPlansTotal(), 3);
    assert.equal(issue.number(), 1, '手元に無い項目は、足す');
});

/* ****************************************************************
 * 注釈の読み取り直し
 * **************************************************************** */

test('Issue は、新しい本文を重ねると、注釈を読み取り直す', ()=> {
    const sogh = new Sogh();

    const issue = sogh.node2issue({ id: 'I_1', body: '$Owner foo\n$Point.Plan 3', updatedAt: T1 });

    sogh.node2issue({ id: 'I_1', body: '$Owner bar\n$Point.Plan 5', updatedAt: T2 });

    assert.equal(issue.owner(), 'bar');
    assert.equal(issue.pointPlansTotal(), 5);
    assert.match(issue.reload(), ISO);
});

test('ProjectV2 は、新しい README を重ねると、注釈を読み取り直す', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({ id: 'PVT_1', number: 1, readme: '$Priority: h\n$Owner: foo', updatedAt: T1 });

    assert.equal(project.priority(), 'h');
    assert.equal(project.owner(), 'foo');

    sogh.node2projectV2({ id: 'PVT_1', number: 1, readme: '$Priority: l\n$Owner: bar', updatedAt: T2 });

    assert.equal(project.priority(), 'l');
    assert.equal(project.owner(), 'bar');
});

test('ProjectV2 は、README の無い node (参照の組) を重ねても、注釈は消えない', ()=> {
    const sogh = new Sogh();

    const project = sogh.node2projectV2({ id: 'PVT_1', number: 1, title: 'Old', readme: '$Priority: h', updatedAt: T1 });

    sogh.node2projectV2({ id: 'PVT_1', number: 1, title: 'New', updatedAt: T2 });

    assert.equal(project.title(), 'New');
    assert.equal(project.priority(), 'h');
});

/* ****************************************************************
 * 日時が同じで、reload が入っているとき (yanqirenshi/SOGH.next#34)
 * **************************************************************** */

test('項目の少ない新しい node を重ねたあとで、同じ日時の node が来たら、重ねる', ()=> {
    const sogh = new Sogh();

    // 本文つきの Issue (T1) を持っている。
    const issue = sogh.node2issue({ id: 'I_1', title: 'Old', body: 'old body', updatedAt: T1 });

    // GitHub で本文が変わったあと (T2)、本文の無い Issue が来る。
    sogh.node2issue({ id: 'I_1', title: 'New', updatedAt: T2 });

    assert.equal(issue.title(), 'New');
    assert.equal(issue.body(), 'old body', '本文は来ていないので、まだ古い');
    assert.match(issue.reload(), ISO, 'GitHub 側の変更を重ねたので、reload が入る');

    // 本文つきの Issue (T2) を取り直す。日時は同じだが、reload が入っているので、重ねる。
    sogh.node2issue({ id: 'I_1', title: 'New', body: 'new body', updatedAt: T2 });

    assert.equal(issue.body(), 'new body');
});

test('日時が同じで、reload が入っているときは、来た項目を重ねる。reload は変えない', ()=> {
    const node = new GraphQLNode({ id: 'U_1', name: 'Held', email: 'held@example.com', updatedAt: T1 });

    node.reload(T2);

    node.merge({ id: 'U_1', name: 'Came', updatedAt: T1 });

    assert.equal(node.core().name, 'Came', '来た項目は、重ねる');
    assert.equal(node.core().email, 'held@example.com', '来ていない項目は、残る');
    assert.equal(node.reload(), T2);
});

test('来たほうが古いときは、reload が入っていても、手元に無い項目だけ足す', ()=> {
    const node = new GraphQLNode({ id: 'U_1', name: 'Held', updatedAt: T2 });

    node.reload(T2);

    node.merge({ id: 'U_1', name: 'Came', email: 'came@example.com', updatedAt: T1 });

    assert.equal(node.core().name, 'Held');
    assert.equal(node.core().email, 'came@example.com');
});

/* ****************************************************************
 * 日時が同じでも、Issue の projectItems は、中身が違えば重ねる (yanqirenshi/SOGH.next#51)
 * **************************************************************** */

// Issue の projectItems の JSON を作る。(edges の形。Issue のクエリと同じ)
//   items … [[Item の id, Due.Date の値], ...]
function projectItems (items) {
    return {
        edges: items.map(([id, due])=> ({
            node: {
                __typename: 'ProjectV2Item',
                id,
                updatedAt: T1,
                fieldValues: {
                    nodes: [
                        { __typename: 'ProjectV2ItemFieldDateValue', date: due, field: { name: 'Due.Date', dataType: 'DATE' } },
                    ],
                },
            },
        })),
    };
}

const issueNode = (patch = {})=> ({
    __typename: 'Issue',
    id: 'I_1',
    title: 'もとの題名',
    updatedAt: T1,
    projectItems: projectItems([['PVTI_1', '2026-11-20']]),
    ...patch,
});

test('日時が同じで、projectItems の Item が増えたときは、重ねる', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    sogh.node2issue(issueNode({ projectItems: projectItems([['PVTI_1', '2026-11-20'], ['PVTI_2', '2026-12-01']]) }));

    assert.deepEqual(issue.projectV2Items().map(item=> item.id()), ['PVTI_1', 'PVTI_2']);
    assert.equal(issue.reload(), null, 'reload は変えない');
});

test('日時が同じで、projectItems の Item が減った (プロジェクトから外した) ときは、重ねる', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    sogh.node2issue(issueNode({ projectItems: projectItems([]) }));

    assert.deepEqual(issue.projectV2Items(), []);
    assert.equal(issue.projectV2(), null);
});

test('日時が同じで、projectItems の入れ子の fieldValues の値が変わったときは、重ねる。JSON を直に読むメソッドも新しい値を返す', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    assert.equal(issue.dueDate(), '2026-11-20');

    sogh.node2issue(issueNode({ projectItems: projectItems([['PVTI_1', '2026-12-24']]) }));

    assert.equal(issue.dueDate(), '2026-12-24');
    assert.equal(issue.getFieldValueByName('Due.Date').date, '2026-12-24');
    assert.equal(issue.fieldValueContents('Due.Date').value.date, '2026-12-24');
});

test('日時が同じで、projectItems を重ねたときは、merge が refreshed を返す', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    assert.equal(issue.merge(issueNode({ projectItems: projectItems([]) })), 'refreshed');

    // 手元に無い項目も一緒に来たときも、上書きしたことを優先して refreshed。
    assert.equal(issue.merge(issueNode({ body: '本文', projectItems: projectItems([['PVTI_3', null]]) })), 'refreshed');
    assert.equal(issue.body(), '本文');
});

test('日時が同じで、projectItems の中身が同じときは、重ねない。core を作り直さない', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    const core = issue.core();

    // 中身が同じ。(項目を取った順番が違っても、同じとみなす)
    const same = issueNode();
    const node = same.projectItems.edges[0].node;

    same.projectItems.edges[0].node = { fieldValues: node.fieldValues, updatedAt: node.updatedAt, id: node.id, __typename: node.__typename };

    assert.equal(issue.merge(same), 'kept');
    assert.equal(issue.core(), core);
});

test('日時が同じで、来た node に projectItems が無いときは、手元の projectItems が残る', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    const came = issueNode();

    delete came.projectItems;

    assert.equal(issue.merge(came), 'kept');
    assert.deepEqual(issue.projectV2Items().map(item=> item.id()), ['PVTI_1']);
    assert.equal(issue.dueDate(), '2026-11-20');
});

test('来たほうが古いときは、projectItems の中身が違っても、重ねない', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode({ updatedAt: T2 }));

    assert.equal(issue.merge(issueNode({ updatedAt: T1, projectItems: projectItems([]) })), 'kept');
    assert.deepEqual(issue.projectV2Items().map(item=> item.id()), ['PVTI_1']);
});

test('日時が同じなら、Issue のほかの項目 (title など) は、これまでどおり上書きしない', ()=> {
    const sogh = new Sogh();
    const issue = sogh.node2issue(issueNode());

    sogh.node2issue(issueNode({ title: '新しい題名', projectItems: projectItems([]) }));

    assert.equal(issue.title(), 'もとの題名');
    assert.deepEqual(issue.projectV2Items(), [], 'projectItems だけは重なる');
});

test('Issue でないモデル (ProjectV2 の items) は、日時が同じなら、これまでどおり上書きしない', ()=> {
    const sogh = new Sogh();

    const items = (ids)=> ({ edges: ids.map(id=> ({ node: { __typename: 'ProjectV2Item', id, updatedAt: T1 } })) });

    const project = sogh.node2projectV2({ __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1, items: items(['PVTI_1']) });

    assert.equal(project.merge({ __typename: 'ProjectV2', id: 'PVT_1', updatedAt: T1, items: items(['PVTI_1', 'PVTI_2']) }), 'kept');
    assert.deepEqual(project.items().map(item=> item.id()), ['PVTI_1']);
    assert.deepEqual(project.sameTimeKeys(), []);
});

test('手元に projectItems が無いときは、これまでどおり、手元に無い項目として足す', ()=> {
    const sogh = new Sogh();

    const first = issueNode();

    delete first.projectItems;

    const issue = sogh.node2issue(first);

    const came = issueNode();

    // node2issue と同じく、先に Matchmaker で、入れ子の Item を Pool に入れる。
    sogh.matchmaker.issue(came);

    assert.equal(issue.merge(came), 'filled');
    assert.deepEqual(issue.projectV2Items().map(item=> item.id()), ['PVTI_1']);
});
