# cline 用 GitHub PR レビュー手順書

## タスク一覧（GitHub のタスクリスト形式）

- [ ] **ステップ 1 — 差分をファイルに保存する**
  - [ ] `git diff main > docs/pr-diff.md` で差分を保存

- [ ] **ステップ 2 — PR 説明文を作成する**
  - [ ] `.github/pull_request_template.md` を開きタイトルと各項目を記入
  - [ ] 完成した説明文を `cline/made-description.md` に保存
  - [ ] GitHub 上で新規 Pull Request を作成し、説明文とタイトルを貼り付け

- [ ] **ステップ 3 — 後片付け**
  - [ ] `rm docs/pr-diff.md` で差分ファイルを削除
