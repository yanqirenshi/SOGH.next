// クエリ (src/js/queries/) を、GitHub の GraphQL のスキーマで検査する。
//
// 使い方:
//   node scripts/check-queries.mjs --schema <スキーマのファイル>
//   node scripts/check-queries.mjs --schema <スキーマのファイル> --dump <出力先.json>
//   node scripts/check-queries.mjs --schema <スキーマのファイル> --compare <前の出力.json>
//
//   --schema  … GitHub が公開しているスキーマ (schema.docs.graphql) の場所。
//                環境変数 GITHUB_SCHEMA でも指定できる。
//                https://docs.github.com/public/fpt/schema.docs.graphql から取れる。(トークンは要らない)
//   --dump    … クエリごとの「取っている項目」の一覧を、JSON で書き出す。
//   --compare … --dump で書き出した一覧と比べて、減った項目・増えた項目を出す。
//                (クエリを直す前に --dump しておき、直したあとに --compare する)
//
// 検査すること:
//   1. クエリが GraphQL として読めるか。
//   2. スキーマに無い型・項目を使っていないか。項目の重なり方が正しいか。
//   3. データモデルになる型の項目を取る場所で、id と updatedAt を取っているか。
//
// 使用中 (Sogh のメソッドが使っている) のクエリに、2 の NG か 3 の抜けがあると、終了コードが 1 になる。
//
// GitHub には、つながない。
// クエリの値は GraphQL の variables で渡す形なので、クエリの文字列を、そのまま読む。(yanqirenshi/SOGH.next#63)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildSchema, parse, validate, visit, visitWithTypeInfo, TypeInfo, Kind } from 'graphql';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const QUERIES = path.join(ROOT, 'src', 'js', 'queries', 'index.js');
const SOGH = path.join(ROOT, 'src', 'js', 'Sogh.js');

function parseArgs (argv) {
    const args = { schema: process.env.GITHUB_SCHEMA || null, dump: null, compare: null };

    for (let i = 0; i < argv.length; i++) {
        const name = argv[i].replace(/^--/, '');

        if (name in args)
            args[name] = argv[++i] || null;
    }

    return args;
}

// クエリが取っている項目を、道順の一覧にする。
//   例: viewer.repositories.nodes.owner[on User].login
function fieldPaths (document) {
    const out = new Set();

    const walk = (selection_set, base)=> {
        if (!selection_set) return;

        for (const selection of selection_set.selections) {
            if (selection.kind === Kind.FIELD) {
                const here = base ? `${base}.${selection.name.value}` : selection.name.value;

                out.add(here);

                walk(selection.selectionSet, here);
            }

            if (selection.kind === Kind.INLINE_FRAGMENT) {
                const type = selection.typeCondition ? selection.typeCondition.name.value : '';

                walk(selection.selectionSet, `${base}[on ${type}]`);
            }
        }
    };

    for (const definition of document.definitions)
        walk(definition.selectionSet, '');

    return [...out].sort();
}

// NG ではなく「注意」として出すもの。
//
// 型の違う項目を、同じ名前で、同じ場所に取っているとき。
//   例: ProjectV2Item の content で、Issue の state (IssueState!) と PullRequest の state (PullRequestState!) を取る。
// GraphQL の決まりでは正しくないが、GitHub は受け付けている。
// いまのクエリには無い。(content の PullRequest の state は、別名 pullRequestState で取る。yanqirenshi/SOGH.next#68)
// 新しく増やさないように、見えるようにしておく。
function isCaution (message) {
    return /^Fields ".+" conflict because they return conflicting types/.test(message);
}

// データモデルになる型。
// これらの型の項目を取る場所では、id と updatedAt を取る決まり。
// (同じ id の node を重ねるかどうかを、updatedAt で決めるため)
const MODEL_TYPES = new Set([
    'User', 'Organization', 'Bot', 'Mannequin', 'EnterpriseUserAccount', 'Team',
    'Repository', 'Issue', 'PullRequest', 'IssueComment', 'Label', 'Milestone',
    'ProjectV2', 'ProjectV2Item', 'DraftIssue',
]);

// データモデルになる型の項目を取っているのに、id か updatedAt を取っていない場所を探す。
//   例: viewer.repositories.nodes.owner[on User] (updatedAt が無い)
//
// その型の項目を 1 つも取らず、入れ子だけを取っている場所は、通り道なので見ない。
//   例: viewer { repositories { ... } } の viewer
function missingKeys (schema, document) {
    const out = [];
    const type_info = new TypeInfo(schema);
    const path = [];

    visit(document, visitWithTypeInfo(type_info, {
        Field: {
            enter (node) { path.push(node.name.value); },
            leave () { path.pop(); },
        },
        InlineFragment: {
            enter (node) { path.push(`[on ${node.typeCondition ? node.typeCondition.name.value : ''}]`); },
            leave () { path.pop(); },
        },
        SelectionSet (node) {
            const type = type_info.getParentType();

            if (!type || !MODEL_TYPES.has(type.name))
                return;

            const fields = node.selections.filter(s=> s.kind === Kind.FIELD && s.name.value !== '__typename');
            const leafs = fields.filter(s=> !s.selectionSet).map(s=> s.name.value);

            if (leafs.length === 0)
                return;

            const missing = ['id', 'updatedAt'].filter(k=> !leafs.includes(k));

            if (missing.length > 0)
                out.push(`${path.join('.').replaceAll('.[', '[')} (${type.name}): ${missing.join('・')} が無い`);
        },
    }));

    return out;
}

