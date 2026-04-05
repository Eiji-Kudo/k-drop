# PR #104 対応済みの懸念点

> 未対応の懸念点は [critics-review-pr-104.md](./critics-review-pr-104.md) を参照

## 再発防止すべき知見

### 1. daisyUI の data-theme は `<html>` に配置する

- React コンポーネント内の `<div>` に `data-theme` を置くと、CSS 変数のスコープがその `<div>` 内に限定され、`<body>` やポータルにテーマが適用されない
- これが原因で body の色をハードコードする必要が生じ、テーマ変数との二重管理になった
- SPA では `index.html` の `<html>` タグに静的指定するのが最もシンプル

### 2. daisyUI テーマのベース継承は暗黙の値を残さない

- `base: "valentine"` で未指定のカラー（warning/info/neutral）は valentine から暗黙継承されるが、daisyUI のバージョンアップで値が変わるリスクがある
- カスタムテーマを定義する際は、使用する全カラーを明示的に宣言して暗黙継承に依存しない

### 3. Tailwind v4 は Preflight を自動で含む

- `@import "tailwindcss"` だけで box-sizing、body margin、見出しマージンのリセットが有効になる
- v3 時代の手動リセットを残すと冗長になるだけでなく、「Preflight が効いていないのでは？」という誤認を招く

### 4. daisyUI 5 の `base` オプションは機能しない — 構造的トークンは明示的に定義する

- `@plugin "daisyui/theme"` の `base: "valentine"` はプラグインの予約キーに含まれず、無意味な CSS プロパティとして出力される（silent failure）
- テーマ継承は `allThemes[name]` でのみ機能し、カスタム名のテーマには適用されない
- `--radius-field`, `--radius-box`, `--border`, `--depth`, `--noise` 等の構造的デザイントークンは明示的に定義しないと全コンポーネントの角丸・ボーダー・影が消失する

### 5. テーマカラーのコントラスト比は正確に計算して検証する

- 明るい背景色 + 白テキスト (#ffffff) の組み合わせは WCAG AA 基準を満たさないことが多い
- コントラスト比の推定値（「約 9.0:1」等）は実測と乖離することがある。必ずツールや計算式で正確に求める
- content カラー（バッジ・アラート内テキスト）だけでなく、セマンティックカラーを直接テキスト色として base 背景上で使う場合も別途コントラスト検証が必要（例: `text-accent` on `bg-base-100`）
- 基準未達の場合はカスタムトークン（`--color-accent-on-base` 等）で AA 基準を満たす派生色を用意する

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
| 11 | HIGH | `base: "valentine"` が未サポート、構造的トークン未定義 | `base` 削除、valentine の構造的トークン8つを明示追加 |
| 12 | HIGH | info/success の content カラーが WCAG AA 全基準不合格 | 暗色 content カラーに変更（info: #003d5c, success: #0a3d1a） |
| 13 | MEDIUM | accent/error の content カラーが通常テキスト WCAG AA 不合格 | 暗色 content カラーに変更（accent: #2d0a4e, error: #3d0000） |
| 14 | HIGH | text-accent が base-100 背景上で WCAG AA 未達 (3.56:1) | カスタムトークン `--color-accent-on-base: #7c3aed` を追加（約 5.4:1） |
| 15 | MEDIUM | accent-content/success-content が AA を僅かに下回る | accent-content: #1e0636（約 5.8:1）、success-content: #062d12（約 5.5:1）に微調整 |
| 16 | - | 対応不要と判断 | YAGNI: 各ページが `<main>` を持っており機能。タブバー追加時にリファクタリング |
| 17 | MEDIUM | min-h-screen が 4 層で重複 | 外側に `flex` 追加、内側を `flex-1` に変更して 1 箇所に集約 |
| 18 | - | 対応不要と判断 | YAGNI: Testing Library 哲学に反し、VRT は全画面揃った段階で検討 |
