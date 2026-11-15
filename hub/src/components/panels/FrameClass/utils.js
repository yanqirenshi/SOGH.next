// FrameClass のタブで使う、データの読み方。
// (データは data/classes/classes.json のクラスの attributes・methods。d3.classes の形)

// 名前。文字列か、論理名・物理名の組 ({ logical, physical })。
export function nameOf (name) {
    if (typeof name === 'string') return name;
    if (!name) return '';

    return name.physical || name.logical || '';
}

// 説明などの文章。文字列か、1 行 1 要素の配列。→ 配列にする。
export function linesOf (v) {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string' && v !== '') return [v];

    return [];
}

// 属性・メソッドの 1 件。文字列だけのときは、名前だけのデータにする。
export function memberOf (v) {
    return typeof v === 'string' ? { name: v } : (v || {});
}

// 可視性の記号。(d3.classes と同じ)
export const VISIBILITY_SYMBOLS = {
    public:    '+',
    private:   '-',
    protected: '#',
    package:   '~',
};

// 属性・メソッドの見出し (tion の Section の sx)。
// 見出しの下に、横幅いっぱいの線を引く。
// Section は、見出しを data-lev 属性の付いた要素で描くので、それを選ぶ。
// (子孫の Section の見出し (Syntax など) には効かないように、直下の見出しだけを選ぶ)
export const SX_MEMBER_TITLE = {
    '& > div:first-of-type > [data-lev]': {
        borderBottom: '1px solid',
        borderColor: 'grey.500',
        pb: 0.5,
    },
};
