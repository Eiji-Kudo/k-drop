# Otaku Power実装計画

## 概要
問題を解くごとにotaku powerを保存する機能を実装します。スコア変動アルゴリズムは後で複雑化できるよう、拡張可能な設計にします。

## アーキテクチャ設計

### 1. レイヤー構成

```
Components → Custom Hooks → Repository → Utils (Score Algorithm)
                         ↓
                    Supabase DB
```

### 2. 主要コンポーネント

#### A. スコア計算アルゴリズム（Utils層）
`/utils/scoring/`
- `scoreCalculator.ts`: スコア計算のインターフェースと基本実装
- `difficultyMultiplier.ts`: 難易度別の倍率設定
- `streakBonus.ts`: 連続正解ボーナス（将来実装用）

#### B. レポジトリ層
`/repositories/`
- `userScoreRepository.ts`: スコア更新のデータアクセス層
- `otakuLayerRepository.ts`: レイヤー判定のデータアクセス層

#### C. カスタムフック
`/features/answer-quiz/hooks/`
- `useUpdateOtakuPower.ts`: スコア更新のメインロジック

## 実装詳細

### 1. スコア計算アルゴリズム

```typescript
// /utils/scoring/types.ts
export interface ScoreCalculationParams {
  isCorrect: boolean;
  difficultyId: number;
  groupId: number;
  userId: number;
  // 将来の拡張用
  streak?: number;
  timeSpent?: number;
}

export interface ScoreCalculator {
  calculate(params: ScoreCalculationParams): number;
}

// /utils/scoring/basicScoreCalculator.ts
export class BasicScoreCalculator implements ScoreCalculator {
  private difficultyMultipliers = {
    1: 10,  // Easy
    2: 20,  // Normal
    3: 30,  // Hard
  };

  calculate(params: ScoreCalculationParams): number {
    if (!params.isCorrect) return 0;
    
    const baseScore = 100;
    const multiplier = this.difficultyMultipliers[params.difficultyId] || 10;
    
    return baseScore + multiplier;
  }
}
```

### 2. レポジトリ層

```typescript
// /repositories/userScoreRepository.ts
export class UserScoreRepository {
  async updateTotalScore(userId: number, scoreToAdd: number) {
    // トランザクション処理
    // 1. 現在のスコアを取得
    // 2. 新しいスコアを計算
    // 3. レイヤーを判定
    // 4. user_profilesを更新
  }

  async updateGroupScore(userId: number, groupId: number, scoreToAdd: number) {
    // グループ別スコアの更新
  }
}
```

### 3. フック層

```typescript
// /features/answer-quiz/hooks/useUpdateOtakuPower.ts
export const useUpdateOtakuPower = () => {
  const scoreRepo = new UserScoreRepository();
  const calculator = new BasicScoreCalculator(); // 将来的にはDIで注入

  const updateOtakuPower = async (params: {
    userId: number;
    quizId: number;
    groupId: number;
    difficultyId: number;
    isCorrect: boolean;
  }) => {
    // 1. スコア計算
    const scoreToAdd = calculator.calculate({
      isCorrect: params.isCorrect,
      difficultyId: params.difficultyId,
      groupId: params.groupId,
      userId: params.userId,
    });

    // 2. DB更新
    await Promise.all([
      scoreRepo.updateTotalScore(params.userId, scoreToAdd),
      scoreRepo.updateGroupScore(params.userId, params.groupId, scoreToAdd),
    ]);

    return scoreToAdd;
  };

  return { updateOtakuPower };
};
```

### 4. 既存コードへの統合

`/features/answer-quiz/hooks/useQuizOnSelect.ts`の修正:
```typescript
const { updateOtakuPower } = useUpdateOtakuPower();

const onSelect = async (choice: QuizChoice, choiceIndex: number) => {
  // 既存の回答記録処理...
  
  // Otaku Power更新
  if (appUser?.app_user_id) {
    await updateOtakuPower({
      userId: appUser.app_user_id,
      quizId: quizData.quiz_id,
      groupId: quizData.idol_group_id,
      difficultyId: quizData.quiz_difficulty_id,
      isCorrect: choice.is_correct,
    });
  }
};
```

## 実装順序

1. **Phase 1: 基本実装**
   - スコア計算utilsの作成
   - レポジトリ層の実装
   - useUpdateOtakuPowerフックの作成
   - useQuizOnSelectへの統合

2. **Phase 2: レイヤー判定**
   - レイヤー判定ロジックの実装
   - プロファイル画面でのレベル表示

3. **Phase 3: 拡張機能（将来）**
   - 連続正解ボーナス
   - 時間ボーナス
   - イベント倍率
   - グループ特性による補正

## テスト方針

1. **単体テスト**
   - スコア計算アルゴリズムのテスト
   - レイヤー判定ロジックのテスト

2. **統合テスト**
   - クイズ回答→スコア更新の一連の流れ
   - トランザクション処理の確認

## 拡張性の確保

- ScoreCalculatorインターフェースで計算ロジックを抽象化
- Strategy パターンで異なる計算方式を切り替え可能
- パラメータオブジェクトで将来の拡張に対応
- レポジトリパターンでデータアクセスを分離