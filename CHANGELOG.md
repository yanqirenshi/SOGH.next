# 更新履歴

## 0.3.0

MUI と Emotion を peerDependencies に移し、React 19 に対応しました。

### 利用側への影響 (破壊的な変更です)

- `@mui/material`・`@mui/icons-material`・`@emotion/react`・`@emotion/styled` を、`dependencies` から `peerDependencies` に移しました。**アプリ側で、これらをインストールしてください。**(MUI を使っているアプリは、すでに入っています)
  - これまでは、sogh が MUI 5 を同梱していたため、MUI 6 以降を使うアプリには、MUI が 2 つ入り、アプリの `ThemeProvider` が sogh の部品に届きませんでした。これからは、アプリの MUI を 1 つだけ使います。
- peerDependencies の範囲:
  - `react`・`react-dom`: `^18.0.0 || ^19.0.0`(これまでは `^18.2.0`)
  - `@mui/material`・`@mui/icons-material`: `^5.14.20 || ^6.0.0 || ^7.0.0 || ^9.0.0`
  - `@emotion/react`・`@emotion/styled`: `^11.10.4`
- `@mui/lab` と `@mui/x-date-pickers` への依存を、なくしました。(ソースは、どちらも使っていませんでした。置き換えは要りません)
- `@uiw/react-md-editor` (`^4.0.3`) を、`dependencies` に足しました。(`Editor`・`Issue` の部品が使っていましたが、宣言していませんでした)
- `package.json` の `repository` を、`SOGH.next` に直しました。(`homepage`・`bugs` も足しました)
- 部品の見た目と機能は、変わりません。コードの変更はありません。

### 動作を確かめた版

`npm pack` したものを、`overrides` や `--legacy-peer-deps` 無しで入れて、`@mui/material` が 1 つだけであることと、すべての部品を読み込めること、`Repositories` を描画できることを確かめました。

| React | MUI |
| --- | --- |
| 19.3.1 | 9.5.0(ブラウザでも、検索の入力で、表が絞り込まれることを確認) |
| 19.3.1 | 7.3.11 |
| 18.3.1 | 6.5.0 |
| 18.3.1 | 5.18.0 |
