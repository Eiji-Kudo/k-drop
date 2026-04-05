# PR #131 チームレビュー懸念点

## 概要

- **PR**: v1: トップページのデザインを磨いて第一印象を改善する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/131
- **調査日**: 2026-04-05
- **レビュー方式**: 並列レビュー + 修正後の再レビュー

## レビュワー構成

- frontend-reviewer: ホーム画面の実装責務分離、タップ阻害、副作用を確認
- ux-reviewer: 視覚階層、押せる要素の分かりやすさ、アクセシビリティを確認
- test-reviewer: テスト修正の妥当性、flaky 化、回帰リスクを確認

## 未対応の懸念点

- なし

## 対応済みの懸念点

1. **MEDIUM**: `問題を作成` カードが非遷移なのに押せるカードと同じ強さで見えていた
   - 対応: `準備中` 表示と無効スタイルを追加して、押下可能カードと見分けられるように修正

2. **MEDIUM**: `K-DROP HOME` / `TODAY` / `PLAY NOW` などの装飾ラベルが読み上げノイズになっていた
   - 対応: 装飾ラベルを accessibility tree から除外

3. **MEDIUM**: `GroupSelectionScreen` テストヘルパーが `waitFor` 内で複数回 press していた
   - 対応: `act(async)` で単発 press に修正し、状態変化のみを待つ形に整理

## 最終確認

- `npm run lint`: passed
- `npm run test:types`: passed
- `npm run test -- --runInBand`: passed
- 修正後の再レビューで新規懸念なし
