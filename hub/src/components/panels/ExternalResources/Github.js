import React from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { P } from 'tion';

import Overview from './Github/Overview.js';
import Fetching from './Github/Fetching.js';
import DataModel from './Github/DataModel.js';
import Notes from './Github/Notes.js';
import MatchmakerSpec from './Github/MatchmakerSpec.js';

// 外部リソースのページ (/external-resources) の「Github」タブのパネル。
// GitHub の API でデータを取得して、データモデルにするまでの仕様を出す。
// 1〜6 章は、sogh の src/js/ の、いまの動きを整理したもの。
// 7 章は、関連をモデルにする仕様と、決めたこと。(sogh 0.4.0 で実装した)
//
// 中身は、章ごとに Github/ の部品に分けている。
//   Overview       … 1. 全体像、2. 認証と接続
//   Fetching       … 3. 取得の仕様
//   DataModel      … 4. データモデル、5. 取得する項目
//   Notes          … 6. 気づいた点
//   MatchmakerSpec … 7. 関連をモデルにする (Matchmaker の拡張)
//
// props:
//   tab … 選んでいるタブ ({ code, label })。(TabbedPage が渡す)
export default function Github () {
    return (
        // タブの下の領域はスクロールしないので、パネルの中でスクロールさせる。
        // 下の余白 (pb) は、末尾がドックに隠れないように広くする。(コアの WBS のパネルと同じ)
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <Container maxWidth="lg" sx={{ pt: 3, pb: 22 }}>
            <P>GitHub の API でデータを取得して、データモデルにするまでの仕様です。</P>
            <P>1〜6 章は、sogh (src/js/) のコードを読んで、いまの動きを整理したものです。</P>
            <P>7 章は、関連をモデルにする仕様と、決めたことです。(sogh 0.4.0 で実装しました)</P>

            <Overview/>
            <Fetching/>
            <DataModel/>
            <Notes/>
            <MatchmakerSpec/>
          </Container>
        </Box>
    );
}
