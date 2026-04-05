# PR #145 チームレビュー懸念点

## 概要

- **PR**: [feat] v2: モチベーションUI向けの ViewModel / モックデータ契約を整備する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/145
- **調査日**: 2026-04-05
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

- `type-contract-reviewer`
  - `src/lib/ux/` の型契約と責務分離を見る
- `logic-reviewer`
  - derived 値の計算と edge case を見る
- `testability-reviewer`
  - テスト妥当性と後続 issue での再利用性を見る

## サマリー

| status | count |
| --- | ---: |
| 未対応 | 0 |
| 対応済み | 2 |
| 対応不要 | 0 |

## 未対応の懸念点

なし

## 対応済みの懸念点

### 1. [MEDIUM] 空の結果入力で `accuracy` が `NaN` になる

- **file**: `app/v2/src/lib/ux/quiz-result-view-model.ts`
- **問題点**:
  - `correctCount / data.results.length` をそのまま計算していたため、`results.length === 0` の入力で `NaN` が発生していた。
  - 現状は比較結果がすべて false になって最終 headline に落ちるだけだが、将来 accuracy を表示値として再利用した時に不正値がそのまま伝播する。
- **対応**:
  - `results.length === 0 ? 0 : ...` で明示的に 0 扱いへ変更した。
  - テストに空配列ケースを追加した。

### 2. [MEDIUM] profile mock が `components` と `ux` で二重管理されていた

- **file**: `app/v2/src/lib/ux/mock-state.ts`
- **問題点**:
  - `ux` selector 用の mock state と profile 画面側の mock 定義が別ファイルに散っており、片方だけ更新されると ViewModel 契約と実画面の前提がずれる状態だった。
- **対応**:
  - `app/v2/src/mocks/profile.ts` を追加し、profile 画面側は re-export、`ux` 側はその共通 mock を参照する形へ寄せた。
  - これで `#136` 以降の画面実装でも同じ mock source を再利用できるようにした。

## 対応不要の懸念点

なし
