// GitHub につなぐスクリプト (check-live.mjs・check-updated-at.mjs) が、設定を読むための部品。
//
// 設定の置き場所:
//   1. 環境変数。(こちらが先に使われる)
//   2. 設定ファイル。(KEY=VALUE の行だけを読む。# の行と空の行は読み飛ばす)
//      ふだんは、リポジトリの直下の .env.local。
//      環境変数 CHECK_ENV_FILE があれば、そのパスのファイルを読む。
//      (worktree から動かすときに、別のフォルダの .env.local を読ませるため)
//
// 値は、どこにも表示しない。
import fs from 'node:fs';
import path from 'node:path';

// 設定ファイルの場所。
export function envFilePath (root) {
    if (process.env.CHECK_ENV_FILE)
        return path.resolve(process.env.CHECK_ENV_FILE);

    return path.join(root, '.env.local');
}

// 設定ファイルを読む。無ければ {}。
export function readEnvFile (file) {
    if (!fs.existsSync(file))
        return {};

    const out = {};

    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
        const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);

        if (m)
            out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }

    return out;
}

// CHECK_ENV_FILE で指定したファイルが無いときに、知らせる。(パスだけを出す。値は出さない)
export function warnMissingEnvFile (file) {
    if (process.env.CHECK_ENV_FILE && !fs.existsSync(file))
        console.error(`CHECK_ENV_FILE で指定した設定ファイルがありません: ${file}`);
}

// 設定の値を読む関数を作る。(環境変数が先。無ければ、設定ファイル。どちらにも無ければ null)
export function makeGetter (file) {
    const values = readEnvFile(file);

    return (key)=> process.env[key] || values[key] || null;
}
