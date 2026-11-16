// レビュアー (ProjectV2Item の reviewers() が返すモデル) の、名前・リンク・アイコンを、型によらずに読む。
//
// reviewers() には、User・Team・Mannequin・Bot のモデルが混ざる。
//   - User:      name()・login()・url()・avatarUrl()
//   - Team:      name()・slug()・url()・avatarUrl()    (login() は無い)
//   - Mannequin: login()・url()・avatarUrl()           (name() は無い)
//   - Bot:       login()・url()・avatarUrl()           (name() は無い)
// そのため、型を見ずに、メソッドの有無で読む。
// (id の無いものなど、モデルにならなかったものは、reviewers() が外している。yanqirenshi/SOGH.next#39)

function call (reviewer, method) {
    if (!reviewer || typeof reviewer[method]!=='function')
        return null;

    return reviewer[method]() || null;
}

// 名前。name() があれば name()。無ければ login()。それも無ければ slug()。(Team で name() が空のとき)
export function reviewerName (reviewer) {
    return call(reviewer, 'name') || call(reviewer, 'login') || call(reviewer, 'slug');
}

export function reviewerUrl (reviewer) {
    return call(reviewer, 'url');
}

// アイコンの URL。Team は、アイコンが無いとき null。
export function reviewerAvatarUrl (reviewer) {
    return call(reviewer, 'avatarUrl');
}

// 名前の頭文字。(アイコンが無いときに、Avatar の子として出す。大文字にする)
// MUI の Avatar は、src が無いと、alt の頭文字ではなく、人の形の絵を出す。(alt の頭文字は、画像の読み込みに失敗したときだけ)
// 1 文字めは、符号 (code point) の単位で切る。(絵文字など、2 つの符号で 1 文字になるものも、切れない)
// 名前が無いとき (空・空白だけを含む) は null。(そのときは、Avatar の既定の絵のまま)
export function reviewerInitial (reviewer) {
    const name = reviewerName(reviewer);

    if (!name)
        return null;

    const first = Array.from(name.trim())[0];

    if (!first)
        return null;

    // 大文字にすると 2 文字になるもの (ß → SS) も、1 文字だけにする。
    return Array.from(first.toUpperCase())[0];
}

// 表に出すレビュアー。(モデルの配列から、null などを外す)
export function reviewersOf (item) {
    if (!item || typeof item.reviewers!=='function')
        return [];

    return item.reviewers().filter(d=> d);
}
