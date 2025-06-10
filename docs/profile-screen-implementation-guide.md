# プロフィール画面実装ガイド

## 概要

プロフィール画面は、ユーザーの総合オタクパワーとグループ別オタクパワーを表示する画面です。参考画像のようなデザインで、以下の要素を含みます：

- ユーザー基本情報（アバター、ユーザー名、オタクパワー、ファン歴）
- バッジ（My Badges） - オタクレイヤーから自動生成
- お気に入りグループ（My Groups）
- パワー推移グラフ（Power Progress）

## データ構造

### 必要なテーブル

1. **app_users** - ユーザー基本情報
   - `app_user_id`: ユーザーID
   - `supabase_uuid`: 認証UUID
   - `line_account_id`: LINE連携ID

2. **user_profiles** - プロフィール情報
   - `user_name`: ユーザー名
   - `total_otaku_score`: 総合オタクパワー
   - `remaining_drop`: 所持ドロップ数
   - `total_otaku_layer_id`: 総合レイヤーID

3. **user_idol_group_scores** - グループ別スコア
   - `app_user_id`: ユーザーID
   - `idol_group_id`: グループID
   - `otaku_score`: グループ別スコア
   - `group_otaku_layer_id`: グループ別レイヤーID

4. **idol_groups** - アイドルグループマスタ
   - `idol_group_id`: グループID
   - `group_name`: グループ名

## 必要な新規テーブル・カラム

### 1. user_profilesテーブルの拡張
既存のuser_profilesテーブルに以下のカラムを追加：
- `avatar_url` (text, nullable) - プロフィール画像URL
- `nickname` (text, nullable) - ニックネーム（user_nameとは別の表示名）
- `description` (text, nullable) - 自己紹介文（プロフィールの説明）
- `fan_since` (date, nullable) - ファン歴開始日
- `created_at` (timestamp with time zone) - 作成日時
- `updated_at` (timestamp with time zone) - 更新日時

### 2. お気に入りグループ管理

**user_favorite_groups**
- `user_favorite_group_id` (int, PK) - お気に入りグループID
- `app_user_id` (int, FK) - ユーザーID
- `idol_group_id` (int, FK) - グループID
- `fan_since` (date) - グループのファン歴開始日
- `created_at` (timestamp with time zone) - 作成日時

### 3. オタクパワー日次履歴

**daily_score_histories**
- `daily_score_history_id` (int, PK) - 日次履歴ID
- `app_user_id` (int, FK) - ユーザーID
- `date` (date) - 記録日
- `total_score` (int) - その日の総合スコア
- `created_at` (timestamp with time zone) - 作成日時

## 実装方針

### コンポーネント構成

```
app/(tabs)/profile.tsx
├── ProfileHeader.tsx (ユーザー基本情報)
├── ProfileStats.tsx (オタクパワー、ファン歴)
├── ProfileBadges.tsx (バッジセクション)
├── ProfileGroups.tsx (My Groupsセクション)
└── ProfileProgress.tsx (Power Progressグラフ)
```