// Sogh のメソッドが使っているクエリの名前。
// (Sogh.js の this.query('…')・this.queryDefinition('…')・this.fetchNode('…')・this.fetchPages('…')・this.fetchProjectsV2OfTeam('…'))
function usedQueries () {
    const src = fs.readFileSync(SOGH, 'utf8');

    return new Set([...src.matchAll(/this\.(?:query|queryDefinition|fetchNode|fetchPages|fetchProjectsV2OfTeam)\('([^']+)'/g)].map(m=> m[1]));
}

function compare (before, after) {
    let removed_total = 0;

    for (const code of Object.keys(after).sort()) {
        const a = new Set(before[code] || []);
        const b = new Set(after[code] || []);

        const removed = [...a].filter(p=> !b.has(p));
        const added = [...b].filter(p=> !a.has(p));

        removed_total += removed.length;

        if (removed.length === 0 && added.length === 0)
            continue;

        console.log(`${code}: 増えた ${added.length}、減った ${removed.length}`);

        for (const p of removed)
            console.log(`  - ${p}`);
    }

    for (const code of Object.keys(before))
        if (!(code in after)) {
            removed_total++;
            console.log(`${code}: クエリが無くなった`);
        }

    console.log(removed_total === 0 ? '減った項目は、ありません。' : `減った項目が、${removed_total} 個あります。`);

    return removed_total === 0;
}

async function main () {
    const args = parseArgs(process.argv.slice(2));

    if (!args.schema || !fs.existsSync(args.schema)) {
        console.error('スキーマのファイルを、--schema か、環境変数 GITHUB_SCHEMA で指定してください。');
        console.error('https://docs.github.com/public/fpt/schema.docs.graphql から取れます。');
        process.exit(2);
    }

    // GitHub のスキーマは、graphql パッケージの検査では通らない所がある。
    // (非推奨の印の付け方が、インターフェースと実装で違う)
    // スキーマ自体は検査の対象ではないので、正しいものとして読む。
    const schema = buildSchema(fs.readFileSync(args.schema, 'utf8'), { assumeValid: true, assumeValidSDL: true });
    const queries = await import(pathToFileURL(QUERIES).href);
    const used = usedQueries();

    const paths = {};
    let ng_used = 0, ng_unused = 0, caution_count = 0, missing_used = 0, missing_unused = 0;

    for (const code of Object.keys(queries).sort()) {
        const mark = used.has(code) ? '使用中' : '未使用';

        let errors, missing = [];

        try {
            const document = parse(queries[code].query);

            paths[code] = fieldPaths(document);
            errors = validate(schema, document).map(e=> e.message);

            // スキーマに合わないクエリは、型をたどれないので、見ない。
            if (errors.filter(e=> !isCaution(e)).length === 0)
                missing = missingKeys(schema, document);
        } catch (e) {
            paths[code] = [];
            errors = [`読めない: ${e.message}`];
        }

        const cautions = [...new Set(errors.filter(isCaution))];
        const ngs = [...new Set(errors.filter(e=> !isCaution(e)))];

        if (ngs.length === 0) {
            console.log(`${cautions.length === 0 ? 'OK  ' : '注意'} [${mark}] ${code} (${paths[code].length} 項目)`);
        } else {
            used.has(code) ? ng_used++ : ng_unused++;

            console.log(`NG   [${mark}] ${code}`);
        }

        if (cautions.length > 0)
            caution_count++;

        if (missing.length > 0)
            used.has(code) ? missing_used++ : missing_unused++;

        for (const message of ngs)
            console.log(`      NG:   ${message}`);

        for (const message of cautions)
            console.log(`      注意: ${message}`);

        for (const message of missing)
            console.log(`      キー: ${message}`);
    }

    console.log('');
    console.log(`クエリ ${Object.keys(queries).length} 個。`);
    console.log(`  NG   (スキーマに合わない)        … 使用中 ${ng_used} 個・未使用 ${ng_unused} 個`);
    console.log(`  注意 (型の違う項目が重なっている) … ${caution_count} 個`);
    console.log(`  キー (id・updatedAt を取っていない) … 使用中 ${missing_used} 個・未使用 ${missing_unused} 個`);

    if (args.dump) {
        fs.writeFileSync(args.dump, JSON.stringify(paths, null, 1));
        console.log(`項目の一覧を、${args.dump} に書き出しました。`);
    }

    let same = true;

    if (args.compare) {
        console.log('');
        same = compare(JSON.parse(fs.readFileSync(args.compare, 'utf8')), paths);
    }

    process.exit(ng_used === 0 && missing_used === 0 && same ? 0 : 1);
}

main();
