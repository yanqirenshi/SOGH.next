// GitHub に実際につないで、updatedAt が、どの変更で動くかを確かめる。(yanqirenshi/SOGH.next#51)
//
// Pool は、同じ id の node が来たとき、updatedAt を比べて、重ねるかどうかを決める。
// 関連は、親の core の JSON に持っているので、「関連が変わったのに、親の updatedAt が動かない」変更があると、
// 取り直しても、反映されない。そういう変更があるかどうかを、GitHub で実際に確かめる。
//
// 使い方:
//   npm run check:updated-at             … いまの状態を読み、前の回と比べて表示し、いまの状態を覚える。
//                                          (前の回が無いときは、覚えるだけ)
//   npm run check:updated-at -- --reset  … 比べずに、いまの状態を覚え直す。
//
// 進め方:
//   1. 試す Issue を決めて、CHECK_UPDATED_AT_ISSUE に書く。
//   2. このスクリプトを動かして、いまの状態を覚える。
//   3. GitHub の画面で、操作を 1 つ行う。(ラベルを付ける、担当者を変える、など)
//   4. このスクリプトを動かして、前との違いを見る。3 と 4 を、操作ごとに繰り返す。
//
//   プロジェクトに足したときの ProjectV2 の動きを見るには、プロジェクトに入っている Issue で、先に外してから、足す。
//   (足す前の ProjectV2 は、Issue から見えないので、比べられない。外した回に覚えた ProjectV2 なら、足したときに比べられる)
//
// 設定 (環境変数が先。無ければ、リポジトリの直下の .env.local。CHECK_ENV_FILE で、別のファイルを指せる):
//   GITHUB_TOKEN            … GitHub の個人用アクセストークン。
//   CHECK_UPDATED_AT_ISSUE  … 対象の Issue。「owner/repo#番号」の形。(owner は、ユーザーでも組織でもよい)
//
// 読むもの:
//   Issue (assignees・labels・milestone・comments・projectItems)、その ProjectV2Item (fieldValues)、
//   その ProjectV2 (items)、Repository、Milestone、新しい順のコメント (5 件)。
//
// 覚えるもの (スナップショット):
//   OS の一時フォルダの sogh-check-updated-at.json。(リポジトリの中には作らない)
//   対象ごとの updatedAt と、関連の中身のダイジェスト (SHA-256)。(作り方は scripts/updated-at.mjs)
//
// 安全のための決まり:
//   - 読むだけ。書き込みのクエリ (mutation) は、送らない。
//   - トークンは、どこにも表示しない。
//   - 取得した値そのもの (id・題名・login・日時・本文など) は、表示しない。
//     表示するのは、種類の名前・件数・順番の番号・「動いた／動かない」「変わった／変わらない」・エラーの文だけ。
//   - GitHub のエラーは、type があるもの (NOT_FOUND など) は type だけを出す。(message には、対象の値が入るため)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { envFilePath, makeGetter, warnMissingEnvFile } from './env-file.mjs';
import {
    ISSUE_QUERY,
    PROJECTS_QUERY,
    parseTarget,
    toSnapshot,
    compareSnapshots,
    formatReport,
    describeSnapshot,
    describeGitHubErrors,
} from './updated-at.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = envFilePath(ROOT);

const ENDPOINT = 'https://api.github.com/graphql';
const SNAPSHOT_FILE = path.join(os.tmpdir(), 'sogh-check-updated-at.json');

/* ****************************************************************
 * GitHub
 * **************************************************************** */

// クエリを 1 回送る。
//   つながらない・HTTP のエラー … 文を出して null を返す。
//   それ以外 … { data, errors } を返す。(GitHub の errors の扱いは、呼ぶ側が決める)
async function send (token, query, variables) {
    let response;

    try {
        response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        });
    } catch (e) {
        console.error(`GitHub につながりませんでした: ${e.message}`);
        return null;
    }

    if (!response.ok) {
        console.error(`GitHub がエラーを返しました: HTTP ${response.status}`);
        return null;
    }

    const json = await response.json();

    return { data: json.data || null, errors: json.errors || null };
}

// GitHub の errors を、値を出さずに表示する。(describeGitHubErrors を見る)
const NOT_FOUND_TEXT = '対象の Issue が見つかりません。(リポジトリか Issue が無いか、トークンで読めません)';

