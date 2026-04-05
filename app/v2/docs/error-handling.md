# エラーハンドリングガイド

## 目的

1. **ユーザー体験** — 予期した失敗は 4xx レスポンスで返し、クライアントがリトライや UI 制御を判断できるようにする
2. **デバッグ効率** — エラーがどう生じたかを `details` で残し、調査コストを下げる

## タクソノミーと責務

| 種別 | 想定レイヤ | 役割 |
|---|---|---|
| `DomainError<Reason>` | UseCase / Service | 業務ルールや状態遷移に基づく予期した失敗。Result で返す |
| `InfraError<Reason>` | Repository / Gateway | DB や外部 API が返す決定的な失敗をビジネス文脈へ写像 |
| `UnexpectedError` | すべて | 説明不能・復旧に人手が必要な障害。throw して `app.onError` で捕捉 |

### 共通ルール

- 予期した失敗は **必ず Result で返す**。`throw` してよいのは `UnexpectedError` のみ
- `details` は `{ origin: ErrorOrigin, meta?: Record<string, unknown> }` の形を推奨
- `reason` 文字列は関数やファイルの極近に `const QuizNotFound = "quiz.not_found" as const;` のように定義し、戻り値の Result 型から union を暗黙推論させる

## レイヤ別の実装パターン

### 1. ドメイン層 (Entity / UseCase / Service)

シグネチャは `Result<Payload, DomainError<Reason>>` または `Promise<Result<...>>`。

```ts
import { Result, success, err } from '../core/result'
import { DomainError } from '../core/errors'

export const publishQuiz = (quiz: Quiz) => {
  if (quiz.status === 'archived') {
    return err(
      new DomainError('quiz.already_archived', {
        meta: { quizId: quiz.quizId, status: quiz.status },
      }),
    )
  }

  const correctChoices = quiz.choices.filter((c) => c.isCorrect)
  if (correctChoices.length !== 1) {
    return err(
      new DomainError('quiz.invalid_correct_choice_count', {
        meta: { quizId: quiz.quizId, count: correctChoices.length },
      }),
    )
  }

  return success(reconstructQuiz({ ...quiz, status: 'published', publishedAt: new Date().toISOString() }))
}
```

### 2. インフラ層 (Repository / Gateway)

ビジネス的に説明できる D1 失敗は `InfraError` にマッピングして Result を返す。ノイズな障害は即座に `UnexpectedError` で throw する。

```ts
import { Result, success, err } from '../core/result'
import { InfraError, UnexpectedError } from '../core/errors'

export async function saveQuiz(db: D1Database, data: QuizRecord) {
  try {
    const result = await db.prepare('INSERT INTO quizzes ...').bind(...).run()
    return success(result)
  } catch (e) {
    if (isUniqueViolation(e)) {
      return err(
        new InfraError('infra.unique_violation', {
          meta: { quizId: data.quizId },
        }),
      )
    }

    throw new UnexpectedError('db.unknown', 'infra', {
      cause: e,
      details: { meta: { repository: 'quiz.save' } },
    })
  }
}
```

### 3. HTTP ハンドラー

ハンドラーは Result を受け取り、`switch (error.reason)` でレスポンスを返す。`default` ケースで `satisfies never` を使って網羅性チェック。

```ts
const ErrorCode = {
  400: {
    InvalidCorrectChoiceCount: 'quiz.invalid_correct_choice_count',
  },
  404: {
    QuizNotFound: 'quiz.not_found',
  },
  409: {
    AlreadyArchived: 'quiz.already_archived',
  },
} as const

export const quizPublishHandler = async (c) => {
  const result = await publishQuizService(...)

  if (!result.ok) {
    const error = result.error

    switch (error.reason) {
      case 'quiz.not_found':
        return c.json(
          { code: ErrorCode[404].QuizNotFound, title: 'クイズが見つかりません' },
          404,
        )
      case 'quiz.already_archived':
        return c.json(
          { code: ErrorCode[409].AlreadyArchived, title: 'アーカイブ済みのクイズは公開できません' },
          409,
        )
      case 'quiz.invalid_correct_choice_count':
        return c.json(
          { code: ErrorCode[400].InvalidCorrectChoiceCount, title: '正解選択肢はちょうど1つ必要です' },
          400,
        )
      default:
        return error.reason satisfies never
    }
  }

  return c.json({ quiz: result.value }, 200)
}
```

### 4. グローバル境界 (`app.onError`)

- `UnexpectedError` は 500 レスポンスを返し、ログに詳細を記録
- 予期した DomainError/InfraError が境界まで来た場合は開発ミスなのでログ出力

## チェックリスト

### ドメイン層

- **Result で返しているか** — `Result<...>` または `Promise<Result<...>>` になっているか
- **理由コードを局所化しているか** — 戻り値の Result から literal union が推論される構成になっているか
- **details を埋めたか** — 運用者が問題解決に使える情報が付加されているか

### インフラ層

- **インフラ例外を分類したか** — D1 エラーを `InfraError` に変換し、`UnexpectedError` との境界を守っているか

### ハンドラー層

- **switch で網羅性チェックしているか** — `default: return error.reason satisfies never;` で全ケースをカバーしているか

### 関連ドキュメント

- レイヤー別配置: `docs/component-placement-guide.md`
- コアモジュール: `docs/core-module-organization.md`
