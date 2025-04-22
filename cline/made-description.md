## 関連Issue

- 

## 関連PR

- 

## 変更点

- ProblemsContextを削除し、GlobalContextを使用するように変更
- クイズ関連のテーブル名とカラム名をリネーム:
  - `quiz_question` → `quiz`
  - `quiz_question_id` → `quiz_id`
  - `question_text` → `prompt`
- クイズ解答テーブルの外部キーを更新
- `solve-problem.tsx` を `answer-quiz.tsx` にリネームし、ロジックを更新
- データベースマイグレーションを追加:
  - テーブル名変更 (20250422000001_rename_quiz_objects.sql)
  - 外部キー更新 (20250422000002_update_user_quiz_answer_fk.sql)
  - カラム名変更 (20250422000004_rename_quiz_text_to_prompt.sql)
- seed.sqlを新しいスキーマに合わせて更新

## 動作確認事項

- クイズグループ選択画面からクイズ解答画面への遷移
- クイズ解答画面での問題表示と解答送信
- 解答結果画面への遷移
- データベースマイグレーションの適用確認
- シードデータの再投入確認
