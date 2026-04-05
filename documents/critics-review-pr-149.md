# PR #149 チームレビュー懸念点

## 概要

- **PR**: v2: ホームをモチベーションハブとして再設計する
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/149
- **調査日**: 2026-04-06
- **レビュー方式**: critics-lite / 修正反映済み

## レビュワー構成

- `ux-flow-reviewer`
  - ホームを開いた直後に主 CTA が認識できるか、導線の強弱が崩れていないかを確認
- `mobile-layout-reviewer`
  - phone shell 幅でカード群が窮屈にならないか、折り返しで情報優先度が崩れないかを確認
- `copy-consistency-reviewer`
  - モック値でも意味が通るコピーになっているか、日本語 UI として違和感がないかを確認

## 未対応の懸念点

- なし

## 対応済みの懸念点

### 1. MEDIUM: 主 CTA が Hero と目標カードの下にあり、短い画面高では最初の視界から外れやすかった

- **対象**: `app/v2/src/components/home/BentoGrid.tsx`
- **問題点**:
  - `問題を解く` の primary card が `次のレベルまで` と `今日の勢い` の後ろに配置されていた
  - ホームの目的は「今日の挑戦を始める画面」なので、短いモバイル画面で主 CTA が fold 下に落ちる順序は issue の受け入れ条件と相性が悪かった
- **対応**:
  - `HomePrimaryActionCard` を最上段へ移動し、Hero の直後に主導線が見える順序へ変更した

### 2. MEDIUM: secondary navigation を 3 カラム化すると、固定幅の phone shell ではカードが窮屈になっていた

- **対象**: `app/v2/src/components/home/BentoGrid.tsx`, `app/v2/src/components/home/BentoCard.tsx`
- **問題点**:
  - ルートシェルが `max-w-md` のため、viewport が広い環境でも実表示幅は狭い
  - その状態で `xl:grid-cols-3` を使うと 3 枚の secondary card が 1 行に詰まり、補助導線としての読みやすさが落ちていた
- **対応**:
  - secondary grid を 2 カラム基準へ戻し、`プロフィール` カードは `sm:col-span-2` でゆとりを確保した
  - あわせて `BentoCard` に `className` を受け渡せるようにしてレイアウト調整を可能にした

### 3. MEDIUM: Hero と momentum セクションに仕様書向けの文言が残り、ユーザー向けコピーとして少し硬かった

- **対象**: `app/v2/src/components/home/WelcomeHeader.tsx`, `app/v2/src/components/home/HomeMomentumChips.tsx`
- **問題点**:
  - `現在の TIER`, `今日の狙い`, `もう進んでいることを見せる` は設計意図は伝わるが、実 UI のラベルとしてはやや説明臭かった
- **対応**:
  - `現在のレベル`, `次の狙い`, `今日の積み上がり` に調整し、日本語 UI として自然なトーンへ寄せた

## 最終確認

- 未対応の懸念点: 0件
- 対応済みの懸念点: 3件
- 新規発見: なし
