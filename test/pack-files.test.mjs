// check-pack.mjs の、npm を呼ばない部分 (scripts/pack-files.mjs) のテスト。(yanqirenshi/SOGH.next#54)
//
// 動かし方:
//   npm test
//
// にせのファイルの一覧で確かめる。(npm は呼ばない)
import test from 'node:test';
import assert from 'node:assert/strict';

import { checkPackFiles, parsePackJson, formatPackReport } from '../scripts/pack-files.mjs';

const GOOD = [
    'CHANGELOG.md',
    'LICENSE',
    'README.org',
    'package.json',
    'dist/index.js',
    'dist/js/Sogh.js',
    'dist/js/models/Issue.js',
];

test('入ってよいものだけなら、OK', ()=> {
    const r = checkPackFiles(GOOD);

    assert.deepEqual(r, { ok: true, count: 7, problems: [] });
    assert.match(formatPackReport(r).join('\n'), /パッケージに入るファイル: 7 個\nOK/);
});

test('入ってよいもののほかが入っていたら、NG で、名前を出す', ()=> {
    const r = checkPackFiles([...GOOD, 'hub/package.json', 'scripts/check-live.mjs', 'test/merge.test.mjs', '.claude/launch.json', 'src/index.js', 'README.md']);

    assert.equal(r.ok, false);
    assert.deepEqual(r.problems.map(p=> p.path), ['hub/package.json', 'scripts/check-live.mjs', 'test/merge.test.mjs', '.claude/launch.json', 'src/index.js', 'README.md']);
    assert.ok(r.problems.every(p=> p.reason === 'not-allowed'));

    const text = formatPackReport(r).join('\n');

    assert.match(text, /NG: 問題のあるファイルが 6 個/);
    assert.match(text, /scripts\/check-live\.mjs  … 入れるつもりの無いファイル/);
});

test('名前に .env を含むファイルは、dist/ の下でも NG', ()=> {
    const r = checkPackFiles([...GOOD, '.env.local', '.env.local~', 'dist/.env', 'dist/js/x.ENV.js', '.env.local.template']);

    assert.equal(r.ok, false);
    assert.deepEqual(r.problems.map(p=> [p.path, p.reason]), [
        ['.env.local', 'env'],
        ['.env.local~', 'env'],
        ['dist/.env', 'env'],
        ['dist/js/x.ENV.js', 'env'],
        ['.env.local.template', 'env'],
    ]);
    assert.match(formatPackReport(r).join('\n'), /\.env\.local  … 名前に \.env を含むファイル/);
});

test('dist/index.js が無ければ NG (ビルドしていない)', ()=> {
    const r = checkPackFiles(['package.json', 'README.org', 'LICENSE', 'CHANGELOG.md']);

    assert.equal(r.ok, false);
    assert.deepEqual(r.problems, [{ path: 'dist/index.js', reason: 'missing' }]);
    assert.match(formatPackReport(r).join('\n'), /dist\/index\.js  … 無い/);
});

test('パスの区切りが \\ でも、./ が付いていても、同じに扱う', ()=> {
    const r = checkPackFiles(['package.json', './README.org', 'LICENSE', 'CHANGELOG.md', 'dist\\index.js', 'dist\\js\\Sogh.js']);

    assert.equal(r.ok, true);
});

test('npm pack --dry-run --json の出力から、ファイルの一覧を読む', ()=> {
    const json = JSON.stringify([{ name: 'sogh', version: '0.4.2', files: [{ path: 'package.json', size: 1 }, { path: 'dist/index.js', size: 2 }] }], null, 2);

    assert.deepEqual(parsePackJson(json), ['package.json', 'dist/index.js']);
    assert.deepEqual(parsePackJson(`npm warn something\n${json}`), ['package.json', 'dist/index.js']);

    assert.equal(parsePackJson(''), null);
    assert.equal(parsePackJson('not json'), null);
    assert.equal(parsePackJson('[ broken'), null);
    assert.equal(parsePackJson('[{"name":"x"}]'), null);
});
