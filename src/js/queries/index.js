// クエリの一覧。
// どのクエリも { query, pick } を export する。(yanqirenshi/SOGH.next#63・yanqirenshi/SOGH.next#65)
//   query … GraphQL のクエリの文字列。値は、GraphQL の variables で渡す。(クエリの頭の宣言を見る)
//   pick  … 応答の data から、取り出す値 (node か、ページ送りする一覧) を返す関数。
export { default as issue_by_id } from './issue_by_id.js';
export { default as issue_by_org_repo_issue_number } from './issue_by_org_repo_issue_number.js';
export { default as issue_comments_by_issue_id } from './issue_comments_by_issue_id.js';
export { default as issue_comments_by_org_repo_issue_number } from './issue_comments_by_org_repo_issue_number.js';
export { default as issues_by_viewer } from './issues_by_viewer.js';
export { default as projectsv2_by_team } from './projectsv2_by_team.js';
export { default as projectsv2_with_items_by_team } from './projectsv2_with_items_by_team.js';
export { default as projectsv2_by_user } from './projectsv2_by_user.js';
export { default as projectv2_by_org_login_projectv2_number } from './projectv2_by_org_login_projectv2_number.js';
export { default as projectv2_by_user_login_projectv2_number } from './projectv2_by_user_login_projectv2_number.js';
export { default as projectv2item_by_id } from './projectv2item_by_id.js';
export { default as projectv2items_by_org_login_projectv2_number } from './projectv2items_by_org_login_projectv2_number.js';
export { default as projectv2items_by_user_login_projectv2_number } from './projectv2items_by_user_login_projectv2_number.js';
export { default as repositories_by_viewer } from './repositories_by_viewer.js';
export { default as viewer } from './viewer.js';

export { default as create_issue_comment } from './create_issue_comment.js';
export { default as delete_issue_comment } from './delete_issue_comment.js';
export { default as update_issue_comment } from './update_issue_comment.js';
