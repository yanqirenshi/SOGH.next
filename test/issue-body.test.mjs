// Issue の本文の注釈のテスト。
//   - 使われていなかった this.regex は、消した。(yanqirenshi/SOGH.next#95)
//   - 本文を読むメソッドの中の正規表現 (小数の点数も読む) は、変わらない。
//
// 動かし方:
//   npm test
//
// GitHub には、つながない。

import test from 'node:test';
import assert from 'node:assert/strict';

import Sogh from '../src/js/Sogh.js';

const T1 = '2026-11-01T09:00:00Z';

const issueOf = (body)=> new Sogh().node2issue({ __typename: 'Issue', id: 'I_1', body, updatedAt: T1 });

test('Issue に regex は無い', ()=> {
    const issue = issueOf('$Point.Plan 3');

    assert.equal('regex' in issue, false);
});

test('$Point.Plan・$Point.Result は、小数も読める', ()=> {
    const issue = issueOf('$Point.Plan 2.5\n$Point.Result 1.5');

    assert.equal(issue.pointPlansTotal(), 2.5);
    assert.equal(issue.pointResultTotal(), 1.5);
    assert.deepEqual(issue.points(), { plan: 2.5, result: 1.5, results: null });
});

test('$Point.Result <人> <日付> <点> の行は、小数も足し合わせる', ()=> {
    const issue = issueOf([
        '$Point.Result alice 2026-11-01 1.5',
        '$Point.Result bob 2026-11-02 2',
    ].join('\n'));

    assert.equal(issue.pointResultTotal(), 3.5);
    assert.deepEqual(issue.points().results.details, [
        { parson: 'alice', date: '2026-11-01', point: 1.5 },
        { parson: 'bob',   date: '2026-11-02', point: 2 },
    ]);
});

test('$Point.Plan <人> <日付> <点> の行も、小数を読める (getPointPlansFromBody)', ()=> {
    const issue = issueOf('');

    const plans = issue.getPointPlansFromBody('$Point.Plan alice 2026-11-01 0.5\n$Point.Plan bob 2026-11-03 1');

    assert.equal(plans.total, 1.5);
    assert.deepEqual(plans.details.map(d=> d.point), [0.5, 1]);
});

test('本文の日付と $Owner は、いままでどおり読める', ()=> {
    const issue = issueOf('$Owner alice\n$Date.Due 2026-11-30\n$Date.Next 2026-11-05');

    assert.equal(issue.bodyOwner(), 'alice');
    assert.equal(issue.getDueDateFromBody(issue.body()), '2026-11-30');
    assert.equal(issue.getNextActionFromBody(issue.body()), '2026-11-05');
    assert.equal(issue.getDueDateFromBody('$Due.Date 2026-12-01'), '2026-12-01');
});
