# Plan 2: Expo / React Native バージョンアップ計画

## 現在のバージョン

| パッケージ   | 現在     | 最新安定版 |
| ------------ | -------- | ---------- |
| expo         | ~52.0.41 | ~54.0.31   |
| react-native | 0.76.7   | 0.81.x     |
| react        | 18.3.1   | 19.1.x     |

## アップグレードパス

Expoは**段階的なアップグレード**を推奨している。一度に複数バージョンをスキップすると問題が発生しやすい。

```
SDK 52 (現在) → SDK 53 → SDK 54 (目標)
```

## SDK 53 への更新

### 主な変更点

1. **React Native 0.79.0 + React 19.0.0**

   - React 19への移行（Concurrent Featuresの安定化）

2. **New Architecture がデフォルト有効**

   - 現在オプトインだったNew Architectureがデフォルトに
   - 対応していないライブラリがある場合はオプトアウト可能

3. **非推奨パッケージ**

   - `expo-av` → `expo-video` / `expo-audio` に置き換え
   - `expo-background-fetch` → `expo-background-task` に置き換え
   - `jsEngine` 設定が非推奨（JavaScriptCoreサポート終了予定）

4. **必要なアクション**
   - `react-native-reanimated` を `~3.16.7` 以上に更新
   - Continuous Native Generation使用時は `android/` `ios/` を削除して再生成

### K-Dropへの影響

現在使用中のライブラリで確認が必要:

- `react-native-reanimated@~3.16.1` → `~3.16.7` への更新必須
- `moti@^0.30.0` - New Architecture対応確認
- `react-native-chart-kit@^6.12.0` - New Architecture対応確認

## SDK 54 への更新

### 主な変更点

1. **React Native 0.81 + React 19.1**

   - React 19.1の安定版

2. **Edge-to-Edge がデフォルト**

   - Android/iOSでフルスクリーン表示がデフォルト
   - SafeAreaの扱いに注意

3. **expo-file-system/next が安定版に**

   - インポートパスが `expo-file-system/next` → `expo-file-system` に変更
   - 旧APIは `expo-file-system/legacy` へ移動

4. **Native Tabs ベータ**

   - iOS/Android でネイティブタブ実装（Liquid Glass対応）

5. **厳格なスキーマ検証**

   - app.configの検証が厳格化
   - 依存関係チェックが強化

6. **Xcode 16.1以上が必須**
   - Xcode 26推奨

### 非推奨

- `enableProguardInReleaseBuilds` → `enableMinifyInReleaseBuilds`
- React Nativeの `<SafeAreaView>` → `react-native-safe-area-context` を使用

### K-Dropへの影響

- `react-native-safe-area-context` は既に使用中 ✅
- Edge-to-Edge対応のレイアウト調整が必要な可能性

## アップグレード手順

### Phase 1: SDK 53 へのアップグレード

```bash
# 1. 依存関係の更新
npx expo install expo@^53.0.0

# 2. 全依存関係を SDK 53 対応版に更新
npx expo install --fix

# 3. 互換性チェック
npx expo-doctor@latest

# 4. Continuous Native Generation使用の場合
rm -rf android ios

# 5. テスト実行
npm run check:all
```

### Phase 2: SDK 54 へのアップグレード

```bash
# 1. 依存関係の更新
npx expo install expo@^54.0.0

# 2. 全依存関係を SDK 54 対応版に更新
npx expo install --fix

# 3. 互換性チェック
npx expo-doctor@latest

# 4. Edge-to-Edge対応確認
# 必要に応じてレイアウト調整

# 5. テスト実行
npm run check:all
```

## 事前確認事項

### ライブラリ互換性チェック

現在使用中の主要ライブラリのNew Architecture / SDK 54対応状況:

| ライブラリ                   | SDK 53      | SDK 54 | 備考           |
| ---------------------------- | ----------- | ------ | -------------- |
| react-native-reanimated      | ✅ ~3.16.7+ | ✅     | 更新必須       |
| react-native-gesture-handler | ✅          | ✅     |                |
| moti                         | 要確認      | 要確認 | Reanimated依存 |
| react-native-chart-kit       | 要確認      | 要確認 | SVG依存        |
| react-native-svg             | ✅          | ✅     |                |
| @tanstack/react-query        | ✅          | ✅     | JS only        |
| @supabase/supabase-js        | ✅          | ✅     | JS only        |

