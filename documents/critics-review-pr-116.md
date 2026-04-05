# Critics Review: PR #116 — v2: ホーム画面

**PR**: https://github.com/Eiji-Kudo/k-drop/pull/116
**ブランチ**: issue-88-home-screen → main
**レビュー日**: 2026-04-05
**イテレーション**: 3（最終）

---

## レビュワー構成

| レビュワー | 専門領域 |
|---|---|
| アクセシビリティレビュワー | ARIA、セマンティクス、キーボード操作 |
| アーキテクチャレビュワー | DDD構造、コンポーネント設計パターン |
| コード品質レビュワー | TypeScript、コードスタイル、保守性 |
| テストレビュワー | テストカバレッジ、テスト品質 |

---

## 懸念点一覧

### CRITICAL

なし

### HIGH

#### H-1: BentoCard にインタラクティブ要素がない（アクセシビリティ）
- **ファイル**: `app/v2/src/components/home/BentoCard.tsx`
- **詳細**: `active:scale-[0.97]` のトランジションが適用されており、ユーザーがタップ/クリックする前提のUIだが、`<div>` にはクリックハンドラも `role` も `tabIndex` もない。現時点ではモックのため機能がないが、`active:` による視覚的フィードバックは「操作可能」と誤認させる可能性がある
- **推奨**: モック段階では `active:scale-[0.97]` を削除するか、将来的にボタン/リンクに変更される前提であればそのまま `<button>` または `<a>` に変更する
- **ステータス**: 対応済み（`active:scale-[0.97]` と `transition-transform` を削除）

#### H-2: WelcomeHeader のセマンティクスが不足
- **ファイル**: `app/v2/src/components/home/WelcomeHeader.tsx`
- **詳細**: ヘッダーコンポーネントだが `<header>` や見出しタグ (`<h1>`, `<h2>`) が使われていない。「オタ力バトルしよう！」は `<p>` タグで表現されている。ページの主要ヘッダーとして `<section>` + `<h2>` 等で構造化すべき
- **推奨**: `<p className="text-xl ...">` を `<h2 className="text-xl ...">` に変更
- **ステータス**: 対応済み（`<p>` を `<h2>` に変更）

### MEDIUM

#### M-1: ハードコードされた色 `#ff6faa`
- **ファイル**: `app/v2/src/components/home/BentoCard.tsx` (行17)
- **詳細**: `to-[#ff6faa]` がハードコードされている。daisyUI のテーマカラーシステムを使うべき。テーマ切り替え時にこの色だけ変わらない
- **推奨**: daisyUI のテーマカラー（例: `to-secondary`）に置き換えるか、CSS変数で管理する
- **ステータス**: 対応済み（`to-[#ff6faa]` を `to-secondary` に変更）

#### M-2: ハードコードされた色 `from-white`
- **ファイル**: `app/v2/src/components/home/WelcomeHeader.tsx` (行10)
- **詳細**: `from-white` がハードコードされている。ダークテーマ対応時にこの色が浮く可能性がある。`from-base-100` 等テーマ対応カラーを使うべき
- **推奨**: `from-white` を `from-base-100` に変更
- **ステータス**: 対応済み（`from-white` を `from-base-100` に変更）

#### M-3: `levelStars` に境界値バリデーションがない
- **ファイル**: `app/v2/src/components/home/WelcomeHeader.tsx`
- **詳細**: `levelStars` は `number` 型で、負数や 5 を超える値も受け付ける。0-5 の範囲制約がない
- **推奨**: 型レベルまたはランタイムで 0-5 の制約を加える（例: `Math.min(5, Math.max(0, levelStars))` でクランプ）
- **ステータス**: 対応済み（`Math.min(5, Math.max(0, Math.floor(levelStars)))` でクランプ）

#### M-4: `constants/app.ts` が未使用になっている可能性
- **ファイル**: `app/v2/src/constants/app.ts`
- **詳細**: PRで `APP_NAME`, `APP_DESCRIPTION`, `TOOLING` のインポートが削除されたが、`constants/app.ts` 自体が残っている。他に参照箇所がなければデッドコード
- **推奨**: 他に参照がなければ削除を検討（ただし今後使う可能性があるなら残してもよい）
- **ステータス**: 対応済み（参照なしのため削除）

### LOW

#### L-1: BentoGrid のカード内容がハードコードされている
- **ファイル**: `app/v2/src/components/home/BentoGrid.tsx`
- **詳細**: カードのデータ（タイトル、アイコン等）がJSX内に直接記述されている。配列データとして切り出せば保守性が上がるが、モック段階では許容範囲
- **推奨**: 対応不要（モック段階のため）
- **ステータス**: 対応不要

#### L-2: 絵文字アイコンのクロスプラットフォーム一貫性
- **ファイル**: `app/v2/src/components/home/BentoGrid.tsx`
- **詳細**: 🪖 (U+1FA96) や 👤 (U+1F464) 等の絵文字はOS/ブラウザによって表示が異なる。将来的にはアイコンライブラリの使用を検討
- **推奨**: 対応不要（モック段階のため）
- **ステータス**: 対応不要

---

## クロス検証結果

- テストは全13件パスしている
- 型チェック (`tsc -b`) パス
- lint エラーは `api.test.ts` の既存問題のみ（本PRの変更範囲外）
- 新規コンポーネント3ファイルは `src/components/home/` に適切に配置されている（CLAUDE.md の構造ガイドに準拠）

---

---

## イテレーション2: 再レビュー結果

### 新規発見

#### M-5: gradient variant のテキストコントラスト不足
- **ファイル**: `app/v2/src/components/home/BentoCard.tsx` (行17)
- **詳細**: `from-primary (#ff9fcc) to-secondary (#ffd9eb)` のグラデーション上に `text-white` を使用しているが、いずれの色も明るいピンクのため白文字とのコントラスト比が WCAG AA 基準 (4.5:1) を大幅に下回る（primary: ~1.85:1、secondary: ~1.23:1）。`text-primary-content (#4f2443)` を使えばテーマの意図に沿った高コントラストが得られる
- **推奨**: gradient variant の `text-white` を `text-primary-content` に変更
- **ステータス**: 対応済み（`text-white` → `text-primary-content`、`text-white/80` → `text-primary-content/80`）

---

---

## イテレーション3: 再レビュー結果

新規発見なし。すべての懸念点が対応済み。

---

## 総評

モック段階のホーム画面実装として適切な規模感。全3イテレーションで計7件の懸念点を発見し、5件をコード修正、2件を対応不要と判断。新規発見がなくなったためレビュー完了。
