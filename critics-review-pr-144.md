# PR #144 チームレビュー懸念点

## 概要

- **PR**: app/v2 フロントエンドを route-centered package-by-feature 構成へ移行する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/144
- **調査日**: 2026-04-05
- **レビュー方式**: コンテキスト確認 + ローカル統合レビュー

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `router-reviewer` | TanStack Router / navigation | route group 導入と route id 変化の影響確認 |
| `architecture-reviewer` | 配置方針 / 依存境界 | feature-local code の移設が shared 責務を壊していないか確認 |
| `docs-reviewer` | docs / verification | architecture 文書と実装結果の不整合確認 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 0 | 0 |
| MEDIUM | 1 | 1 |

## 参照したガイドライン

- `CLAUDE.md`
- `README.md`
- `app/v2/README.md`

## 未対応の懸念点

なし

## 対応済みの懸念点

<details>
<summary>1. `src/architecture.md` の Current State / migration example が移行前の説明のまま残っていた（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/architecture.md` |
| 検出者 | `docs-reviewer` |

**問題点**:
`Current State` が `src/components` に feature-local UI が集まっている前提のままで、`Recommended Migration` も未適用の future tense になっていた。今回の PR 自体がその移行を完了させているため、文書を参照した開発者が「まだ移行前」と誤読する状態だった。

**該当コード**:
```md
## Current State

現状の `src/` は次のような分割になっている。
...
├── components/     -> 画面単位 UI がここに集まっている
...
## Recommended Migration
```

**対応**:
`Current State` を移行後の構造に更新し、`Recommended Migration` を `Migration Example` に変更した。`現在/推奨` も `移行前/適用後` に置き換え、実装済みの内容を historical example として読めるようにした。

</details>
