# PR #49 レビュー懸念点

## 概要

- **PR**: プロフィールページ作成
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/49
- **調査日**: 2026-01-11
- **最終更新**: 2026-01-11

## サマリー

| 重要度   | 件数 | 修正済み |
| -------- | ---- | -------- |
| CRITICAL | 0    | -        |
| HIGH     | 2    | 2        |
| MEDIUM   | 7    | 7        |

**全ての懸念点が修正されました。**

## 懸念点一覧

### 1. ファン期間計算ロジックのバグ ✅ 修正済み

| 項目       | 内容                                           |
| ---------- | ---------------------------------------------- |
| 重要度     | **HIGH**                                       |
| カテゴリ   | bug                                            |
| ファイル   | `features/profile/components/ProfileStats.tsx` |
| ステータス | **修正済み**                                   |

**問題点**:
`formatFanDuration`関数の年・月の計算が不正確。年の差分が1以上でも、実際には1年経過していないケースで誤った表示になる。

**修正内容**:

- `formatFanDuration`を`features/profile/utils/dateUtils.ts`に抽出
- ミリ秒差分から正確な期間を計算するロジックに修正
- 14件のユニットテストを追加（`features/profile/utils/__tests__/dateUtils.test.ts`）

---

### 2. チャートデータのラベルとデータ配列の長さ不一致 ✅ 修正済み

| 項目       | 内容                                   |
| ---------- | -------------------------------------- |
| 重要度     | **HIGH**                               |
| カテゴリ   | bug                                    |
| ファイル   | `features/profile/utils/chartUtils.ts` |
| ステータス | **修正済み**                           |

**問題点**:
`dailyScores`が空配列の場合、`labels`は空配列になるが`data`は`[0]`になり、配列の長さが一致しない。

**修正内容**:

- 空配列の場合に`labels: ['']`と`datasets: [{ data: [0] }]`を返すように早期リターンを追加

---

### 3. console.logがプロダクションコードに残存 ✅ 修正済み

| 項目       | 内容                     |
| ---------- | ------------------------ |
| 重要度     | **MEDIUM**               |
| カテゴリ   | design                   |
| ファイル   | `app/(tabs)/profile.tsx` |
| ステータス | **修正済み**             |

**修正内容**:

- `onSettingsPress={() => console.log('Settings pressed')}`を`onSettingsPress={() => {}}`に変更

---

### 4. ProfileLoadingStatesの非標準的な使用パターン ✅ 修正済み

| 項目       | 内容                                                                             |
| ---------- | -------------------------------------------------------------------------------- |
| 重要度     | **MEDIUM**                                                                       |
| カテゴリ   | design                                                                           |
| ファイル   | `app/(tabs)/profile.tsx`, `features/profile/components/ProfileLoadingStates.tsx` |
| ステータス | **修正済み**                                                                     |

**修正内容**:

- 関数名を`ProfileLoadingStates`から`getProfileLoadingState`にリネーム
- ヘルパー関数であることを名前で明示

---

### 5. リフレッシュ時のエラーハンドリング欠如 ✅ 修正済み

| 項目       | 内容                     |
| ---------- | ------------------------ |
| 重要度     | **MEDIUM**               |
| カテゴリ   | bug                      |
| ファイル   | `app/(tabs)/profile.tsx` |
| ステータス | **修正済み**             |

**修正内容**:

- `onRefresh`をtry-finallyでラップし、エラー発生時も`setRefreshing(false)`が確実に実行されるように修正

---

### 6. BadgeIconのswitch文にdefaultケースがない ✅ 修正済み

| 項目       | 内容                                        |
| ---------- | ------------------------------------------- |
| 重要度     | **MEDIUM**                                  |
| カテゴリ   | bug                                         |
| ファイル   | `features/profile/components/BadgeIcon.tsx` |
| ステータス | **修正済み**                                |

**修正内容**:

- TypeScriptのexhaustive checkパターン（`assertNever`関数）を使用したdefaultケースを追加

---

### 7. ハードコードされた色定数 ✅ 修正済み

| 項目       | 内容                                                          |
| ---------- | ------------------------------------------------------------- |
| 重要度     | **MEDIUM**                                                    |
| カテゴリ   | design / guideline                                            |
| ファイル   | `features/profile/utils/badgeUtils.ts`, `constants/Colors.ts` |
| ステータス | **修正済み**                                                  |

**修正内容**:

- `constants/Colors.ts`に`badge`オブジェクト（`gold`, `silver`, `bronze`）を追加
- `badgeUtils.ts`の`getBadgeColor`関数でColors定数を使用するように変更

---

### 8. ScrollViewでのgapプロパティ使用 ✅ 修正済み

| 項目       | 内容                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| 重要度     | **MEDIUM**                                                                                                     |
| カテゴリ   | bug                                                                                                            |
| ファイル   | `features/profile/components/profile-badges/styles.ts`, `features/profile/components/profile-badges/index.tsx` |
| ステータス | **修正済み**                                                                                                   |

**修正内容**:

- `badgeList`スタイルを空にし、`badgeListContent`スタイルを新規作成
- ScrollViewの`contentContainerStyle`に`badgeListContent`を適用

---

### 9. マイグレーションファイルの末尾に改行がない ✅ 修正済み

| 項目       | 内容                                                          |
| ---------- | ------------------------------------------------------------- |
| 重要度     | **MEDIUM**                                                    |
| カテゴリ   | guideline                                                     |
| ファイル   | `supabase/migrations/20250610000000_add_profile_features.sql` |
| ステータス | **修正済み**                                                  |

**修正内容**:

- ファイル末尾に改行を追加

---

## 検証結果

- **TypeScript型チェック**: ✅ パス
- **ESLint**: ✅ パス（既存のconfig関連エラーを除く）
- **テスト**: ✅ 55件全てパス（新規追加14件を含む）
