// クラス図の配置を計算する。(描画はしない)
//
// layout(classes, show) → { boxes, edges, packages, width, height }
//   classes … CLASSES.js のクラスの配列
//   show    … { fields: 属性を出すか, methods: メソッドを出すか }
//
// 並べ方
//   上段: Loader ◁─ Pooler ◁─ Sogh (継承)。Pooler の下に Pool と Matchmaker
//   下段: GraphQLNode の下に、モデルのクラスを横一列に並べる (継承の線は 1 本にまとめる)
//   MODEL_ORDER に無いクラスは、下段の右の端に足す。(データにあるクラスは、すべて描く)

// 文字は等幅のフォントで描き、幅は文字数から計算する。
export const FONT = {
    family: 'Consolas, Menlo, "Courier New", monospace',
    size: 12,
    charWidth: 7.2,
    lineHeight: 16,
    nameSize: 13,
    nameCharWidth: 8.2,
    fileSize: 10,
    fileCharWidth: 6.1,
};

const PAD_X = 10;
const HEAD_H = 40;          // クラスの名前 + ファイル
const STEREOTYPE_H = 14;    // «classic・廃止予定»
const SECTION_PAD = 6;
const MIN_W = 140;

const GAP = 40;             // 箱と箱の間
const GAP_LABELED = 130;    // 線にラベルを付ける箱と箱の間
const GAP_INFRA = 90;       // Loader - Pooler - Sogh の間
const ROW_GAP = 110;        // 段と段の間
const MARGIN = 40;
const PACKAGE_PAD = 24;
const PACKAGE_LABEL_H = 22;

// 下段の並び (左から)。関連のあるクラスを隣に置く。
const MODEL_ORDER = [
    'User', 'Viewer', 'Assignee', 'Organization',
    'Repository', 'Label', 'Milestone',
    'Issue', 'IssueComment', 'PullRequest', 'Relationship',
    'ProjectV2Item', 'ProjectV2', 'Term',
    'Project', 'Card', 'Column',
];

// 線にラベルを付ける、隣り合う箱の組
const LABELED_PAIRS = [
    ['ProjectV2Item', 'ProjectV2'],
    ['ProjectV2', 'Term'],
];

// Projects (classic) のクラス。GitHub では廃止になる。
export const DEPRECATED = new Set(['Project', 'Card', 'Column']);

const INFRA = ['Loader', 'Pooler', 'Sogh', 'Pool', 'Matchmaker'];
const ROOT_MODEL = 'GraphQLNode';

/* **************************************************************** *
 *  箱の大きさ
 * **************************************************************** */
export function fieldLine (f) {
    const visibility = f.name.startsWith('_') ? '-' : '+';
    return `${visibility} ${f.name}${f.type ? ': ' + f.type : ''}`;
}

export function methodLine (m) {
    return `+ ${m.async ? 'async ' : ''}${m.name}(${m.params.join(', ')})`;
}

function measure (cls, show) {
    const fields  = show.fields  ? cls.fields.map(fieldLine)   : [];
    const methods = show.methods ? cls.methods.map(methodLine) : [];
    const deprecated = DEPRECATED.has(cls.name);

    const text_w = Math.max(
        cls.name.length * FONT.nameCharWidth,
        cls.file.length * FONT.fileCharWidth,
        ...fields.map(s=> s.length * FONT.charWidth),
        ...methods.map(s=> s.length * FONT.charWidth),
    );

    const head_h = HEAD_H + (deprecated ? STEREOTYPE_H : 0);
    const fields_h  = show.fields  ? SECTION_PAD * 2 + fields.length  * FONT.lineHeight : 0;
    const methods_h = show.methods ? SECTION_PAD * 2 + methods.length * FONT.lineHeight : 0;

    return {
        cls, deprecated,
        fields, methods,
        head_h, fields_h, methods_h,
        w: Math.ceil(Math.max(MIN_W, text_w + PAD_X * 2)),
        h: head_h + fields_h + methods_h,
        x: 0, y: 0,
    };
}

/* **************************************************************** *
 *  配置
 * **************************************************************** */