### 実行コマンド

```bash
# React Native Directory で互換性確認
npx expo-doctor@latest
```

## リスクと対策

### リスク1: New Architectureとの互換性問題

**対策**: `npx expo-doctor` で事前に互換性を確認。問題がある場合は一時的にオプトアウト。

### リスク2: React 19の破壊的変更

**対策**: 段階的に更新し、各段階でテストを実行。

### リスク3: Edge-to-Edgeによるレイアウト崩れ

**対策**: SafeAreaの使用箇所を事前に確認し、必要に応じて調整。

## 推奨スケジュール

1. **準備**: ライブラリ互換性調査、`expo-doctor`実行
2. **SDK 53 更新**: 更新 → テスト → 修正
3. **安定化**: SDK 53で一定期間運用
4. **SDK 54 更新**: 更新 → テスト → 修正

---

# Issue Template

## Issue 1: SDK 53 アップグレード準備

**タイトル**: chore: SDK 53 アップグレード準備・互換性調査

**説明**:
Expo SDK 53へのアップグレードに向けて、依存ライブラリの互換性を調査し、問題点を洗い出す。

**タスク**:

- [ ] `npx expo-doctor@latest` 実行、結果を記録
- [ ] react-native-reanimated の更新確認
- [ ] moti の New Architecture 対応確認
- [ ] react-native-chart-kit の対応確認
- [ ] その他サードパーティライブラリの対応確認
- [ ] 問題のあるライブラリのissue/PR確認

**受け入れ条件**:

- 全ライブラリのSDK 53対応状況が明確になる
- 非対応ライブラリの代替案または対応予定が確認できる

---

## Issue 2: SDK 53 アップグレード実施

**タイトル**: chore: Expo SDK 53 へのアップグレード

**説明**:
Expo SDK 52 から SDK 53 へアップグレードする。

**タスク**:

- [ ] `expo@^53.0.0` への更新
- [ ] `npx expo install --fix` で依存関係更新
- [ ] `react-native-reanimated@~3.16.7` への更新
- [ ] android/ ios/ ディレクトリ削除・再生成（CNG使用時）
- [ ] `npm run check:all` でテスト・型チェック・lint実行
- [ ] 動作確認（全画面遷移、クイズ機能、プロフィール）

**受け入れ条件**:

- 全テストがパス
- 型エラーなし
- lint エラーなし
- 主要機能の動作確認完了

---

## Issue 3: SDK 54 アップグレード準備

**タイトル**: chore: SDK 54 アップグレード準備

**説明**:
SDK 53で安定運用後、SDK 54へのアップグレード準備を行う。

**タスク**:

- [ ] SDK 54のbreaking changes確認
- [ ] Edge-to-Edge対応が必要な画面の洗い出し
- [ ] expo-file-system使用箇所の確認（使用していれば）
- [ ] SafeAreaView使用箇所の確認（react-native標準のもの）
- [ ] `npx expo-doctor@latest` 再実行

**受け入れ条件**:

- SDK 54移行に必要な変更箇所が明確になる

---

## Issue 4: SDK 54 アップグレード実施

**タイトル**: chore: Expo SDK 54 へのアップグレード

**説明**:
Expo SDK 53 から SDK 54 へアップグレードする。

**タスク**:

- [ ] `expo@^54.0.0` への更新
- [ ] `npx expo install --fix` で依存関係更新
- [ ] Edge-to-Edge対応のレイアウト調整
- [ ] android/ ios/ ディレクトリ削除・再生成（CNG使用時）
- [ ] `npm run check:all` でテスト・型チェック・lint実行
- [ ] 全画面の動作確認

**受け入れ条件**:

- 全テストがパス
- 型エラーなし
- lint エラーなし
- Edge-to-Edgeで画面表示が正常
- 主要機能の動作確認完了

---

## 参考リンク

- [Expo SDK 53 Changelog](https://expo.dev/changelog/sdk-53)
- [Expo SDK 54 Changelog](https://expo.dev/changelog/sdk-54)
- [Upgrade Expo SDK Guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
- [React Native 0.77 with Expo SDK 52](https://expo.dev/changelog/2025-01-21-react-native-0.77)
