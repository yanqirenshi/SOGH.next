// scripts/env-file.mjs (GitHub につなぐスクリプトが、設定を読む部品) のテスト。
//
// 動かし方:
//   npm test
//
// 一時フォルダに、にせの設定ファイルを作って読む。(リポジトリの .env.local は読まない)
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { envFilePath, readEnvFile, makeGetter } from '../scripts/env-file.mjs';

function withEnv (values, fn) {
    const saved = {};

    for (const [key, value] of Object.entries(values)) {
        saved[key] = process.env[key];

        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
    }

    try {
        return fn();
    } finally {
        for (const [key, value] of Object.entries(saved)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }
}

// 一時フォルダに、にせの設定ファイルを作る。(テストが終わったら、フォルダごと消す)
const temp_dirs = [];

test.after(()=> {
    for (const dir of temp_dirs)
        fs.rmSync(dir, { recursive: true, force: true });
});

function tempFile (text) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sogh-env-file-test-'));
    const file = path.join(dir, 'test.env');

    temp_dirs.push(dir);
    fs.writeFileSync(file, text);

    return file;
}

test('envFilePath: ふだんはリポジトリの直下の .env.local。CHECK_ENV_FILE があれば、そのパス', ()=> {
    const root = path.resolve('repo-root');

    withEnv({ CHECK_ENV_FILE: undefined }, ()=> {
        assert.equal(envFilePath(root), path.join(root, '.env.local'));
    });

    withEnv({ CHECK_ENV_FILE: 'other/place.env' }, ()=> {
        assert.equal(envFilePath(root), path.resolve('other/place.env'));
    });
});

test('readEnvFile: KEY=VALUE の行だけを読む。無いファイルは {}', ()=> {
    const file = tempFile('# コメント\n\nA_KEY=one\r\nB_KEY = "two" \nlower=skip\nC_KEY=\n');

    assert.deepEqual(readEnvFile(file), { A_KEY: 'one', B_KEY: 'two', C_KEY: '' });
    assert.deepEqual(readEnvFile(path.join(path.dirname(file), 'none.env')), {});
});

test('makeGetter: 環境変数が先。無ければ設定ファイル。どちらにも無ければ null', ()=> {
    const file = tempFile('SOGH_TEST_A=from-file\nSOGH_TEST_B=from-file\nSOGH_TEST_C=\n');

    withEnv({ SOGH_TEST_A: 'from-env', SOGH_TEST_B: undefined, SOGH_TEST_C: undefined, SOGH_TEST_D: undefined }, ()=> {
        const get = makeGetter(file);

        assert.equal(get('SOGH_TEST_A'), 'from-env');
        assert.equal(get('SOGH_TEST_B'), 'from-file');
        assert.equal(get('SOGH_TEST_C'), null);
        assert.equal(get('SOGH_TEST_D'), null);
    });
});