export default function layout (classes, show) {
    const boxes = {};
    for (const cls of classes)
        boxes[cls.name] = measure(cls, show);

    const has = (name)=> !!boxes[name];
    const b = (name)=> boxes[name];

    // 下段のクラス (MODEL_ORDER の順 + 残り)
    const models = [
        ...MODEL_ORDER.filter(has),
        ...classes.map(c=> c.name).filter(n=> !MODEL_ORDER.includes(n) && !INFRA.includes(n) && n!==ROOT_MODEL),
    ];

    const isLabeledPair = (l, r)=> LABELED_PAIRS.some(([a, c])=> a===l && c===r);

    // --- 下段の x ---
    let x = 0;
    models.forEach((name, i)=> {
        if (i > 0) x += isLabeledPair(models[i-1], name) ? GAP_LABELED : GAP;
        b(name).x = x;
        x += b(name).w;
    });

    const cx_of = (box)=> box.x + box.w / 2;

    // GraphQLNode の子 (継承の線を 1 本にまとめる)
    const children = models.filter(n=> b(n).cls.extends===ROOT_MODEL);
    const centers = children.map(n=> cx_of(b(n)));
    const cx = centers.length > 0
          ? (Math.min(...centers) + Math.max(...centers)) / 2
          : x / 2;

    // --- 上の段の x (cx にそろえる) ---
    const center = (name)=> { if (has(name)) b(name).x = cx - b(name).w / 2; };

    center('Pooler');
    center('Pool');
    center(ROOT_MODEL);

    if (has('Loader') && has('Pooler'))
        b('Loader').x = b('Pooler').x - GAP_INFRA - b('Loader').w;
    if (has('Sogh') && has('Pooler'))
        b('Sogh').x = b('Pooler').x + b('Pooler').w + GAP_INFRA;
    if (has('Matchmaker') && has('Pool'))
        b('Matchmaker').x = b('Pool').x - GAP * 2 - b('Matchmaker').w;

    // --- y (段ごと) ---
    const rows = [
        ['Loader', 'Pooler', 'Sogh'],
        ['Matchmaker', 'Pool'],
        [ROOT_MODEL],
        models,
    ].map(row=> row.filter(has));

    let y = 0;
    const row_top = [];
    for (const row of rows) {
        row_top.push(y);
        if (row.length===0) continue;
        for (const name of row) b(name).y = y;
        y += Math.max(...row.map(n=> b(n).h)) + ROW_GAP;
    }

    // --- 左上を (MARGIN, MARGIN + パッケージのラベル) にそろえる ---
    const all = Object.values(boxes);
    const min_x = Math.min(...all.map(v=> v.x));
    const dx = MARGIN + PACKAGE_PAD - min_x;
    const dy = MARGIN + PACKAGE_PAD + PACKAGE_LABEL_H;
    for (const v of all) { v.x += dx; v.y += dy; }

    const edges = makeEdges(boxes, models, children);
    const packages = makePackages(boxes, models);

    const width  = Math.max(...all.map(v=> v.x + v.w)) + PACKAGE_PAD + MARGIN;
    const height = Math.max(...all.map(v=> v.y + v.h)) + PACKAGE_PAD + MARGIN;

    return { boxes, edges, packages, width, height };
}

/* **************************************************************** *
 *  線
 * **************************************************************** */
