// クラスのページ (src/wbs/classes/P{id}.js) に共通のタブ。
//   overview   … 概要
//   attributes … 属性
//   behaviors  … 振舞
//   wbs        … WBS (このページから下の WBS の表)
const TABS = [
    { code: 'overview',   label: '概要' },
    { code: 'attributes', label: '属性' },
    { code: 'behaviors',  label: '振舞' },
    { code: 'wbs',        label: 'WBS' },
];

export default TABS;
