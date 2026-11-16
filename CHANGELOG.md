# 更新履歴

## 0.4.2

ProjectV2 の Item の表で、Item の content が無いときに落ちる場合があったのと、閉じた日の書式の誤りを、直しました。
(yanqirenshi/SOGH.next#36・yanqirenshi/SOGH.next#41・yanqirenshi/SOGH.next#42)

### 直したもの

- ProjectV2 の Item の表 (`ProjectV2Items`) の Title の列が、Item の `type()` が ISSUE で、`content()` が null のときに、TypeError で落ちていた。(#36)
  - Title フィールドの値を出すようにした。(`type()` が DRAFT_ISSUE のときと同じ表示)
  - 0.3.0 からあった不具合です。
- ProjectV2 の Item の表 (`TableProjectV2Items`) の Title の列と Closed の列が、Item の type が ISSUE で、content が null (または、無い) のときに、TypeError で落ちていた。(#41)
  - Title の列は、Title フィールドの値を出すようにした。(リンクとクリックの動きは付けない)
  - Closed の列は、空のセルを出すようにした。(type が ISSUE でないときと同じ表示)
  - 0.3.0 からあった不具合です。
- `TableProjectV2Items` の Closed の列が、閉じた日を `年-日-分` の書式で出していた。(#42)
  - `年-月-日` (例: `2026-03-09`) で出すようにした。
  - 0.3.0 からあった不具合です。

## 0.4.1

取り直しても、GitHub 側の変更が反映されない場合があったのを、直しました。
(yanqirenshi/SOGH.next#34)

### 直したもの

- GitHub で Issue や ProjectV2 を変えたあと、取り直しても、変更がモデルに反映されない場合があった。
  - 入れ子で来た node (項目が少ない) が、先にモデルの `updatedAt` を進めるので、あとから来た、項目のそろった node が「日時が同じ」と見なされ、重ならなかった。
  - 例 1: `asyncFetchProjectsV2WithItemsByTeam()` で取り直しても、ProjectV2 の README の属性と `items()` が、古いままだった。
  - 例 2: ProjectV2 の Item の一覧を取り直したあとで、Issue を取り直しても、`body()` と `assignees()` が、古いままだった。

### 変わった動き

- `reload()` に日時が入る場合が、1 つ増えました。
  - これまで: 手元より新しい node を重ねたとき。
  - 足したもの: 入れ子で来た node で、初めてモデルを作ったとき。
  - `reload()` は、「同じ日時の node が来たら、重ねてよい」という印になりました。
- 日時 (`updatedAt`) が同じ node が来たとき、モデルに `reload()` が入っていれば、来た項目を重ねます。
  - `reload()` が入っていなければ、これまでどおり、手元に無い項目だけを足します。
  - 来たほうが古いときも、これまでどおりです。
- GraphQLNode の `merge(node)` が返す値に、`'same'` (日時が同じで、`reload()` が入っていたので、重ねた) が増えました。

### 足したもの

- Matchmaker の `isNesting()`・`nest(fn)` (入れ子の node を辿っている途中かどうか)
- Pool の `isNesting()`

## 0.4.0

GraphQL で取得した node に入れ子で付いてくる関連 (Issue の assignees など) を、すべてモデルにしました。
関連を返すメソッドは、JSON ではなくモデルを返します。
(仕様: yanqirenshi/SOGH.next#25〜#30)

### 利用側への影響 (破壊的な変更です)

- 関連を返すメソッドが、JSON ではなく、モデル (またはモデルの配列) を返します。値は、プロパティではなくメソッドで読んでください。
  - 例: `issue.assignees().find(a => a.login === login)` は `issue.assignees().find(a => a.login() === login)` に、`item.content().id` は `item.content().id()` に書き換えます。
  - 関連が無いときは、`null` か空の配列を返します。

  | クラス | メソッド | 返すモデル |
  | --- | --- | --- |
  | Repository | `owner()` | User・Organization |
  | Issue | `assignees()` | User の配列 |
  | Issue | `author()` | 人 (User・Organization・Bot・Mannequin・EnterpriseUserAccount) |
  | Issue | `labels()` | Label の配列 |
  | Issue | `milestone()` | Milestone |
  | Issue | `repository()` | Repository |
  | Issue | `projectV2Items()`・`projectV2Item()` | ProjectV2Item |
  | Issue | `projectsV2()`・`projectV2()`・`project()` | ProjectV2 |
  | IssueComment | `author()` | 人 |
  | ProjectV2 | `creator()` | 人 |
  | ProjectV2 | `items()`・`itemsWith2ProjectV2Item()` | ProjectV2Item の配列 |
  | ProjectV2Item | `project()` | ProjectV2 |
  | ProjectV2Item | `content()` | Issue・PullRequest・DraftIssue |
  | ProjectV2Item | `creator()` | 人 |
  | ProjectV2Item | `assignees()` | User の配列 |
  | ProjectV2Item | `labels()` | Label の配列 |
  | ProjectV2Item | `milestone()` | Milestone |
  | ProjectV2Item | `repository()` | Repository |
  | ProjectV2Item | `linkedPullRequests()` | PullRequest の配列 |
  | ProjectV2Item | `reviewers()` | User・Team・Mannequin・Bot の配列 |
  | PullRequest | `assignees()` | User の配列 (core に無いときは空の配列。これまでは TypeError) |

- 次のメソッドは、これまでどおり JSON を返します。
  - Issue の `fieldItem()`・`fieldValueContents()`・`fieldValues()`・`getFieldValueByName()`
  - ProjectV2Item の `fieldValues()`・`getFieldValueByName()` (箱に付いている creator も JSON)
  - PullRequest の `repository()`・`author()`
- `Assignee` と `Viewer` のクラスを消しました。(`import { Assignee, Viewer } from 'sogh'` は、使えません)
  - assignees は User を返します。
  - viewer は User にして、`user` の Pool に入れます。(`asyncFetchViewer()` も、`connect()` と同じく User を返します)
- Repository の owner が Organization のときは、User ではなく Organization のモデルになります。
- ProjectV2 の `owner()` は、これまでどおり README の `$Owner` の値 (文字列) を返します。GitHub の owner は、新しい `ownerNode()` で読みます。
- 同じ id の node が来たとき、モデルの core を丸ごと差し替えずに、来た項目だけを重ねます。(重ねるかどうかは updatedAt で決めます。GraphQLNode の `merge(node)`)
- コメントの作成・更新・削除のクエリは、値を GraphQL の variables で渡します。クエリ (`create_issue_comment` など) から、置き換え用の文字列 `@id`・`@body` が無くなりました。

### 足したもの

- モデル: Organization・Bot・Mannequin・EnterpriseUserAccount・DraftIssue・Team
- Pool: organization・bot・mannequin・enterprise-user-account・draft-issue・team・label・milestone (合わせて 15)
- Pooler: `node2organization()` などの、新しい Pool に入れるメソッドと、取り出すメソッド (`organization(id)` など)。`__typename` でモデルを選ぶ `node2model(node)`
- Issue の `comments()`、IssueComment の `editor()`・`pullRequest()`、ProjectV2 の `ownerNode()`
- GraphQLNode の `relation(node)`・`relations(connection)` (関連の JSON から、Pool のモデルを引く)、`merge(node)`・`reload()`
- ProjectV2Item の `isArchived()` (GitHub 標準のアーカイブ状態)
- クエリは、データモデルになる型をどこで取るときも、`__typename`・`id`・`updatedAt` を取ります。
- スクリプト: `npm test`・`npm run check:queries` (クエリを GitHub のスキーマで検査)・`npm run check:live` (GitHub に実際につないで確かめる。読むだけ)

### 直したもの

- `issue_by_id` が、廃止された Projects (classic) の projectCards を取っていたため、GitHub がエラーを返し、`asyncFetchIssueByID` などが Issue を取れなかった。
- 改行や `"` を含む本文で、コメントのクエリが壊れていた。
- `deleteIssueComment` が、GraphQL のエラーでも成功扱いになっていた。
- 再取得や `body()` の変更のあと、Issue の注釈 ($Point・$Owner など) と ProjectV2 の README の属性が、古いまま残っていた。
- body を取っていない node から Issue を作ると、落ちていた。
- ProjectV2Item の `milestone()`・`linkedPullRequests()`・`reviewers()` が、日付の値を返していた。
- `Sogh` の `callback()` が、引数を渡していなかった。`fetchProjectV2ItemsByProjectNext` のクエリ名が誤っていた。`projectsv2_items_by_projects_v2` のクエリが、GraphQL として不正だった。
- `Loader.fetch` が、トークンをクエリとして送っていた。エラーのときに、実際のエラーではなく関数を返していた。
- `Pooler.get()` が、知らない id で、中身の無い ProjectV2 を足していた。

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
