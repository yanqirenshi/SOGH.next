import React from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { VISIBILITY_SYMBOLS } from './utils.js';

// 可視性の記号。(例: -)
// 記号は <pre> でくくり、マウスを乗せると可視性 (public など) をツールチップで出す。
// 記号はクラス図 (d3.classes) と同じ。可視性が無いときは、クラス図と同じく public (+) にする。
//
// props:
//   visibility … public / private / protected / package
//   sx         … <pre> の sx に重ねるもの。(例: 右の余白を消す { mr: 0 })

// <pre> は、そのままだと行を分けて幅いっぱいに広がるので、行の中に置く。
const SX_VISIBILITY = {
    display: 'inline',
    m: 0,
    mr: 1,
    px: 1,
    py: 0.25,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    backgroundColor: 'grey.100',
    borderRadius: 1,
};

export default function VisibilityMark ({ visibility, sx }) {
    const v = visibility || 'public';
    const symbol = VISIBILITY_SYMBOLS[v] || '';

    if (!symbol) return null;

    return (
        <Tooltip title={v} arrow>
          <Box component="pre" sx={{ ...SX_VISIBILITY, ...sx }}>{symbol}</Box>
        </Tooltip>
    );
}
