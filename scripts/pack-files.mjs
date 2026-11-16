// check-pack.mjs の、npm を呼ばない部分。(テストから読む)
//
//   checkPackFiles(paths)        … パッケージに入るファイルの一覧を見て、問題を返す。
//   parsePackJson(text)          … `npm pack --dry-run --json` の出力から、ファイルの一覧を取り出す。
//   formatPackReport(result)     … 表示する行にする。(ファイルの数と、問題のあったファイルの名前だけ)
//
// 入ってよいもの (yanqirenshi/SOGH.next#54):
//   dist/ の下 (ビルドしたもの)、package.json・README.org・LICENSE・CHANGELOG.md。

export const ALLOWED_FILES = ['package.json', 'README.org', 'LICENSE', 'CHANGELOG.md'];

export const REQUIRED_FILE = 'dist/index.js';

// パスの区切りを / にそろえる。
const normalize = (p)=> String(p).replace(/\\/g, '/').replace(/^\.\//, '');

const basename = (p)=> p.split('/').pop();

// パッケージに入るファイルの一覧を見る。
//   { ok, count, problems: [{ path, reason }] }
//   reason … 'not-allowed' (入ってよいもののほか)・'env' (名前に .env を含む)・'missing' (dist/index.js が無い)
export function checkPackFiles (paths) {
    const files = (paths || []).map(normalize);
    const problems = [];

    for (const file of files) {
        if (basename(file).toLowerCase().includes('.env'))
            problems.push({ path: file, reason: 'env' });
        else if (!file.startsWith('dist/') && !ALLOWED_FILES.includes(file))
            problems.push({ path: file, reason: 'not-allowed' });
    }

    if (!files.includes(REQUIRED_FILE))
        problems.push({ path: REQUIRED_FILE, reason: 'missing' });

    return { ok: problems.length === 0, count: files.length, problems };
}

// `npm pack --dry-run --json` の出力 (JSON の配列) から、ファイルのパスの一覧を取り出す。
// 前に警告などの文が混ざっていても読めるように、最初の [ から読む。読めないときは null。
export function parsePackJson (text) {
    const start = String(text || '').indexOf('[');

    if (start < 0)
        return null;

    try {
        const json = JSON.parse(text.slice(start));
        const pack = Array.isArray(json) ? json[0] : null;

        if (!pack || !Array.isArray(pack.files))
            return null;

        return pack.files.map(f=> f.path);
    } catch (e) {
        return null;
    }
}

const REASONS = {
    'not-allowed': '入れるつもりの無いファイル',
    'env':         '名前に .env を含むファイル',
    'missing':     '無い (ビルドしていない。npm run transpile を先に動かす)',
};

// 表示する行の配列にする。
export function formatPackReport (result) {
    const lines = [`パッケージに入るファイル: ${result.count} 個`];

    if (result.ok) {
        lines.push('OK: 入ってよいもの (dist/ の下・' + ALLOWED_FILES.join('・') + ') だけです。');
        return lines;
    }

    lines.push(`NG: 問題のあるファイルが ${result.problems.length} 個あります。`);

    for (const p of result.problems)
        lines.push(`  ${p.path}  … ${REASONS[p.reason] || p.reason}`);

    return lines;
}
