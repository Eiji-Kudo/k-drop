# useSyncUnansweredQuizIds テスト失敗分析

## 概要

`useSyncUnansweredQuizIds`フックをリファクタリングした結果、関連するテストが失敗しています。

## リファクタリング内容

- **変更前**: `useQuery`を使用して`idolGroupId`を監視し、自動的にデータをフェッチ
- **変更後**: `useMutation`を使用して、ボタン押下時に明示的にデータをフェッチ

## テスト失敗の原因

### 1. インターフェースの変更

```typescript
// 変更前
useSyncUnansweredQuizIds(idolGroupId: number | null)
// 引数を渡すと自動的にフェッチが開始される

// 変更後
useSyncUnansweredQuizIds()
// mutationオブジェクトを返し、mutate()を呼ぶ必要がある
```

### 2. 実行タイミングの変更

- **変更前**: `useEffect`内で`idolGroupId`の変更を監視し、自動実行
- **変更後**: `mutation.mutate(idolGroupId)`または`mutation.mutateAsync(idolGroupId)`を明示的に呼ぶ必要がある

### 3. 失敗しているテストケース

#### useSyncUnansweredQuizIds.init.test.tsx

```typescript
renderHook(() => useSyncUnansweredQuizIds(1), { wrapper })
await queryClient.refetchQueries()
expect(fromSpy).toHaveBeenCalledWith('user_quiz_answers')
```

**問題**: フックをレンダリングしただけでSupabaseが呼ばれることを期待しているが、新実装ではmutateを呼ばない限り実行されない

#### useSyncUnansweredQuizIds.sync.test.tsx

同様の問題：自動実行を前提としたテスト

#### GroupSelectionScreen.test.tsx

```typescript
fireEvent.press(getByText('TWICE'))
await waitFor(() => {
  expect(supabase.from).toHaveBeenCalledWith('quizzes')
})
```

**問題**: グループを選択しただけでクエリが実行されることを期待しているが、新実装では「問題へ進む」ボタンを押すまで実行されない

### 4. Act警告

```
Warning: An update to GlobalProvider inside a test was not wrapped in act(...)
```

**原因**: `onSuccess`コールバック内での状態更新が`act`でラップされていない

## 修正方針

### 1. テストの修正

- フックから返されるmutationオブジェクトを取得
- `mutate`または`mutateAsync`を明示的に呼び出す
- 結果を`waitFor`で待機

### 2. テスト例

```typescript
const { result } = renderHook(() => useSyncUnansweredQuizIds(), { wrapper })

// mutationを実行
await act(async () => {
  await result.current.mutateAsync(1)
})

// 結果を確認
expect(supabase.from).toHaveBeenCalledWith('user_quiz_answers')
```

### 3. GroupSelectionScreenのテスト修正

- 「問題へ進む」ボタンのクリックをシミュレート
- mutationの実行を待機
- 結果を検証
