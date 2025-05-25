# QuizManager リファクタリングガイド

## 現在の問題点

### 1. ステートフルなクラス設計の問題

#### 状態の二重管理
```typescript
// QuizManager内部
private selectedQuizIds: number[] = []
private answeredQuizIds: number[] = []

// GlobalContext内
const [selectedQuizIds, setSelectedQuizIds] = useState<number[]>([])
const [answeredQuizIds, setAnsweredQuizIds] = useState<number[]>([])
```

**破綻するケース:**
- 複数の画面で異なるQuizManagerインスタンスを作成した場合、状態が同期されない
- ユーザーがブラウザの戻るボタンを使った際に、状態の不整合が発生
- リアルタイムで他のユーザーの回答状況を反映したい場合に対応困難

### 2. 責務の混在

現在のQuizManagerは以下の責務を持っている：
- データ取得（Supabase通信）
- 状態管理（内部状態の保持）
- ビジネスロジック（次のクイズの選択、完了判定）

**破綻するケース:**
- テスト時にSupabaseのモックが必要
- オフライン対応を追加する際に、全体を書き換える必要がある
- 異なるデータソース（API、ローカルストレージ）への切り替えが困難

### 3. メモリリークのリスク

```typescript
// 現在の実装
const quizManager = useMemo(() => new QuizManager(), [])
```

**破綻するケース:**
- コンポーネントがアンマウントされても、QuizManagerの内部状態が残る
- 長時間使用すると、answeredQuizIdsが際限なく増える
- ユーザーが異なるグループのクイズを連続して実行すると、前のデータが残る

## 推奨アーキテクチャ

### 1. レイヤーの分離

```
┌─────────────────────────────────────────────┐
│             Presentation Layer              │
│  (Components + Custom Hooks)                │
├─────────────────────────────────────────────┤
│             Business Logic Layer            │
│  (Pure Functions / Utils)                   │
├─────────────────────────────────────────────┤
│             Data Access Layer               │
│  (API Clients / Repositories)              │
└─────────────────────────────────────────────┘
```

### 2. 具体的な実装パターン

#### A. カスタムフックパターン

```typescript
// hooks/useQuizzes.ts
export const useQuizzes = (groupId: number) => {
  const { appUserId } = useAppUser()
  
  // React Queryを使用してキャッシュ管理
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes', groupId, appUserId],
    queryFn: () => fetchQuizzesByGroup(groupId, appUserId),
  })
  
  return { quizzes, isLoading }
}

// hooks/useQuizProgress.ts
export const useQuizProgress = () => {
  const [answeredIds, setAnsweredIds] = useAtom(answeredQuizIdsAtom)
  const [selectedIds] = useAtom(selectedQuizIdsAtom)
  
  const nextQuizId = useMemo(
    () => getNextUnansweredQuiz(selectedIds, answeredIds),
    [selectedIds, answeredIds]
  )
  
  const markAsAnswered = useCallback((quizId: number) => {
    setAnsweredIds(prev => [...prev, quizId])
  }, [])
  
  return { nextQuizId, markAsAnswered, answeredIds }
}
```

#### B. 純粋関数による処理

```typescript
// utils/quizUtils.ts
export const getUnansweredQuizzes = (
  allQuizzes: number[],
  answeredQuizzes: number[]
): number[] => {
  return allQuizzes.filter(id => !answeredQuizzes.includes(id))
}

export const getNextUnansweredQuiz = (
  selectedQuizzes: number[],
  answeredQuizzes: number[]
): number | null => {
  const unanswered = getUnansweredQuizzes(selectedQuizzes, answeredQuizzes)
  return unanswered[0] ?? null
}

export const calculateProgress = (
  totalQuizzes: number,
  answeredQuizzes: number
): { percentage: number; isComplete: boolean } => {
  const percentage = (answeredQuizzes / totalQuizzes) * 100
  return {
    percentage: Math.round(percentage),
    isComplete: percentage === 100
  }
}
```

#### C. データアクセス層の分離

```typescript
// repositories/quizRepository.ts
export const quizRepository = {
  async getByGroupId(groupId: number): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('idol_group_id', groupId)
    
    if (error) throw new QuizFetchError(error.message)
    return data
  },
  
  async getUserAnswers(userId: number): Promise<UserAnswer[]> {
    const { data, error } = await supabase
      .from('user_quiz_answers')
      .select('*')
      .eq('app_user_id', userId)
    
    if (error) throw new AnswerFetchError(error.message)
    return data
  }
}
```

### 3. 状態管理の一元化

```typescript
// store/quizStore.ts (Zustandの例)
interface QuizStore {
  selectedQuizIds: number[]
  answeredQuizIds: number[]
  currentQuizId: number | null
  
  setSelectedQuizIds: (ids: number[]) => void
  markQuizAsAnswered: (id: number) => void
  resetProgress: () => void
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  selectedQuizIds: [],
  answeredQuizIds: [],
  currentQuizId: null,
  
  setSelectedQuizIds: (ids) => set({ selectedQuizIds: ids }),
  
  markQuizAsAnswered: (id) => set(state => ({
    answeredQuizIds: [...state.answeredQuizIds, id]
  })),
  
  resetProgress: () => set({
    answeredQuizIds: [],
    currentQuizId: null
  })
}))
```

## 移行戦略

### Phase 1: 新規フックの作成
1. `useQuizzes`フックを作成してデータ取得を分離
2. `useQuizProgress`フックを作成して進捗管理を分離
3. 純粋関数のユーティリティを作成

### Phase 2: 段階的な置き換え
1. 新規画面から新しいパターンを採用
2. 既存のQuizManagerを使用している箇所を徐々に置き換え
3. テストを追加しながら進める

### Phase 3: QuizManagerの削除
1. すべての依存を除去
2. QuizManagerクラスを削除
3. 不要になったコードをクリーンアップ

## メリット

1. **テスタビリティの向上**
   - 純粋関数は単体テストが簡単
   - モックが最小限で済む

2. **再利用性の向上**
   - 各機能が独立している
   - 異なるコンテキストで使いやすい

3. **パフォーマンスの最適化**
   - React Queryによるキャッシュ
   - 不要な再レンダリングの削減

4. **保守性の向上**
   - 責務が明確
   - 変更の影響範囲が限定的

5. **スケーラビリティ**
   - 新機能の追加が容易
   - 異なるデータソースへの対応が簡単