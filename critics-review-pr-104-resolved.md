# PR #104 対応済みの懸念点

> 未対応の懸念点は [critics-review-pr-104.md](./critics-review-pr-104.md) を参照

## 再発防止すべき知見

### 1. daisyUI の data-theme は `<html>` に配置する

- React コンポーネント内の `<div>` に `data-theme` を置くと、CSS 変数のスコープがその `<div>` 内に限定され、`<body>` やポータル（`createPortal` で body 直下に描画される要素）にテーマが適用されない
- これが原因で body の色をハードコードする必要が生じ、テーマ変数との二重管理になった
- SPA では `index.html` の `<html>` タグに静的指定するのが最もシンプル

### 2. daisyUI テーマのベース継承は暗黙の値を残さない

- `base: "valentine"` で未指定のカラー（warning/info/neutral）は valentine から暗黙継承されるが、daisyUI のバージョンアップで値が変わるリスクがある
- カスタムテーマを定義する際は、使用する全カラーを明示的に宣言して暗黙継承に依存しない

### 3. Tailwind v4 は Preflight を自動で含む

- `@import "tailwindcss"` だけで box-sizing、body margin、見出しマージンのリセットが有効になる
- v3 時代の手動リセットを残すと冗長になるだけでなく、「Preflight が効いていないのでは？」という誤認を招く

## 修正サマリ

| # | 重要度 | 内容 | 修正 |
|---|--------|------|------|
| 1 | HIGH | body のハードコード色値がテーマ変数と二重管理 | CSS 変数 `var(--color-base-100/base-content)` に置き換え |
| 2 | MEDIUM | bg-white がテーマパレット外 | 全箇所 `bg-base-100` に置き換え |
| 3 | MEDIUM | data-theme が `<div>` に配置 | `index.html` の `<html>` に移動 |
| 4 | MEDIUM | warning/info/neutral カラー未定義 | テーマ定義に明示追加 |
| 5 | MEDIUM | Preflight との重複リセット | 冗長な box-sizing/margin/margin-top 宣言を削除 |
| 6 | MEDIUM | button に onClick なし | badge に変更 |
| 7 | MEDIUM | 404 にナビゲーションなし | Link で「トップページに戻る」追加 |
| 8 | MEDIUM | alert に role 属性なし | `role="status"` 追加 |
| 9 | MEDIUM | テストで document.querySelector 使用 | テーマ属性テストを削除（E2E に委ねる） |
| 10 | - | 対応不要と判断 | YAGNI: 要件で「モバイルのみ」と明記済み |
