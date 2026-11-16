// npm に公開するパッケージに、入るファイルを確かめる。(yanqirenshi/SOGH.next#54)
//
// 使い方:
//   npm run transpile    … 先にビルドする。(dist/ を作る)
//   npm run check:pack
//
//   npm publish のときは、prepublishOnly が「ビルド → check:pack」の順に動かす。失敗したら、公開は止まる。
//
// 確かめること (失敗にする条件。どれかがあれば、終了コードを 1 にする):
//   1. 入ってよいもの (dist/ の下・package.json・README.org・LICENSE・CHANGELOG.md) のほかが、入っている。
//   2. 名前に .env を含むファイルが、入っている。(dist/ の下でも)
//   3. dist/index.js が、入っていない。(ビルドしていない)
//
// 作り:
//   `npm pack --dry-run --json --ignore-scripts` の結果を読む。パッケージは作らない。ファイルの中身は読まない。
//   npm pack は prepublishOnly を動かさない。--ignore-scripts で、prepack・prepare なども動かさない。
//   (そのため、prepublishOnly から check:pack を呼んでも、ぐるぐる回らない)
//
// 表示するのは、入るファイルの数と、問題のあったファイルの名前だけ。
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkPackFiles, parsePackJson, formatPackReport } from './pack-files.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ARGS = ['pack', '--dry-run', '--json', '--ignore-scripts'];

// npm を子プロセスで呼ぶ。
//   npm run から動かしたときは、npm_execpath (npm-cli.js) を、いまの node で動かす。(Windows でも、シェルを通さずに動く)
//   それ以外のときは、シェルで npm を呼ぶ。(Windows では npm.cmd なので、シェルを通す必要がある)
//   引数は、決まった文字列 (ARGS) だけなので、1 本のコマンドにして渡す。
function runNpmPack () {
    const npm_cli = process.env.npm_execpath;

    if (npm_cli && /\.c?js$/.test(npm_cli))
        return spawnSync(process.execPath, [npm_cli, ...ARGS], { cwd: ROOT, encoding: 'utf8' });

    return spawnSync(`npm ${ARGS.join(' ')}`, { cwd: ROOT, encoding: 'utf8', shell: true });
}

function main () {
    const result = runNpmPack();

    if (result.error || result.status !== 0) {
        console.error('npm pack --dry-run を動かせませんでした。');

        if (result.error)
            console.error(result.error.message);
        else if (result.stderr)
            console.error(result.stderr.trim().split(/\r?\n/).slice(-5).join('\n'));

        process.exitCode = 1;
        return;
    }

    const paths = parsePackJson(result.stdout);

    if (!paths) {
        console.error('npm pack --dry-run の結果を読めませんでした。');
        process.exitCode = 1;
        return;
    }

    const checked = checkPackFiles(paths);

    for (const line of formatPackReport(checked))
        (checked.ok ? console.log : console.error)(line);

    process.exitCode = checked.ok ? 0 : 1;
}

main();
