# PR #145 チームレビュー懸念点

## 概要

- **PR**: [feat] v2: モチベーションUI向けの ViewModel / モックデータ契約を整備する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/145
- **調査日**: 2026-04-05
- **レビュー方式**: critics-lite / 修正反映済み

## レビュワー構成

- `architecture-reviewer`
  - `src/lib/ux` が presentation 側の mock 配置へ逆依存していないか確認
- `logic-reviewer`
  - tier progress / result selector / around-you の edge case を確認

## 未対応の懸念点

- なし

## 対応済みの懸念点

### 1. MEDIUM: 契約層が `components/profile/mock-data` に逆依存していた

- **対象**: `app/v2/src/lib/ux/mock-state.ts`
- **問題点**:
  - `lib/ux` が `components/profile/mock-data` を直接 import しており、契約層が presentation 配下のファイル配置に引きずられていた
  - 今後 `ProfilePage` 側の構成変更で selector が不要に壊れる余地があった
- **対応**:
  - `app/v2/src/mocks/profile.ts` を新設して shared mock state を集約
  - `app/v2/src/components/profile/mock-data.ts` は re-export のみへ変更

### 2. MEDIUM: クイズ結果 selector が 0 件入力で不安定だった

- **対象**: `app/v2/src/lib/ux/quiz-result-view-model.ts`
- **問題点**:
  - `accuracy = correctCount / data.results.length` のため、`results.length === 0` で `NaN` になり得た
  - 空状態や API 接続途中の一時データを渡した場合に headline 判定が壊れる
- **対応**:
  - 0 件時は `accuracy = 0` とするガードを追加
  - `app/v2/src/lib/ux/__tests__/view-models.test.ts` に empty result の回帰テストを追加

## 最終確認

- 未対応の懸念点: 0件
- 対応済みの懸念点: 2件
- 新規発見: なし
