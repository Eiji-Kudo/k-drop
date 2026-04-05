# PR #148 チームレビュー懸念点

## 概要

- **PR**: v2: デザイントークン + 共通シェル + アイコン方針を整備する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/148
- **調査日**: 2026-04-05
- **レビュー方式**: critics-lite / 修正反映済み

## レビュワー構成

- `design-system-reviewer`
  - トークン追加と共通プリミティブが各画面で破綻なく使えるか確認
- `accessibility-reviewer`
  - ナビゲーション、カード、選択ボタンの accessible name と状態表現を確認
- `ux-consistency-reviewer`
  - ホーム、クイズ、ランキング、プロフィールで表記と操作感が揃っているか確認

## 未対応の懸念点

- なし

## 対応済みの懸念点

### 1. MEDIUM: ホームの星評価が視覚アイコンのみになり、既存テストと支援技術向けのラベルが失われていた

- **対象**: `app/v2/src/components/home/WelcomeHeader.tsx`
- **問題点**:
  - 星評価を文字列から `lucide-react` の `Star` アイコンに置き換えたことで、`★★☆☆☆` のテキスト表現が DOM から消えていた
  - 視覚上は問題なくても、読み上げや既存テストが評価状態を取得しにくくなっていた
- **対応**:
  - 星評価コンテナに `sr-only` のラベルを追加し、視覚表現を保ったまま状態説明を復元した

### 2. MEDIUM: グループ選択ボタンの accessible name が見出しと補助文の連結になっていた

- **対象**: `app/v2/src/routes/quiz/index.tsx`
- **問題点**:
  - カード型ボタンに補助文を追加したことで、アクセシブルネームが `BLACKPINK このグループの問題セットに挑戦する` のように冗長になっていた
  - 既存テストと将来のキーボード操作確認で、グループ名単体で選びにくくなる余地があった
- **対応**:
  - `aria-label={group.groupName}` を追加し、見た目の情報量を保ったまま操作名を安定化した

### 3. MEDIUM: プロフィール内のラベルだけ日本語 UI の中で英語が残っていた

- **対象**: `app/v2/src/components/profile/ProfileStats.tsx`, `app/v2/src/components/profile/ProfileProgress.tsx`
- **問題点**:
  - `Otaku Power`, `Fan Since`, `Power Progress`, `Last 7 Days` が他セクションの日本語見出しと混在し、トーンが揃いきっていなかった
- **対応**:
  - `オタ力`, `推し歴`, `推移`, `直近7日` に揃え、プロフィール内の表記を統一した

## 最終確認

- 未対応の懸念点: 0件
- 対応済みの懸念点: 3件
- 新規発見: なし
