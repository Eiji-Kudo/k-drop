# v2 Motivation UI MVP 仕様

- 作成日: 2026-04-05
- ステータス: Draft

## 目的

`v2` のホームとクイズ結果画面に、最小構成で効くモチベーション要素を入れる。

ここでの目的は、機能を増やすことではなく、以下を UI で感じられる状態を作ること。

- 今の達成
- 次の目標
- 今やる意味
- もう 1 回やる理由

## この仕様で扱う画面

- ホーム `/`
- クイズ結果 `/quiz/result`

## 設計原則

### 1. 遠い大目標より、近い目標を見せる

- `ランキング1位を目指そう` より `あと120ptで次 tier`
- `毎日連続` より `今週あと1回`

### 2. 正誤だけで終わらせず、前進を返す

- `正解`
- `+120 Score`
- `次 tier まで残り 80pt`

### 3. 画面ごとに役割を分ける

- ホーム = 今日やる理由を作る
- 結果 = もう一度やりたくさせる

### 4. 否定的な演出を強くしない

- 失敗や未達成を責めるコピーは避ける
- `streak が切れた` のような表現は MVP では出さない

## ホーム MVP

### 目的

- アプリを開いた瞬間に「今やる意味」を伝える
- クイズ開始までの迷いを減らす

### 画面構成

#### Block A: Hero

表示内容:

- あいさつ or その日のメインコピー
- 現在 tier
- 軽い状況説明

表示例:

- `今日もオタ力を伸ばそう`
- `現在: インターミディエイト`
- `あと1セッションで次のレベルが見えてる`

役割:

- ホームの世界観と今日の温度感を決める

#### Block B: Next Goal Card

表示内容:

- 次 tier までの残り
- 進捗バー
- 補助コピー

表示例:

- 見出し: `次のレベルまで`
- 本文: `あと 120pt で アドバンス`
- 補助: `今日の挑戦で届くかも`

役割:

- 近い目標を明確にする

#### Block C: Today Momentum Chips

表示内容:

- 今週のプレイ進捗
- 直近で伸びたグループ
- 前回からの増加量

表示例:

- `今週 2 / 3 回プレイ`
- `aespa 力 +80`
- `前回より +12%`

役割:

- 「もう進んでいる感」を出す

#### Block D: Primary Quick Start Card

表示内容:

- クイズ開始 CTA
- 期待できる報酬

表示例:

- タイトル: `問題を解く`
- 補助: `最短3分でスコアアップ`
- 補助チップ: `おすすめ`

役割:

- ホームの主導線を一本化する

#### Block E: Secondary Navigation Cards

表示内容:

- 問題作成
- ランキング
- プロフィール

役割:

- 主導線を邪魔しない二次導線にする

## ホーム表示データ

### 最低限必要な ViewModel

```ts
type HomeMotivationViewModel = {
  currentTierName: string
  currentScore: number
  nextTierName: string | null
  pointsToNextTier: number | null
  nextTierProgressPercent: number | null
  weeklyPlayProgressLabel: string | null
  recentGrowthLabel: string | null
  fastestGrowingGroupLabel: string | null
  primaryCtaLabel: string
  primaryCtaHint: string
}
```

### モック値の作り方

- `currentTierName`
  - `Profile` / `score_tiers` 系の tier 名を利用
- `pointsToNextTier`
  - 現在 score と次 tier の `minScore` 差分
- `weeklyPlayProgressLabel`
  - 当面は固定モックでよい
- `recentGrowthLabel`
  - `+12%` など既存の `percentageIncrease` で代用可能
- `fastestGrowingGroupLabel`
  - 当面は固定モックでよい

### エッジケース

- 次 tier がない最上位ユーザー
  - `次のレベルまで` ではなく `最高 tier 到達中`
- 直近の成長データがない
  - `今日の1問目でスタート`
- 初回ユーザー
  - `まずは1回解いてみよう`

## クイズ結果 MVP

