# GitHub PR レビュー手順ガイド

## 1. 差分を確認する

```bash
# mainブランチとの差分を表示
git diff main
```

## 2. 差分をファイルに保存

```bash
# 差分をdocsディレクトリに保存
git diff main > docs/pr-diff.md
```

## 3. PR説明文を作成

`.github/pull_request_template.md` に従って説明文を作成
`cline/made-description.md`に保存

## 4. 後片付け

```bash
# 差分ファイルを削除
rm docs/pr-diff.md
```
