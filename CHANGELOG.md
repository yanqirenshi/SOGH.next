# 更新履歴

## 0.5.0

古い世代の取得のメソッド (`fetch〜`) を消して、`asyncFetch〜` にそろえました。
また、Sogh のメソッドから使われていないクエリを、すべて消しました。
取得のクエリを、値を GraphQL の variables で渡す形に書き直し、`asyncFetch〜` が失敗したときは例外を投げるようにしました。
あわせて、Projects (classic) のモデルや、Issue を作るための部品など、使われていない古いものを消しました。
(yanqirenshi/SOGH.next#61・yanqirenshi/SOGH.next#62・yanqirenshi/SOGH.next#63・yanqirenshi/SOGH.next#65・yanqirenshi/SOGH.next#66・yanqirenshi/SOGH.next#67・yanqirenshi/SOGH.next#68・yanqirenshi/SOGH.next#69・yanqirenshi/SOGH.next#70・yanqirenshi/SOGH.next#71・yanqirenshi/SOGH.next#73・yanqirenshi/SOGH.next#74・yanqirenshi/SOGH.next#75・yanqirenshi/SOGH.next#76・yanqirenshi/SOGH.next#77・yanqirenshi/SOGH.next#81・yanqirenshi/SOGH.next#82・yanqirenshi/SOGH.next#83・yanqirenshi/SOGH.next#84・yanqirenshi/SOGH.next#85・yanqirenshi/SOGH.next#86・yanqirenshi/SOGH.next#87・yanqirenshi/SOGH.next#89・yanqirenshi/SOGH.next#90・yanqirenshi/SOGH.next#91・yanqirenshi/SOGH.next#94・yanqirenshi/SOGH.next#95)

### 利用側への影響 (破壊的な変更です)

- `Sogh` の、古い世代の取得のメソッド (`fetch〜`) を 8 個、消しました。代わりに、`asyncFetch〜` を使ってください。

  | 消した `fetch〜` | 代わりに使うもの |
  | --- | --- |
  | `fetchRepositoriesByViewer(success, fail)` | `asyncFetchRepositoriesByViewer()` |
  | `fetchIssueByID(id)` | `asyncFetchIssueByID(id)` |
  | `fetchIssueCommentsByIssueID(id)` | `asyncFetchIssueCommentsByID(id)` |
  | `fetchProjectsV2ByUser(user, success, fail)` | `asyncFetchProjectsV2ByViewer()` (viewer のプロジェクトだけ。ほかのユーザーは指定できない。`connect()` で viewer を入れておく必要がある) |
  | `fetchUserByID(id, success, fail)`・`fetchProjectsV2ByID(id, success, fail)`・`fetchProjectV2ItemsByProjectNext(project, success, fail)` | 無い |
  | `fetchProjectNextItemByID(id)` | 無い (いまの GitHub では、動かなかった) |

- `fetch〜` と `asyncFetch〜` の違い:
  - `fetch〜` は、コールバックか、`{ status, data }` (失敗したときは `{ status: 'error', error }`) を返す Promise で結果を渡した。`data` は `{ contents, pageInfo }` の形 (`contents` は id か、id の配列)。
  - `asyncFetch〜` は、async 関数で、id か、id の配列を返す。(コールバックは取らない)
  - `fetch〜` は、最初のページ (100 件) だけを取った。`asyncFetch〜` は、最後のページまで取る。(`asyncFetchIssueByID(id)` は 1 件)
  - `fetch〜` は、GraphQL のエラー (`errors`) を見なかった。(`data` が null のときは、取り出しで TypeError になり、それがエラーとして渡った) `asyncFetch〜` は、`errors` を見て、失敗したときは例外を投げる。(下を見る)
  - コールバックを取る 5 つの `fetch〜` は、成功したときに `success` のあとで `fail` も呼び、失敗したときは `fail` を呼んでいなかった。(内部の `fetchX` に、引数を 1 つずれて渡していたため)

- `asyncFetch〜` (16 個) は、失敗したときに、例外 `GitHubError` を投げるようになりました。(yanqirenshi/SOGH.next#61) `try { … } catch (e) { … }` (または、Promise の `catch`) で受けてください。
  - これまでは、失敗したときに、エラー (Error。HTTP のエラーのときは fetch の Response) を戻り値として返していました。`asyncFetchRepositoriesByViewer()`・`asyncFetchIssueByViewer()`・`asyncFetchProjectsV2ByViewer()` は、途中のページで失敗すると、それまでに集めた id の配列を返していました。
  - 成功したときの戻り値 (id、または id の配列。`asyncFetchViewer()` は User のモデル) は、変わりません。
  - `GitHubError` は、パッケージの入口から読めます。(`import { GitHubError } from 'sogh'`。`e instanceof GitHubError` で見分けられます)
  - `GitHubError` は Error で、次の値を持ちます。
    - `name` … `'GitHubError'`
    - `status` … HTTP の状態コード。(GraphQL のエラーのときは、ふつう 200。つながらなかったときは null)
    - `errors` … GitHub の応答の `errors` (配列)。GraphQL のエラーでないときは null。
    - `response` … fetch の Response。(つながらなかったときは null)
    - `cause` … つながらなかったときの、元の例外。
  - 応答に、取り出す値が無いとき (たとえば、`node` が null) も、`GitHubError` を投げます。
  - コールバックを受け取るメソッドは、失敗したとき、`failed(error, …)` を呼んでから、例外を投げます。`failed` の 1 つめの引数は、投げる `GitHubError` です。
    - `asyncFetchProjectsV2ByTeam`・`asyncFetchProjectsV2WithItemsByTeam`: `failed(error, それまでの id の配列)`。(これまでは `failed(それまでの id の配列)`)
    - `asyncFetchProjectV2ByUserLoginProjectV2Number`: `failed(error, login, number)`。(これまでは `failed()`)
    - `asyncFetchProjectV2ByOrgLoginProjectV2Number`: `failed(error, login, number)`。(これまでと同じ形。error が `GitHubError` になる)
  - コメントの追加・更新・削除 (`createIssueComment`・`updateIssueComment`・`deleteIssueComment`) の動きは、変わりません。(例外は投げず、`failed` を呼ぶ)
- クエリの名前のつづりを直しました。`sogh.query(code)` で、名前で取っていた場合は、新しい名前にしてください。(yanqirenshi/SOGH.next#73)
  - `viwer` → `viewer`
  - `issues_by_viwer` → `issues_by_viewer`
- 取得のクエリも、値を GraphQL の variables で渡す形になりました。(yanqirenshi/SOGH.next#63)
  - クエリの文字列に、値の印 (`@id`・`@login`・`@user-login` など) と、ページ送りの印 (`after: ""`) は、もうありません。`sogh.query(code)` で取ったクエリに、文字列の置き換えで値を入れていた場合は、variables で渡してください。(変数の名前は、クエリの頭の宣言を見てください。ページ送りは、変数 `after`。1 ページめは null)
  - `sogh.query(code)` は、これまでどおり、クエリの文字列を返します。
  - 新しく、`sogh.queryDefinition(code)` で、`{ query, pick }` を取れます。(`pick` は、応答の `data` から、取り出す値を返す関数。yanqirenshi/SOGH.next#65)
  - 番号の引数 (Issue の番号・ProjectV2 の番号) は、数値にしてから送ります。(これまでどおり、文字列でも渡せます)
- `Loader` の `makeQuery(query, endCursor)` を消しました。(ページ送りの印を書き換える部品。variables にしたので、使わなくなった)
- ProjectV2Item の content の PullRequest は、`state` を別名 `pullRequestState` で取ります。(yanqirenshi/SOGH.next#68)
  - Pool に入れる前に `state` に戻すので、これまでと同じく `state` の名前で読めます。
    - PullRequest のモデル (Pool の PullRequest) の core
    - ProjectV2Item の core に残る content の JSON (`item.core().content`)
- ProjectV2 の `owner()` は、GitHub の owner のモデル (User・Organization・Issue・PullRequest のどれか) を返すようになりました。(Repository の `owner()` と同じ意味。yanqirenshi/SOGH.next#71)
  - これまでの `owner()` は、README の `$Owner` の値 (文字列) を返していました。README の `$Owner` は、`readmeOwner()` で読んでください。(値を入れるときも `readmeOwner(v)`)
  - `ownerNode()` は、消しました。`owner()` を使ってください。
- `Issue` の `owner()` を、`bodyOwner()` に変えました。(本文の `$Owner` の値 (文字列) を返す。無いときは null。yanqirenshi/SOGH.next#85)
  - GitHub の Issue には owner が無いので、`owner()` は無くしました。(代わりのものは、ありません)
  - 本文から読む、ほかの値 (`points()`・`dueDate()`・`nextActionDate()`) の名前は、変わりません。
- `ProjectV2` の `maneger(v)` を消しました。README の `$Owner` は、`readmeOwner(v)` で読んでください。(同じ値を読み書きしていた。yanqirenshi/SOGH.next#86)
- `Issue` の `addAnotetionValue(issue)` を消しました。(どこからも呼ばれず、渡したモデルの `owner()` をプロパティで隠してしまっていた。本文の注釈は、`parseBody(issue)` が読みます。yanqirenshi/SOGH.next#87)
- `Issue` の `addAnotetionValueNew(issue)` を、`parseBody(issue)` に名前を変えました。(引数と、することは同じ。古い名前は残していません。yanqirenshi/SOGH.next#91)
- `ProjectV2` の README に書いていない属性は、null ではなく、初めの値を返すようになりました。(yanqirenshi/SOGH.next#90)
  - `priority()`・`readmeOwner()`・`type()`・`release()` は `'?'`。`action()`・`backlog()`・`customer()`・`agency()`・`scenario()`・`progress()` は `''`。`systems()` は `[]`。
  - これまでは、README を読むときに null で上書きしていました。null かどうかで「書いていない」を見分けていた場合は、初めの値で見分けてください。
  - README に書いてあるときの値と、`plan()`・`result()` の動きは、変わりません。
  - 取り直しで README から属性が消えたときも、初めの値に戻ります。
  - `ProjectsV2` の表では、Type・Owner・Release の列に、空ではなく `?` が出ます。Priority の列は「謎 (null)」から「謎 (?)」になります。
- `ProjectsV2` の表の既定の列のうち、Owner の列の `code` を、`'owner'` から `'readmeOwner'` に変えました。(見出しは `Owner` のまま。README の `$Owner` を出す列で、ProjectV2 の `owner()` とは別のもの。yanqirenshi/SOGH.next#89)
- パッケージの入口から、Projects (classic) のモデル `Project`・`Card`・`Column` を消しました。`models` の中からも消しました。(yanqirenshi/SOGH.next#81)
- `Issue` のメソッドを 9 個、消しました。
  - Projects (classic) 用 (6 個): `projectCards()`・`getColumnFirst()`・`getFirstColumnProject()`・`getFirstColumnProjectID()`・`projects()`・`projectIds()`。(yanqirenshi/SOGH.next#82。同じ所にあった `milestoneId()` は、残しています)
  - Issue を作るための部品 (3 個): `makeIssueData()`・`issueData2requestDataDescription(data)`・`issueData2requestData(data)`。(yanqirenshi/SOGH.next#83)
- `Loader` のメソッドを 3 個、消しました。
  - `fetch(query, success, error)`。(yanqirenshi/SOGH.next#84。取得は `asyncFetch〜` か、`request(query, variables)` を使ってください)
  - `makeGraphQLData(data)`・`makeGraphQLDataItem(v)`。(Issue を作るための部品。yanqirenshi/SOGH.next#83)

### 消したもの

- `Sogh` の補助のメソッド `data2data(data, make, appender)`・`zzz(data, make)` と、`Loader` の `ensureEndCursor(query, endCursor)`。(`fetch〜` だけが使っていた)
- `Sogh` の補助のメソッド `node2objs(node_or_nodes, make)`。(取得の書き直しで、使う所が無くなった。`asyncFetch〜` は `connection2ids(connection, make)` を使う)
- クエリ `projects_next_items_by_id`。(いまの GitHub には、`ProjectNextItem` という型が無く、動かなかった。yanqirenshi/SOGH.next#67)
- Sogh のメソッドから使われていないクエリを、18 個消した。(yanqirenshi/SOGH.next#66)
  - `sogh.query(code)` で、名前で取っていた場合は、取れなくなります。(`undefined` が返ります)
  - 前から使われていなかったもの (15 個): `assignees_by_repository`・`create_issue`・`issues_by_milestone`・`issues_by_report_label`・`issues_by_repository`・`issues_open_by_label`・`issues_open_by_project_column`・`issues_open_by_repository`・`labels_by_repository`・`milestones_by_repository`・`project_by_id`・`projects_by_repository`・`repository`・`search_issues`・`update_issue_body`
  - `fetch〜` を消して、使われなくなったもの (3 個): `user_by_id`・`projects_next_by_id`・`projectsv2_items_by_projects_v2`
  - 残ったクエリは 18 個で、どれも Sogh のメソッドが使っている。
- Projects (classic) のモデルのファイル `src/js/models/Project.js`・`Card.js`・`Column.js`。(yanqirenshi/SOGH.next#81)
- 古い文書 `src/js/README.md`・`src/js/models/README.markdown`。(いまのコードと合っていなかった。パッケージにも、入らなくなります。yanqirenshi/SOGH.next#77)
- `Issue.js` の `moment` の import。(Issue を作るための部品だけが使っていた。package.json の依存は、そのまま)
- `Issue` の属性 `regex` (本文の注釈を読む正規表現の表)。どこからも使われていなかった。(yanqirenshi/SOGH.next#95)
  - 点数の 4 つは、整数だけを読む古い書き方で、本文を読むメソッド (小数も読む) とは違っていました。`issue.regex` を読んでいた場合は、本文を読むメソッド (`points()`・`getPointFromBody(body)` など) を使ってください。
  - 本文を読むメソッドの中の正規表現は、変わりません。
- クエリの項目の部品 (`src/js/queries/attributes.js`) のうち、どのクエリからも使われなくなった 7 個。(`project`・`project_card`・`project_column` (Projects (classic) 用) と、`project_next`・`project_next_fields`・`project_next_item`・`project_next_item_field_value` (古い Projects 用))

### 変わった動き

- ProjectV2Item の fieldValues と、その中の labels・pullRequests の件数の上限を、どのクエリも 30 にそろえました。(yanqirenshi/SOGH.next#75)
  - これまでは、クエリによって 20 か 30 でした。20 だったのは `asyncFetchProjectsV2WithItemsByTeam` と `asyncFetchProjectV2ByOrgLoginProjectV2Number` のクエリです。
  - チームの ProjectV2 を Item 付きで取るクエリの「ProjectV2 が 1 ページに 10 個・Item が 50 個」は、変わりません。
- クエリの項目の部品 (`src/js/queries/attributes.js`) の名前を、小文字で始まり途中が大文字、にそろえ、返す形を「項目だけを返す」にそろえました。上限の値 (`NESTED_LIMIT`) も、ここの 1 か所で決めます。(yanqirenshi/SOGH.next#74・yanqirenshi/SOGH.next#75。パッケージの外には、影響しません)
- `deleteIssueComment` は、成功したら、`successed` を呼ぶ前に、消したコメントを Pool からも消します。(yanqirenshi/SOGH.next#69)
- `Loader` の `fetchX` も、送り先を `endpoint()` から取ります。(これまでは URL を直に書いていた。yanqirenshi/SOGH.next#76)
- hub のひな形 (`hub/.env.local.template`) の、個人用アクセストークンの所に、注意を書きました。(この値はビルドした JS に埋め込まれるので、ビルドは手元以外に置かない。yanqirenshi/SOGH.next#70。パッケージには入りません)
- `ProjectsV2` の表の Plan・Result の Start・End の列に、日付を出すようにしました。(これまでは、いつも空でした。yanqirenshi/SOGH.next#94)
  - Plan は `plan()`、Result は `result()` の start・end を、README に書いた日付の文字列のまま出します。書いていないときは、空のままです。
  - 列の `code`・グループ・見出しは、変わりません。

### 足したもの

- `Loader` の `request(query, variables)`: クエリを 1 回送り、応答の `data` を返す。失敗したときは `GitHubError` を投げる。
- `Sogh` の `queryDefinition(code)`: クエリの定義 `{ query, pick }` を返す。
- `Sogh` の取得の部品 `fetchNode(code, variables)`・`fetchPages(code, variables, onPage)`・`connection2ids(connection, make)`・`fetchProjectsV2OfTeam(code, team_id, callbacks)`。(`asyncFetch〜` が使う)
- 例外のクラス `GitHubError`。(`src/js/Loader.js`。パッケージの入口から、名前付きで export している。`import { GitHubError } from 'sogh'`)
- `Pool` の `remove(id)` と `clear()`。(yanqirenshi/SOGH.next#69)
  - `remove(id)`: id のモデルを、表と一覧の両方から消し、消したモデルを返す。無いときは null。
  - `clear()`: すべて消す。
  - 古いものを、自動で消す仕組み (期限) は、持ちません。
- `ProjectV2` の `readmeOwner(v)`: README の `$Owner` の値を読む・入れる。(これまでの `owner()`。yanqirenshi/SOGH.next#71)

## 0.4.2

ProjectV2 の Item の表で、Item の content が無いときに落ちる場合があったのと、閉じた日の書式の誤りを、直しました。
また、使われていなかったファイルを 20 個 (部品 19 個・モデル 1 個) 消しました。
入口からモデルを export し、モデルの型の名前を返す `typename()` を足しました。
PullRequest の `repository()`・`author()` も、モデルを返すようにしました。
Issue を取り直したときに、プロジェクトへの出し入れと、Item のフィールドの値の変更が、反映されない場合があったのを、直しました。
(yanqirenshi/SOGH.next#36・yanqirenshi/SOGH.next#37・yanqirenshi/SOGH.next#38・yanqirenshi/SOGH.next#41・yanqirenshi/SOGH.next#42・yanqirenshi/SOGH.next#45・yanqirenshi/SOGH.next#49・yanqirenshi/SOGH.next#51・yanqirenshi/SOGH.next#54・yanqirenshi/SOGH.next#59・yanqirenshi/SOGH.next#60・yanqirenshi/SOGH.next#64)

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
- npm のパッケージに、入れるつもりの無いファイルが入っていた。(#54)
  - パッケージに入るファイルを、`dist/` (ビルドしたもの)・`CHANGELOG.md` と、npm がいつも入れる `package.json`・`README.org`・`LICENSE` だけにした。(`package.json` の `files` に書いた。`.npmignore` は消した)
  - これまでは、`hub/`・`scripts/`・`test/` なども入っていた。
  - ビルド (`npm run transpile`) の前に、`dist/` を空にするようにした。(消したファイルの、古いビルドが残らないように)
- Issue を取り直しても、プロジェクトへの出し入れと、Item のフィールドの値の変更が、反映されない場合があった。(#51)
  - Issue をプロジェクトに足す・外すときや、Item のフィールドの値 (Status・日付など) を変えたとき、GitHub は Issue の `updatedAt` を動かさない。(`npm run check:updated-at` で調べた)
  - そのため、日時が同じとみなされ、Issue の core の `projectItems` が、古いままだった。`projectV2Items()` と、`projectItems` を直に読むメソッド (`fieldValues()`・`dueDate()`・`nextActionDate()` など) が、古い値を返していた。
  - Issue の `projectItems` だけは、日時が同じときも、来た値と手元の値の中身を比べて、違えば重ねるようにした。(ほかのモデル・ほかの項目の重ね方は、変わらない)
  - GraphQLNode の `merge(node)` は、このときに `'refreshed'` を返す。モデルごとに、この扱いをする項目を `sameTimeKeys()` で指定する。(Issue は `projectItems`)
  - 0.4.0 (node を重ねるようにした版) からあった不具合です。
- Issue の `fieldValues()`・`getFieldValueByName(name)`・`dueDate()`・`nextActionDate()` が、`projectItems` を取っていない Issue (`asyncFetchIssueByID()` などで取ったもの) で、TypeError で落ちていた。(#59)
  - `projectItems` が無いとき・プロジェクトに入っていないとき・Item に `fieldValues` が無いときは、`fieldValues()` は空の配列を、ほかの 3 つは null を返すようにした。
  - `fieldValueContents(name)` も、Item に `fieldValues` が無いときに、落ちずに null を返すようにした。
  - フィールドの値に、`field` の無いもの (null など) が混ざっていても、落ちない。
  - 0.3.0 からあった不具合です。
- Issue の部品 (`PanelIssue`) の再取得のボタンが、`actions.issue.refresh` の 1 つめの引数に、Issue の id の値ではなく、メソッド (`issue.id`) そのものを渡していた。(#60)
  - id の値 (`issue.id()`) を渡すようにした。
  - 0.3.0 からあった不具合です。
- ProjectV2 の Item を取る `asyncFetchProjectV2ItemsByUserLoginProjectV2Number` と `asyncFetchProjectV2ItemsByOrgLoginProjectV2Number` が、最初のページ (100 件) しか取っていなかった。(#64)
  - 最後のページまで取るようにした。(クエリで `pageInfo` を取り、`hasNextPage` が false になるまで繰り返す)
  - 戻り値は、これまでどおり、Item の id の配列。(全ページ分) 途中で失敗したときも、これまでどおり、エラーを返す。
  - 古い世代の `fetchProjectV2ItemsByProjectNext` は、まだ最初のページだけを取る。
  - 0.3.0 からあった不具合です。

### 変わった動き

- PullRequest の `repository()` と `author()` が、JSON ではなく、モデルを返すようになった。(#49)
  - `repository()` は Repository のモデル、`author()` は人のモデル (User・Organization・Bot・Mannequin・EnterpriseUserAccount のどれか) を返す。関連が無いときは null。
  - Matchmaker が、PullRequest の repository と author を、Pool に入れる。(assignees と同じ)
  - いまは、どのクエリも PullRequest の repository と author を取っていないので、これまでと同じく null が返り、利用側への影響はありません。

### 消したもの

`dist/` の中のファイルを直接 import している場合は、下のファイルは読めなくなります。(パッケージの入口 `sogh` から読んでいる場合は、影響はありません)

- 使われていなかった部品 `src/components/common/Label.js` と `src/components/common/UserName.js` を消した。(#37)
  - どちらも、パッケージの入口 (`src/index.js`) からは export していなかった。
  - 値を JSON として読む、古い読み方のままだった。
- 入口 (`src/index.js`) から届かず、どこからも import されていなかったファイルを、18 個消した。(#45)
  - 部品 (17 個。`src/components/` の下)
    - `DraftIssue.js`
    - `PullRequest.js`
    - `RedactedItem.js`
    - `ProjectV2.js`
    - `common/Description.js`
    - `common/IssueTitle.js`
    - `common/TableCellLinkGithub.js`
    - `common/TableCellLinkSogh.js`
    - `common/TableCellProjectNextItemContent.js`
    - `common/TableCellProjectV2ItemFieldValue.js`
    - `common/TableCellTerm.js`
    - `common/TableCellTermPlanResult.js`
    - `common/TableCellTimestamps.js`
    - `project_next_items/table/CellFieldLabel.js`
    - `project_next_items/table/CellFieldValue.js`
    - `project_next_items/table/CellTitle.js`
    - `projectsV2/TableCellPlan.js`
  - モデル (1 個)
    - `src/js/models/Relationship.js`
  - 同じ名前のモデル (`src/js/models/DraftIssue.js`・`PullRequest.js`・`ProjectV2.js`) は、消していません。

### 足したもの

- パッケージの入口から、モデルを、まとめて `models` という 1 つの名前で export する。(#38)
  - 使い方: `import { models } from 'sogh'` として、`models.ProjectV2Item`・`models.User` のように読む。
  - `models` には、18 個のモデルが、すべて入る。(Bot・Card・Column・DraftIssue・EnterpriseUserAccount・Issue・IssueComment・Label・Mannequin・Milestone・Organization・Project・ProjectV2・ProjectV2Item・PullRequest・Repository・Team・User)
  - 1 つずつの名前にしないのは、モデルの ProjectV2Item が、入口がすでに export している部品の `ProjectV2Item` と、名前が重なるため。
  - いままでの export (部品と、モデルの Card・Column・Issue・Label・Milestone・Project・Repository) は、そのまま。`models.Issue` と `Issue` は、同じクラス。
- GraphQLNode に、型の名前を返す `typename()` を足した。(#38)
  - core の `__typename` を返す。(例: `"User"`・`"Bot"`・`"Issue"`)
  - core に `__typename` が無いときは、null を返す。
  - 型が複数ある関連 (`issue.author()`・`item.content()`・`item.reviewers()` など) が返したモデルを、見分けるのに使う。`instanceof models.Bot` のように、クラスでも見分けられる。
- 開発用のスクリプト `npm run check:updated-at` を足した。GitHub に実際につないで、Issue・ProjectV2Item・ProjectV2 の `updatedAt` が、どの変更で動くか (関連が変わったのに、動かない変更があるか) を確かめる。(#51。読むだけ。sogh の動きは変わらない)
- 開発用のスクリプト `npm run check:pack` を足した。npm のパッケージに入るファイルを確かめ、入れるつもりの無いファイルがあれば、失敗にする。公開の前 (`prepublishOnly`) に、ビルドのあとで動く。(#54)

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
