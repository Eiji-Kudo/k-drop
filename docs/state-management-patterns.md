# State Management パターン比較

## アプローチの比較

### 1. Global Context (state + methods)

```typescript
// context/QuizContext.tsx
export const QuizContext = createContext({
  // State
  selectedQuizIds: [],
  answeredQuizIds: [],
  
  // Methods
  fetchQuizzesByGroup: async (groupId: number) => {},
  markQuizAsAnswered: (quizId: number) => {},
  getNextQuizId: () => null,
  resetProgress: () => {},
})
```

**適している場合:**
- アプリ全体で共有する状態
- リアルタイムで同期が必要な状態
- UIに直結する状態

**適さない場合:**
- 純粋なビジネスロジック
- 再利用可能な計算処理
- テスト対象のロジック

### 2. Utils/Repository パターン

```typescript
// repositories/quizRepository.ts (データアクセス)
export const quizRepository = {
  getByGroupId: async (groupId: number) => { /* Supabase呼び出し */ },
  getUserAnswers: async (userId: number) => { /* Supabase呼び出し */ },
}

// utils/quizUtils.ts (ビジネスロジック)
export const calculateNextQuiz = (all: number[], answered: number[]) => {
  return all.find(id => !answered.includes(id)) ?? null
}
```

**適している場合:**
- 状態を持たない処理
- 複数の場所で使う計算ロジック
- 単体テストしたい機能

**適さない場合:**
- UI状態の管理
- コンポーネント間の状態共有

## 推奨される組み合わせパターン

### ベストプラクティス: 責務の分離

```
┌─────────────────────────────────┐
│     Components                  │
│  ↓ uses                        │
├─────────────────────────────────┤
│     Custom Hooks                │ ← 状態管理とロジックの結合
│  ↓ uses        ↓ uses          │
├─────────────────┴───────────────┤
│  Global Context │ Utils/Logic   │ ← 責務の分離
│  (UI State)     │ (Pure Funcs)  │
│  ↓ uses        │               │
├─────────────────┴───────────────┤
│     Repository/API              │ ← データアクセス
└─────────────────────────────────┘
```

### 実装例

```typescript
// 1. Repository層 - データアクセス
// repositories/quizRepository.ts
export const quizRepository = {
  async fetchQuizzes(groupId: number) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('idol_group_id', groupId)
    
    if (error) throw error
    return data
  },
  
  async saveAnswer(userId: number, quizId: number, choiceId: number) {
    // 回答の保存処理
  }
}

// 2. Utils層 - ビジネスロジック（純粋関数）
// utils/quizLogic.ts
export const quizLogic = {
  filterUnanswered: (all: Quiz[], answered: number[]): Quiz[] => {
    return all.filter(q => !answered.includes(q.quiz_id))
  },
  
  selectNextQuiz: (unanswered: Quiz[]): Quiz | null => {
    return unanswered[0] ?? null
  },
  
  calculateProgress: (total: number, answered: number): number => {
    return Math.round((answered / total) * 100)
  }
}

// 3. Context層 - UI状態管理
// context/QuizContext.tsx
export const QuizProvider = ({ children }) => {
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null)
  const [answeredIds, setAnsweredIds] = useState<number[]>([])
  
  // UI状態に関するメソッドのみ
  const value = {
    currentQuizId,
    answeredIds,
    setCurrentQuizId,
    addAnsweredId: (id: number) => {
      setAnsweredIds(prev => [...prev, id])
    }
  }
  
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

// 4. Custom Hook - すべてを結合
// hooks/useQuiz.ts
export const useQuiz = (groupId: number) => {
  const { currentQuizId, answeredIds, addAnsweredId } = useContext(QuizContext)
  
  // React Queryでデータ取得
  const { data: quizzes } = useQuery({
    queryKey: ['quizzes', groupId],
    queryFn: () => quizRepository.fetchQuizzes(groupId)
  })
  
  // ビジネスロジックの適用
  const unansweredQuizzes = useMemo(
    () => quizLogic.filterUnanswered(quizzes ?? [], answeredIds),
    [quizzes, answeredIds]
  )
  
  const nextQuiz = useMemo(
    () => quizLogic.selectNextQuiz(unansweredQuizzes),
    [unansweredQuizzes]
  )
  
  const progress = useMemo(
    () => quizLogic.calculateProgress(quizzes?.length ?? 0, answeredIds.length),
    [quizzes, answeredIds]
  )
  
  // 回答送信
  const submitAnswer = useMutation({
    mutationFn: (choiceId: number) => {
      return quizRepository.saveAnswer(userId, currentQuizId!, choiceId)
    },
    onSuccess: () => {
      addAnsweredId(currentQuizId!)
    }
  })
  
  return {
    currentQuiz: quizzes?.find(q => q.quiz_id === currentQuizId),
    nextQuiz,
    progress,
    submitAnswer
  }
}
```

## 判断基準

### Global Contextに入れるべきもの
- **UI状態**: モーダルの開閉、選択中のアイテム
- **セッション情報**: ログインユーザー、テーマ設定
- **一時的な状態**: フォームの入力値、ウィザードの進行状況

### Utils/Repositoryに分離すべきもの
- **計算ロジック**: スコア計算、フィルタリング、ソート
- **データ変換**: APIレスポンスの整形、フォーマット変換
- **バリデーション**: 入力値チェック、ビジネスルール検証
- **API通信**: HTTP通信、エラーハンドリング

## まとめ

**QuizManagerの場合の推奨構成:**

1. **Repository**: Supabaseとの通信
2. **Utils**: クイズ選択ロジック、進捗計算
3. **Context**: 現在のクイズID、回答済みIDリスト（UI状態）
4. **Custom Hook**: 上記を組み合わせて使いやすくする

この構成により：
- テストが書きやすい（純粋関数）
- 責務が明確（どこに何があるか分かりやすい）
- 再利用しやすい（ロジックが独立）
- パフォーマンスが良い（必要な部分だけ再計算）