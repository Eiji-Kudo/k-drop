# PR #150 チームレビュー懸念点

## 概要

- **PR**: [feat] v2: クイズ導線と回答中UXを再設計する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/150
- **調査日**: 2026-04-06
- **レビュー方式**: critics-lite / 手動レビュー
- **レビュー回数**: 1

## レビュワー構成

- `interaction-state-reviewer`: 回答直後の状態遷移と多重入力耐性を確認
- `ux-flow-reviewer`: グループ選択から解説表示までの導線のつながりを確認

## 未対応の懸念点

- なし

## 対応済みの懸念点

### HIGH: 回答ボタンの連打で `onAnswer` が二重実行される余地がある

- **検出者**: `interaction-state-reviewer`
- **対象**: `app/v2/src/components/quiz/ChoicesSection.tsx`
- **問題点**:
  `handleSelect` は `selectedIndex` state だけでガードしていたため、最初の state 反映前に別の選択肢を連打すると `onAnswer` が複数回走りうる。これが起きると `QuizQuestionScreen` 側の `correctCount` と `comboCount` が 1 問で複数回更新され、回答直後の score / combo 表示と実際のセッション状態がずれる。
- **推奨対応**:
  state 反映を待たずに効く同期ロックを `ref` で持ち、最初のタップで即座に回答処理を閉じる。次の問題へ進むタイミングでロックを解除する。
- **対応内容**:
  `selectionLockedRef` を追加し、`handleSelect` の先頭で同期ロックするよう変更した。`handleNext` でロックを解除し、1問につき回答処理が1回だけ走るようにした。

## 最終確認

- **未対応の懸念点**: 0件
- **対応済みの懸念点**: 1件
- **新規発見**: なし
