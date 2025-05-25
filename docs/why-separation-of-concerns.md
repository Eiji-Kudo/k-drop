# なぜ責務分離 + Custom Hookがベストプラクティスなのか

## 1. Reactのパラダイムとの整合性

### クラスベースの問題点
```typescript
// ❌ クラスベースのアプローチ
class QuizManager {
  private state = { selectedIds: [], answeredIds: [] }
  
  fetchData() { /* ... */ }
  updateState() { /* ... */ }
  calculateNext() { /* ... */ }
}

// Reactコンポーネント内で
const manager = useMemo(() => new QuizManager(), [])
// 👆 Reactの再レンダリングと同期しない独自の状態管理
```

### Hooksベースの利点
```typescript
// ✅ Hooks + 責務分離
const useQuiz = () => {
  const [state, setState] = useState()  // Reactの状態管理に統合
  const { data } = useQuery()           // Reactのライフサイクルに統合
  
  return useMemo(() => ({              // 自動的な最適化
    next: calculateNext(data, state)
  }), [data, state])
}
```

**理由:** ReactはHooksを中心に設計されており、クラスの独自状態はReactの再レンダリング最適化やConcurrent Featuresと相性が悪い。

## 2. テスタビリティの向上

### クラスベースのテストの難しさ
```typescript
// ❌ QuizManagerのテスト
describe('QuizManager', () => {
  it('should fetch and calculate', async () => {
    // Supabaseのモックが必要
    const mockSupabase = createMockSupabase()
    
    // 内部状態のテストが困難
    const manager = new QuizManager(mockSupabase)
    await manager.fetchData()
    
    // privateメソッドはテストできない
    expect(manager.getNextQuizId()).toBe(1)
  })
})
```

### 純粋関数のテストの簡単さ
```typescript
// ✅ 分離されたロジックのテスト
describe('quizLogic', () => {
  it('should calculate next quiz', () => {
    // 依存なし、モック不要
    const result = calculateNextQuiz(
      [1, 2, 3],  // all quiz ids
      [1]         // answered ids
    )
    expect(result).toBe(2)
  })
})

// データ取得も独立してテスト
describe('quizRepository', () => {
  it('should fetch quizzes', async () => {
    const mockClient = { from: jest.fn() }
    const result = await fetchQuizzes(mockClient, 1)
    expect(mockClient.from).toHaveBeenCalledWith('quizzes')
  })
})
```

**理由:** 純粋関数は入力と出力だけでテストでき、副作用やモックを最小限に抑えられる。

## 3. 再利用性と組み合わせの柔軟性

### クラスベースの制限
```typescript
// ❌ 特定の用途に固定される
class QuizManager {
  // グループ単位でしか使えない
  fetchQuizzesByGroup(groupId: number) { /* ... */ }
  
  // 別の条件でクイズを取得したい場合は？
  // → クラスを拡張するか、新しいメソッドを追加
}
```

### 関数の組み合わせによる柔軟性
```typescript
// ✅ 柔軟な組み合わせ
// 基本的なデータ取得
const fetchQuizzes = (filters: QuizFilters) => { /* ... */ }

// 様々な使い方が可能
const useGroupQuizzes = (groupId: number) => {
  return useQuery({
    queryFn: () => fetchQuizzes({ groupId })
  })
}

const useUserFavoriteQuizzes = (userId: number) => {
  return useQuery({
    queryFn: () => fetchQuizzes({ userId, onlyFavorites: true })
  })
}

const useDailyQuizzes = () => {
  return useQuery({
    queryFn: () => fetchQuizzes({ date: today() })
  })
}
```

**理由:** 小さな関数は組み合わせやすく、新しい要件に対して既存のコードを変更せずに対応できる。

## 4. パフォーマンスの最適化

### クラスベースの最適化の難しさ
```typescript
// ❌ 全体が再計算される
class QuizManager {
  getStats() {
    // すべての計算が毎回実行される
    const total = this.calculateTotal()
    const answered = this.calculateAnswered()
    const progress = this.calculateProgress()
    return { total, answered, progress }
  }
}
```

### Hooksによる細かい最適化
```typescript
// ✅ 必要な部分だけ再計算
const useQuizStats = () => {
  const { quizzes } = useQuizzes()
  const { answeredIds } = useAnswers()
  
  // 各値が独立してメモ化される
  const total = useMemo(() => quizzes.length, [quizzes])
  
  const answered = useMemo(() => answeredIds.length, [answeredIds])
  
  const progress = useMemo(() => 
    calculateProgress(total, answered),
    [total, answered]
  )
  
  return { total, answered, progress }
}
```

**理由:** React Hooksは依存関係を明示的に管理し、必要な部分だけを再計算できる。

## 5. エラー処理とローディング状態の統一

### クラスベースの状態管理の複雑さ
```typescript
// ❌ 独自のエラー・ローディング管理
class QuizManager {
  loading = false
  error = null
  
  async fetchData() {
    this.loading = true
    try {
      // データ取得
    } catch (e) {
      this.error = e
    } finally {
      this.loading = false
    }
  }
}
```

### Reactエコシステムとの統合
```typescript
// ✅ 標準的なパターンの利用
const useQuiz = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: fetchQuizzes,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  })
  
  // React Error Boundaryと統合
  if (error) throw error
  
  return { data, isLoading }
}
```

**理由:** Reactエコシステムの標準的なツール（React Query、SWR）を活用でき、エラー処理やキャッシュ戦略が統一される。

## 6. チーム開発での利点

### クラスベースの学習コスト
```typescript
// ❌ QuizManagerの全体を理解する必要がある
// - 600行のクラス
// - 内部状態の管理方法
// - 各メソッドの相互依存
// - 独自のライフサイクル
```

### 分離されたモジュールの理解しやすさ
```typescript
// ✅ 各部分を独立して理解できる
// quizUtils.ts - 50行の純粋関数
// quizRepository.ts - 30行のAPI呼び出し
// useQuiz.ts - 40行のHook

// 新しいメンバーは必要な部分だけ理解すればよい
```

**理由:** 小さく分離されたモジュールは、認知負荷が低く、並行して開発しやすい。

## まとめ

責務分離 + Custom Hookがベストプラクティスである理由：

1. **Reactとの親和性** - Reactの設計思想に沿っている
2. **テストの容易さ** - 純粋関数は簡単にテストできる
3. **再利用性** - 小さな部品は組み合わせやすい
4. **パフォーマンス** - 細かい最適化が可能
5. **エコシステム活用** - 既存のツールを最大限活用
6. **保守性** - 理解しやすく、変更しやすい

これらの利点により、長期的に見てコードベースの品質と開発効率が向上します。