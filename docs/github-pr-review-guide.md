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

`.github/pull_request_template.md` に従って説明文を作成:

```markdown
# [簡潔なタイトル]

## 関連Issue
- 

## 関連PR
- 

## 変更点
- 

## 動作確認事項
- 
```

## 4. レビュー実施

1. コード変更を確認
2. 機能テストを実施
3. コメントを追加