// type: generalization (▷ 継承) / composition (◆) / aggregation (◇) / association (→) / line (飾りなし)
function makeEdges (boxes, models, children) {
    const edges = [];
    const b = (name)=> boxes[name];
    const has = (name)=> !!boxes[name];
    const cx = (box)=> box.x + box.w / 2;
    const bottom = (box)=> box.y + box.h;
    const HEAD_Y = 20;  // 横の線を引く高さ (箱の上から)

    // 横に並んだ箱を結ぶ (from の左 → to の右、または from の右 → to の左)
    const horizontal = (from, to, type, label)=> {
        const f = b(from), t = b(to);
        const y = Math.max(f.y, t.y) + HEAD_Y;
        const left_to_right = f.x < t.x;
        const x1 = left_to_right ? f.x + f.w : f.x;
        const x2 = left_to_right ? t.x : t.x + t.w;
        edges.push({ type, points: [[x1, y], [x2, y]], label, label_at: [(x1 + x2) / 2, y - 6] });
    };

    // Pooler ─▷ Loader、Sogh ─▷ Pooler
    if (has('Pooler') && has('Loader')) horizontal('Pooler', 'Loader', 'generalization');
    if (has('Sogh') && has('Pooler'))   horizontal('Sogh', 'Pooler', 'generalization');

    // Pooler ◆─ Pool
    if (has('Pooler') && has('Pool')) {
        const x = cx(b('Pool'));
        edges.push({
            type: 'composition',
            points: [[x, bottom(b('Pooler'))], [x, b('Pool').y]],
            label: '_pools  1..*',
            label_at: [x + 8, b('Pool').y - 10],
            label_anchor: 'start',
        });
    }

    // Pooler ◆─ Matchmaker
    if (has('Pooler') && has('Matchmaker')) {
        const p = b('Pooler'), m = b('Matchmaker');
        const x1 = p.x + Math.min(40, p.w / 4);
        const y_mid = m.y - 40;
        edges.push({
            type: 'composition',
            points: [[x1, bottom(p)], [x1, y_mid], [cx(m), y_mid], [cx(m), m.y]],
            label: 'matchmaker',
            label_at: [cx(m) + 8, m.y - 10],
            label_anchor: 'start',
        });
    }

    // Pool ◇─ GraphQLNode
    if (has('Pool') && has(ROOT_MODEL)) {
        const x = cx(b(ROOT_MODEL));
        edges.push({
            type: 'aggregation',
            points: [[x, bottom(b('Pool'))], [x, b(ROOT_MODEL).y]],
            label: '_list  0..*',
            label_at: [x + 8, b(ROOT_MODEL).y - 10],
            label_anchor: 'start',
        });
    }

    // GraphQLNode の子 (1 本の線にまとめる)
    if (has(ROOT_MODEL) && children.length > 0) {
        const root = b(ROOT_MODEL);
        const top = Math.min(...children.map(n=> b(n).y));
        const bus_y = top - ROW_GAP / 2;
        const xs = children.map(n=> cx(b(n)));

        for (const n of children)
            edges.push({ type: 'line', points: [[cx(b(n)), b(n).y], [cx(b(n)), bus_y]] });

        edges.push({ type: 'line', points: [[Math.min(...xs, cx(root)), bus_y], [Math.max(...xs, cx(root)), bus_y]] });
        edges.push({ type: 'generalization', points: [[cx(root), bus_y], [cx(root), bottom(root)]] });
    }

    // ProjectV2 ─→ ProjectV2Item、ProjectV2 ◆─ Term
    if (has('ProjectV2') && has('ProjectV2Item'))
        horizontal('ProjectV2', 'ProjectV2Item', 'association', 'items  0..*');
    if (has('ProjectV2') && has('Term'))
        horizontal('ProjectV2', 'Term', 'composition', '_plan, _result');

    // 上で描いていない継承 (データに増えたとき用)
    const drawn = new Set(['Pooler', 'Sogh', ...children]);
    for (const box of Object.values(boxes)) {
        const parent = box.cls.extends;
        if (!parent || !has(parent) || drawn.has(box.cls.name)) continue;
        const p = b(parent);
        edges.push({ type: 'generalization', points: [[cx(box), box.y], [cx(p), bottom(p)]] });
    }

    return edges;
}

/* **************************************************************** *
 *  パッケージ (枠)
 * **************************************************************** */
function makePackages (boxes, models) {
    const frame = (label, names)=> {
        const list = names.filter(n=> boxes[n]).map(n=> boxes[n]);
        if (list.length===0) return null;

        const x1 = Math.min(...list.map(v=> v.x)) - PACKAGE_PAD;
        const y1 = Math.min(...list.map(v=> v.y)) - PACKAGE_PAD - PACKAGE_LABEL_H;
        const x2 = Math.max(...list.map(v=> v.x + v.w)) + PACKAGE_PAD;
        const y2 = Math.max(...list.map(v=> v.y + v.h)) + PACKAGE_PAD;

        return { label, x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
    };

    return [
        frame('js/ ― 取得・キャッシュ', INFRA),
        frame('js/models/ ― データモデル', [ROOT_MODEL, ...models]),
    ].filter(Boolean);
}