### 目的

- セッションの達成感を出す
- 終わったあとに次の挑戦へ戻す

### 画面構成

#### Block A: Result Hero

表示内容:

- 正解数
- セッションスコア
- 総評コピー

表示例:

- `4 / 5 正解`
- `+320 Score`
- `かなり仕上がってきた`

役割:

- 最初の 1 画面で成果を認知させる

#### Block B: Growth Summary Card

表示内容:

- どこが伸びたか
- 次 tier までの残り
- 前回比

表示例:

- `LE SSERAFIM 力がアップ`
- `次の tier まで あと 80pt`
- `前回より +2 問`

役割:

- 今回の挑戦を「成長」として意味づける

#### Block C: Loop-back CTA Cluster

表示内容:

- もう一度解く
- 別グループで挑戦
- 結果詳細を見る

優先順位:

- 第一 CTA: `もう一度解く`
- 第二 CTA: `別グループでも挑戦`
- 補助導線: `回答を見返す`

役割:

- 終了画面ではなく再開画面にする

#### Block D: Answer Review List

表示内容:

- 問題文
- 自分の回答
- 正解
- 解説

役割:

- 学習と納得感を担保する

## 結果画面表示データ

### 最低限必要な ViewModel

```ts
type QuizResultMotivationViewModel = {
  correctCount: number
  totalQuestionCount: number
  gainedScore: number
  resultHeadline: string
  growthLabel: string | null
  pointsToNextTier: number | null
  deltaFromPreviousRunLabel: string | null
  primaryRetryLabel: string
  secondaryRetryLabel: string
}
```

### モック値の作り方

- `gainedScore`
  - 当面は `mockQuizResultData.totalScore` を使用
- `growthLabel`
  - 当面は `BLACKPINK 力アップ` の固定文でもよい
- `pointsToNextTier`
  - 仮の現在 score と次 tier 差分から算出
- `deltaFromPreviousRunLabel`
  - MVP では固定モック可

### 総評コピーのルール

- 高得点
  - `かなり仕上がってきた`
- 中得点
  - `この調子で伸ばせる`
- 低得点
  - `次でしっかり巻き返せる`

禁止:

- `ダメ`
- `弱い`
- `まだまだ`

## 具体的な UI ブロック案

### ホーム

```text
[Hero]
 今日もオタ力を伸ばそう
 現在: インターミディエイト

[Next Goal Card]
 あと 120pt で アドバンス
 [progress bar]
 今日の挑戦で届くかも

[Today Chips]
 今週 2/3回
 aespa 力 +80
 前回より +12%

[Primary Card]
 問題を解く
 最短3分でスコアアップ

[Secondary Cards]
 問題を作成 / ランキング / プロフィール
```

### 結果画面

```text
[Result Hero]
 4 / 5 正解
 +320 Score
 この調子で伸ばせる

[Growth Summary]
 LE SSERAFIM 力アップ
 次の tier まで 80pt
 前回より +2問

[CTA]
 もう一度解く
 別グループでも挑戦

[Review List]
 各問題の復習
```

## 実装候補コンポーネント

- `HomeGoalCard`
- `MomentumChipRow`
- `PrimaryActionCard`
- `ResultHero`
- `GrowthSummaryCard`
- `RetryActionGroup`

## 受け入れ条件

- ホームを見て 3 秒以内に主導線が分かる
- ホームで近い目標が見える
- 結果画面で成果と次の目標が同時に分かる
- 結果画面で再挑戦 CTA が自然に目に入る
- 否定的な印象を強く与えず、もう 1 回やりたくなる

## この後の接続先

- UI/UX 全体計画: [ui-design-brushup-plan.md](/Users/eiji/program/k-drop/app/v2/docs/ux/ui-design-brushup-plan.md)
- ゲーミフィケーション全体計画: [gamification-plan.md](/Users/eiji/program/k-drop/app/v2/docs/ux/gamification-plan.md)
