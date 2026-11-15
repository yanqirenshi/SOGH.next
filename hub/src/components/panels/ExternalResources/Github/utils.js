import React from 'react';

import Box from '@mui/material/Box';

// 「Github」タブの中で使う、小さな部品。

// コードの書体。
// monospace だけだと、日本語の Windows では MS ゴシックになり、アンダースコア (_) が見えない。
// そのため、先に Consolas (Windows)・Menlo (macOS) を指定する。
export const FONT_CODE = 'Consolas, Menlo, monospace';

// 整形済みテキスト (tion の Plane) の sx。
export const SX_PLANE = { fontFamily: FONT_CODE };

// 文中のコード。(メソッド名・ファイル名・クエリの印など)
// 文の途中に置けるインライン要素。
// 色は、まわりの文字に合わせる。(bulma の code は赤い文字なので、打ち消す)
export function C ({ children }) {
    return (
        <Box component="code"
             sx={{
                 fontFamily: FONT_CODE,
                 fontSize: '0.9em',
                 color: 'inherit',
                 bgcolor: 'grey.200',
                 borderRadius: '3px',
                 px: 0.5,
             }}>
          {children}
        </Box>
    );
}

// 表のすぐ下に置く文章の sx。(表とくっつかないように、上に余白を空ける)
export const SX_AFTER_TABLE = { mt: 2 };

// 表の ids。(tion の Table に渡す。列は code、行は順番を key にする)
export const TABLE_IDS = {
    column: (c)=> c.code,
    row: (r, i)=> i,
};