function printErrors (errors) {
    const { notFound, text } = describeGitHubErrors(errors);

    if (notFound)
        console.error(NOT_FOUND_TEXT);

    if (text)
        console.error(`GitHub がエラーを返しました: ${text}`);
}

/* ****************************************************************
 * スナップショット
 * **************************************************************** */

function loadSnapshot () {
    if (!fs.existsSync(SNAPSHOT_FILE))
        return null;

    try {
        return JSON.parse(fs.readFileSync(SNAPSHOT_FILE, 'utf8'));
    } catch (e) {
        console.error('前の回の記録が読めなかったので、無いものとして扱います。');
        return null;
    }
}

function saveSnapshot (snapshot) {
    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snapshot), { mode: 0o600 });
}

/* ****************************************************************
 * main
 * **************************************************************** */

async function main () {
    const reset = process.argv.slice(2).includes('--reset');

    warnMissingEnvFile(ENV_FILE);

    const get = makeGetter(ENV_FILE);
    const token = get('GITHUB_TOKEN');
    const target_text = get('CHECK_UPDATED_AT_ISSUE');

    if (!token) {
        console.error('トークンがありません。');
        console.error(`${ENV_FILE} に GITHUB_TOKEN=<トークン> と書くか、環境変数 GITHUB_TOKEN に入れてください。`);
        console.error('(.env.local.template を、.env.local という名前で写して使えます。CHECK_ENV_FILE で、別の設定ファイルも指せます)');
        process.exitCode = 2;
        return;
    }

    if (!target_text) {
        console.error('対象の Issue の指定がありません。');
        console.error('CHECK_UPDATED_AT_ISSUE=owner/repo#番号 の形で、設定ファイルか環境変数に書いてください。');
        process.exitCode = 2;
        return;
    }

    const target = parseTarget(target_text);

    if (!target) {
        // 指定の値そのものは出さない。
        console.error('CHECK_UPDATED_AT_ISSUE の形が違います。owner/repo#番号 の形で書いてください。(例: octocat/hello-world#1)');
        process.exitCode = 2;
        return;
    }

    const sent = await send(token, ISSUE_QUERY, target);

    if (!sent) {
        process.exitCode = 1;
        return;
    }

    if (sent.errors) {
        printErrors(sent.errors);
        process.exitCode = 1;
        return;
    }

    const data = sent.data;

    if (!data || !data.repository || !data.repository.issue) {
        console.error(NOT_FOUND_TEXT);
        process.exitCode = 1;
        return;
    }

    const prev = loadSnapshot();

    // 前の回に覚えた ProjectV2 のうち、いまは Issue から辿れないものを、id で読み直す。
    // (対象が同じで、--reset でないときだけ)
    let watched = [];

    const first = toSnapshot(target_text, data);

    if (!reset && prev && prev.target === first.target && prev.watch && Array.isArray(prev.watch.projectIds)) {
        const linked = new Set(first.watch.projectIds);
        const missing = prev.watch.projectIds.filter(id=> !linked.has(id));

        if (missing.length > 0) {
            const projects = await send(token, PROJECTS_QUERY, { ids: missing });

            if (!projects) {
                process.exitCode = 1;
                return;
            }

            const { notFound, text } = describeGitHubErrors(projects.errors);

            // NOT_FOUND だけなら、読めた分で続ける。(消された ProjectV2 は、見張るのをやめる)
            if (text || !projects.data) {
                console.error(`前の回に覚えた ProjectV2 を、読み直せませんでした。${text ? `GitHub がエラーを返しました: ${text}` : ''}`);
                process.exitCode = 1;
                return;
            }

            watched = (projects.data.nodes || []).filter(node=> node && node.id);

            if (notFound || watched.length < missing.length)
                console.log(`前の回に覚えた ProjectV2 のうち ${missing.length - watched.length} 件は、読めなかったので、見張るのをやめます。`);
        }
    }

    const curr = watched.length > 0 ? toSnapshot(target_text, data, watched) : first;

    const result = reset
          ? { compared: false, reason: 'reset' }
          : compareSnapshots(prev, curr);

    for (const line of formatReport(result))
        console.log(line);

    if (!result.compared)
        console.log(describeSnapshot(curr));

    saveSnapshot(curr);
}

main();
