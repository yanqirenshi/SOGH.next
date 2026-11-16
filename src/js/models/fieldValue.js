// ProjectV2Item のフィールドの値 (fieldValues の nodes の 1 つ。JSON) を読む関数。
// Issue と ProjectV2Item の fieldValueContents(name) が、同じものを呼ぶ。(yanqirenshi/SOGH.next#120)
// モデルの入口 (src/index.js) からは、出さない。

// フィールドの値 (JSON) から、フィールドの種類 (field.dataType) ごとの値を取り出す。
// 値は、フィールドの値の JSON から、そのまま取る。(モデルにはしない。yanqirenshi/SOGH.next#29)
// 知らない種類のときは、null。(エラーは投げない)
export function fieldValueOf (field_item) {
    const type = field_item && field_item.field ? field_item.field.dataType : undefined;

    switch (type) {
    case 'ASSIGNEES':            return { users:        field_item.users };
    case 'REPOSITORY':           return { repository:   field_item.repository };
    case 'LABELS':               return { labels:       field_item.labels };
    case 'TITLE':                return { text:         field_item.text };
    case 'SINGLE_SELECT':        return { optionId:     field_item.optionId };
    case 'DATE':                 return { date:         field_item.date };
    case 'TEXT':                 return { text:         field_item.text };
    case 'NUMBER':               return { number:       field_item.number };
    case 'ITERATION':            return { iterationId:  field_item.iterationId };
    case 'MILESTONE':            return { milestone:    field_item.milestone };
    case 'LINKED_PULL_REQUESTS': return { pullRequests: field_item.pullRequests };
    case 'REVIEWERS':            return { reviewers:    field_item.reviewers };
    default:
        return null;
    }
}
