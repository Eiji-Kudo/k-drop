# Otaku Power保存に関する分析

## 概要
問題を解くごとにotaku powerを保存する機能を実装するため、既存のデータベーススキーマを調査しました。

## 関連テーブル

### 1. user_profiles テーブル
- **total_otaku_score**: 総合オタク力スコア
- **total_otaku_layer_id**: 総合オタクレイヤー（レベル）
- **remaining_drop**: 所持中のドロップ数

このテーブルは各ユーザーの総合的なオタク力を管理しています。

### 2. user_idol_group_scores テーブル
- **otaku_score**: グループ別のオタクスコア
- **group_otaku_layer_id**: グループ別オタクレイヤー
- **idol_group_id**: アイドルグループID
- **app_user_id**: ユーザーID

各アイドルグループごとのオタク力を管理するテーブルです。

### 3. user_quiz_answers テーブル
- **quiz_id**: クイズID
- **app_user_id**: ユーザーID
- **is_correct**: 正解/不正解フラグ
- **answered_at**: 回答日時

ユーザーのクイズ回答履歴を保存するテーブルです。

## 実装方針

問題を解くごとにotaku powerを更新するには、以下の流れで実装できます：

1. **user_quiz_answersテーブル**に回答を保存
2. 正解の場合、以下を更新：
   - **user_profilesテーブル**の`total_otaku_score`を増加
   - **user_idol_group_scoresテーブル**の該当グループの`otaku_score`を増加

### スコア更新のタイミング
- クイズ回答時（正解時）に即座に更新
- クイズの難易度（quiz_difficulty_id）に応じて加算ポイントを変える

### レイヤー（レベル）の更新
- スコアが一定値を超えたら、対応するレイヤーIDも更新
- total_otaku_layersテーブルとgroup_otaku_layersテーブルのmin_score/max_scoreを参照

## 必要な追加実装

1. スコア計算ロジック（難易度別のポイント設定）
2. レイヤー判定ロジック（スコアからレイヤーを決定）
3. トランザクション処理（回答保存とスコア更新を一括で行う）