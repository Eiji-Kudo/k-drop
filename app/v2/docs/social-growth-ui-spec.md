# v2 Social / Growth UI 仕様

- 作成日: 2026-04-05
- ステータス: Draft

## 目的

ランキングとプロフィールに、それぞれ異なるモチベーション役割を持たせる。

- ランキング = 競争したくなる
- プロフィール = 成長が積み上がっていると感じる

## 基本方針

### ランキング

- 全体 Top だけで完結させない
- 自分に近い比較対象を見せる
- 劣等感より「届きそう感」を作る

### プロフィール

- 数字の羅列にしない
- 現在地と次の目標をセットで見せる
- バッジ、推し、成長を 1 つの物語として見せる

## ランキング UI 仕様

### 目的

- 競争の熱量を出す
- ただし、下位側のユーザーを冷やしすぎない

### 画面構成

#### Block A: Scope Header

表示内容:

- ランキング画面タイトル
- scope 説明

表示例:

- `ランキング`
- `総合とグループ別で今の立ち位置をチェック`

#### Block B: Pill Tabs

表示内容:

- `総合`
- グループ別タブ群

役割:

- 切り替えの意味を見失わせない

#### Block C: Top 3 Spotlight

表示内容:

- 1位、2位、3位
- score
- tier

役割:

- 画面の見せ場

注意:

- 4位以下と同じリストにしない
- 競争の象徴として分離表示する

#### Block D: Around You

表示内容:

- 自分の順位
- 前後 2 人程度
- 次に抜ける相手との差

表示例:

- `あなたは 13位`
- `12位まであと 230pt`
- `同 tier 内であと 1人抜ける`

役割:

- 遠い 1 位より近い目標を見せる

#### Block E: Full List

表示内容:

- その scope の一覧

役割:

- 全体像を見せる
- ただし、主役は Top 3 と Around You に置く

## ランキング ViewModel

```ts
type RankingMotivationViewModel = {
  scopeLabel: string
  topThree: Array<{
    rank: number
    userName: string
    tierName: string
    score: number
  }>
  aroundYou: {
    myRank: number
    myScore: number
    myTierName: string
    neighbors: Array<{
      rank: number
      userName: string
      tierName: string
      score: number
      isSelf?: boolean
    }>
    pointsToNextRank: number | null
  } | null
  fullList: Array<{
    rank: number
    userName: string
    tierName: string
    score: number
  }>
}
```

## ランキングのエッジケース

- 自分が Top 3 の場合
  - Around You は `今シーズン好調` のような別表現に切り替える
- データが少ない場合
  - Around You を無理に出さず、通常一覧へ寄せる
- 初回ユーザー
  - `まずは1回挑戦して順位に参加しよう`

## プロフィール UI 仕様

### 目的

- 自分の成長を眺める楽しさを作る
- 次に何を目指すか分かるようにする

### 画面構成

#### Block A: Profile Hero

表示内容:

- アバター
- ユーザー名
- 現在 tier
- 次 tier までの残り

表示例:

- `KPOPファン太郎`
- `現在: 軽いオタク`
- `次の tier まで 240pt`

役割:

- 現在地を最初に認知させる

#### Block B: Growth Stats

表示内容:

- 現在 score
- fan since
- 今週の伸び

役割:

- 蓄積の量と最近の勢いを見せる

#### Block C: Badge Progress

表示内容:

- 既存バッジ
- 次に取れそうなバッジ

表示例:

- `あと1回で Quiz Master が強化`

役割:

- 収集したくなる理由を作る

#### Block D: Group Mastery

表示内容:

- 推しグループ一覧
- グループ別 score / tier / 得意表示

表示例:

- `BLACKPINK`
- `グループ力 820`
- `得意ジャンル`

役割:

- K-POP ファンとしての自己表現に寄せる

#### Block E: Recent Growth

表示内容:

- 最近の伸び
- 次の目標

表示例:

- `今週 +12.5%`
- `あと2回の挑戦で次 tier 圏内`

役割:

- 成長の継続理由を作る

## プロフィール ViewModel

```ts
type ProfileGrowthViewModel = {
  userName: string
  nickname: string | null
  currentTierName: string
  currentScore: number
  nextTierName: string | null
  pointsToNextTier: number | null
  fanSinceLabel: string
  weeklyGrowthLabel: string | null
  badges: Array<{
    name: string
    level: string
  }>
  nextBadgeHint: string | null
  topGroups: Array<{
    groupName: string
    scoreLabel: string | null
    tierName: string | null
  }>
}
```

## プロフィールのエッジケース

- バッジが 0 件
  - `最初のバッジを狙おう`
- グループスコアが少ない
  - `まずは好きなグループで1回挑戦`
- 次 tier がない
  - `最高 tier をキープ中`

## MVP で先にやること

### ランキング

- [ ] Top 3 の見せ場を作る
- [ ] Around You を追加する
- [ ] `次に抜ける相手との差` を表示する

### プロフィール

- [ ] 現在 tier / 次 tier までを明示する
- [ ] 今週の伸びを追加する
- [ ] 次に狙うバッジのヒントを出す

## 後回しにすること

- シーズン制
- 友達比較
- 詳細な実績ログ
- バッジ獲得履歴タイムライン

## 実装候補コンポーネント

- `RankingTopThree`
- `AroundYouCard`
- `PointsToNextRankChip`
- `ProfileHeroCard`
- `NextTierCard`
- `NextBadgeHintCard`
- `GroupMasteryGrid`

## 受け入れ条件

- ランキングで「遠い憧れ」と「近い目標」の両方が見える
- プロフィールで「今の自分」と「次の到達点」が分かる
- 情報を見るだけでなく、次のプレイ意欲につながる

## この後の接続先

- 全体 UI/UX 計画: [ui-design-brushup-plan.md](/Users/eiji/program/k-drop/app/v2/docs/ui-design-brushup-plan.md)
- ゲーミフィケーション全体計画: [gamification-plan.md](/Users/eiji/program/k-drop/app/v2/docs/gamification-plan.md)
- ホーム / 結果 MVP 仕様: [motivation-ui-mvp-spec.md](/Users/eiji/program/k-drop/app/v2/docs/motivation-ui-mvp-spec.md)
