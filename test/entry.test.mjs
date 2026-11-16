// パッケージの入口 (src/index.js) のテスト。
//   - GitHubError を、名前付きの export で出す。(yanqirenshi/SOGH.next#61)
//   - 入口の GitHubError と、asyncFetch〜 が投げる例外のクラスが、同じものである。
//   - ほかの export は、変わらない。
//
// 動かし方:
//   npm test
//
// 入口は、画面の部品 (src/components/ の JSX) も import する。
// JSX は Node でそのまま読めないので、このテストの中だけ、部品を「何もしない部品」に差し替えて読む。
// (部品の中身は、ここでは確かめない。モデル・Sogh・GitHubError は、本物を読む)

import test from 'node:test';
import assert from 'node:assert/strict';
import module from 'node:module';

import { GitHubError as LoaderGitHubError } from '../src/js/Loader.js';
import { fakeFetch, withFetch } from './fake-fetch.mjs';

const STUB = 'data:text/javascript,export default function Stub () { return null; }';

module.registerHooks({
    resolve (specifier, context, next) {
        if (specifier.startsWith('./components/') && context.parentURL && context.parentURL.endsWith('/src/index.js'))
            return { url: STUB, shortCircuit: true };

        return next(specifier, context);
    },
});

const entry = await import('../src/index.js');

test('入口から、GitHubError を名前付きの export で読める', ()=> {
    assert.equal(typeof entry.GitHubError, 'function');
    assert.equal(entry.GitHubError.name, 'GitHubError');

    const e = new entry.GitHubError('x', { status: 401 });

    assert.ok(e instanceof Error);
    assert.equal(e.name, 'GitHubError');
    assert.equal(e.status, 401);
});

test('入口の GitHubError は、Loader の GitHubError と同じクラス', ()=> {
    assert.equal(entry.GitHubError, LoaderGitHubError);
});

test('asyncFetch〜 が投げる例外は、入口の GitHubError で instanceof が通る', async ()=> {
    const Sogh = entry.default;
    const sogh = new Sogh();

    const fake = fakeFetch([{ json: { data: null, errors: [{ type: 'NOT_FOUND', message: 'Could not resolve to a node' }] } }]);

    await assert.rejects(withFetch(fake, ()=> sogh.asyncFetchIssueByID('I_1')), (e)=> {
        assert.ok(e instanceof entry.GitHubError);
        assert.equal(e.errors[0].type, 'NOT_FOUND');
        return true;
    });
});

test('入口の export は、前の名前に GitHubError を足しただけ', ()=> {
    assert.deepEqual(Object.keys(entry).sort(), [
        'Card', 'Column', 'GitHubError', 'Issue', 'Label', 'Milestone',
        'PanelIssue', 'PanelIssueComments', 'Project', 'ProjectV2Contents', 'ProjectV2Details',
        'ProjectV2Item', 'ProjectV2Items', 'ProjectsV2', 'Repositories', 'Repository',
        'TableProjectV2Items', 'default', 'models',
    ].sort());
});
