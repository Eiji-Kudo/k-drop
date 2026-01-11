# Plan 1: Supabase Edge Functions + Hono + OpenAPI/Orval アーキテクチャ設計

## 概要

クイズ機能のビジネスロジックをフロントエンドからバックエンド（Supabase Edge Functions）に移行し、フロントエンドはUIの提供に専念する設計。

## 調査結果

### 1. Supabase Edge Functions + Hono は実現可能

**公式サポート**: Supabase は Hono フレームワークを Edge Functions で使用することを公式にサポートしている。

```typescript
// supabase/functions/api/index.ts
import { Hono } from "https://deno.land/x/hono/mod.ts"

const app = new Hono().basePath("/api")

app.get("/quiz/:id", (c) => {
  const id = c.req.param("id")
  // クイズロジック
  return c.json({ quiz: {...} })
})

Deno.serve(app.fetch)
```

**参考リンク**:

- [Supabase Edge Functions - Hono](https://hono.dev/docs/getting-started/supabase-functions)
- [Supabase Routing Documentation](https://supabase.com/docs/guides/functions/routing)

### 2. Hono + Zod OpenAPI + Orval による型安全なクライアント生成

**完全に実現可能**。以下のフローで実装できる:

```
[Hono + @hono/zod-openapi] → [OpenAPI Spec (JSON/YAML)] → [Orval] → [型安全なAPIクライアント]
```

#### Hono側 (バックエンド)

```typescript
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi"

// スキーマ定義
const QuizSchema = z.object({
  quiz_id: z.number().openapi({ example: 1 }),
  question: z.string().openapi({ example: "BTSのデビュー年は？" }),
  idol_group_id: z.number(),
  quiz_difficulty_id: z.number(),
}).openapi("Quiz")

const AnswerRequestSchema = z.object({
  quiz_id: z.number(),
  choice_id: z.number(),
  user_id: z.number(),
}).openapi("AnswerRequest")

const AnswerResponseSchema = z.object({
  is_correct: z.boolean(),
  score_earned: z.number(),
  new_total_score: z.number(),
  new_layer_id: z.number().nullable(),
}).openapi("AnswerResponse")

// ルート定義
const answerQuizRoute = createRoute({
  method: "post",
  path: "/quiz/{quizId}/answer",
  request: {
    params: z.object({ quizId: z.string() }),
    body: {
      content: { "application/json": { schema: AnswerRequestSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: AnswerResponseSchema } },
      description: "クイズ回答結果",
    },
  },
})

const app = new OpenAPIHono()

app.openapi(answerQuizRoute, async (c) => {
  // ビジネスロジック（スコア計算、レイヤー更新等）
  return c.json({ is_correct: true, score_earned: 10, ... })
})

// OpenAPI仕様書を /doc エンドポイントで提供
app.doc("/doc", {
  openapi: "3.0.0",
  info: { version: "1.0.0", title: "K-Drop Quiz API" },
})
```

#### Orval設定 (フロントエンド)

```typescript
// orval.config.ts
export default {
  'k-drop-api': {
    input: {
      target: 'https://your-project.supabase.co/functions/v1/api/doc',
    },
    output: {
      target: './src/generated/api.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './src/utils/apiClient.ts',
          name: 'customFetch',
        },
      },
    },
  },
}
```

#### 生成されるクライアント例

```typescript
// src/generated/api.ts (自動生成)
export const useAnswerQuiz = () => {
  return useMutation({
    mutationFn: (data: AnswerRequest) =>
      apiClient.post<AnswerResponse>(`/quiz/${data.quiz_id}/answer`, data),
  })
}
```

## 推奨アーキテクチャ

```
┌─────────────────────────────────────────────────────────────────────┐
│                         React Native App                            │
├─────────────────────────────────────────────────────────────────────┤
│  UI Components (features/answer-quiz/components/)                   │
│       ↓                                                             │
│  Generated API Hooks (src/generated/api.ts)                         │
│       ↓                                                             │
│  Custom Fetch (src/utils/apiClient.ts) - Auth header injection      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   Supabase Edge Functions                           │
├─────────────────────────────────────────────────────────────────────┤
│  Hono App (supabase/functions/api/)                                 │
│       ↓                                                             │
│  Route Handlers - Request validation via Zod                        │
│       ↓                                                             │
│  Business Logic (quiz scoring, layer calculation)                   │
│       ↓                                                             │
│  Supabase Client (DB operations)                                    │
└─────────────────────────────────────────────────────────────────────┘
```

## ディレクトリ構成案

```
k-drop/
├── supabase/
│   └── functions/
│       └── api/
│           ├── index.ts              # Hono エントリーポイント
│           ├── routes/
│           │   ├── quiz.ts           # クイズ関連エンドポイント
│           │   ├── user.ts           # ユーザー関連エンドポイント
│           │   └── ranking.ts        # ランキング関連エンドポイント
│           ├── schemas/
│           │   ├── quiz.ts           # Zodスキーマ定義
│           │   └── user.ts
│           ├── services/
│           │   ├── quizService.ts    # ビジネスロジック
│           │   └── scoreService.ts   # スコア計算ロジック
│           └── utils/
│               └── supabaseClient.ts # Supabaseクライアント
├── src/
│   ├── generated/                    # Orval自動生成コード
│   │   └── api.ts
│   └── utils/
│       └── apiClient.ts              # カスタムフェッチャー
├── orval.config.ts                   # Orval設定
└── package.json
```

## 移行対象API一覧

現在フロントエンドで実装されているロジックをAPI化:

| API Endpoint               | Method | 説明                   | 現在の実装箇所                                     |
| -------------------------- | ------ | ---------------------- | -------------------------------------------------- |
| `/quiz/{groupId}/next`     | GET    | 次のクイズ取得         | `useNextQuiz.ts`                                   |
| `/quiz/{quizId}`           | GET    | クイズ詳細取得         | `useQuizQuery.ts`                                  |
| `/quiz/{quizId}/answer`    | POST   | クイズ回答・スコア更新 | `useUpdateOtakuPower.ts`, `userScoreRepository.ts` |
| `/quiz/{quizId}/choices`   | GET    | 選択肢取得             | `useQuizQuery.ts`                                  |
| `/user/{userId}/scores`    | GET    | ユーザースコア取得     | `useProfileData.ts`                                |
| `/ranking/total`           | GET    | 総合ランキング         | `rankingRepository.ts`                             |
| `/ranking/group/{groupId}` | GET    | グループランキング     | `rankingRepository.ts`                             |

## メリット

1. **型安全性**: OpenAPI + Orval + Zodにより、エンドツーエンドの型安全性を実現
2. **ロジック分離**: フロントエンドはUI、バックエンドはビジネスロジックに専念
3. **セキュリティ**: ビジネスロジックがサーバーサイドで実行され、不正操作を防止
4. **スケーラビリティ**: Edge Functionsはグローバル分散で高速
5. **開発効率**: APIドキュメントが自動生成され、クライアントコードも自動生成

## 考慮事項

1. **レイテンシ**: 毎回APIを叩くため、ネットワーク遅延を考慮（ローディング状態のUX重要）
2. **オフライン対応**: オフライン時の挙動を検討（React Queryのキャッシュ活用）
3. **認証**: Supabase Authとの統合（JWTトークンをAPIヘッダーに付与）
4. **ローカル開発**: `supabase functions serve`でローカルテスト可能

## 実装ステップ

### Phase 1: 基盤構築

1. Hono + Zod OpenAPI のセットアップ
2. 基本的なルーティング実装
3. Orval設定とクライアント生成パイプライン

### Phase 2: クイズ機能移行

1. クイズ取得API実装
2. 回答・スコア更新API実装
3. フロントエンド統合

### Phase 3: その他機能移行

1. ランキングAPI実装
2. プロフィールAPI実装

---

# Issue Template

## Issue 1: Edge Functions基盤構築

**タイトル**: feat: Supabase Edge Functions + Hono基盤構築

**説明**:
Supabase Edge FunctionsにHonoフレームワークとZod OpenAPIを導入し、型安全なAPI基盤を構築する。

**タスク**:

- [ ] `supabase/functions/api/` ディレクトリ作成
- [ ] Hono + @hono/zod-openapi セットアップ
- [ ] 基本的なヘルスチェックエンドポイント実装
- [ ] OpenAPIドキュメント生成エンドポイント (`/doc`) 実装
- [ ] ローカル開発環境テスト

**受け入れ条件**:

- `supabase functions serve`でローカル起動可能
- `/api/health`エンドポイントが200を返す
- `/api/doc`でOpenAPI JSONが取得可能

---

## Issue 2: Orvalセットアップとクライアント生成

**タイトル**: feat: Orval導入と型安全なAPIクライアント生成

**説明**:
OrvalをセットアップしてOpenAPI仕様からReact Query対応の型安全なAPIクライアントを自動生成する。

**タスク**:

- [ ] Orvalインストール (`npm install orval -D`)
- [ ] `orval.config.ts` 作成
- [ ] カスタムフェッチャー実装 (`src/utils/apiClient.ts`)
- [ ] 生成スクリプト追加 (`npm run gen-api`)
- [ ] 生成コードの動作確認

**受け入れ条件**:

- `npm run gen-api`でクライアントコード生成成功
- 生成されたhooksがTypeScript型付きで使用可能

---

## Issue 3: クイズ回答API実装

**タイトル**: feat: クイズ回答APIエンドポイント実装

**説明**:
クイズ回答時のスコア計算・更新ロジックをEdge Functionsに移行する。

**タスク**:

- [ ] `POST /api/quiz/{quizId}/answer` エンドポイント実装
- [ ] リクエスト/レスポンスのZodスキーマ定義
- [ ] スコア計算ロジック移行 (`basicScoreCalculator.ts` → サーバーサイド)
- [ ] レイヤー更新ロジック移行 (`userScoreRepository.ts` → サーバーサイド)
- [ ] フロントエンドの`useUpdateOtakuPower`を生成クライアントに置き換え

**受け入れ条件**:

- APIでクイズ回答が処理される
- スコアがDBに正しく更新される
- フロントエンドから型安全に呼び出し可能

---

## Issue 4: クイズ取得API実装

**タイトル**: feat: クイズ取得APIエンドポイント実装

**説明**:
次のクイズ取得と詳細取得のAPIを実装する。

**タスク**:

- [ ] `GET /api/quiz/{groupId}/next` エンドポイント実装
- [ ] `GET /api/quiz/{quizId}` エンドポイント実装
- [ ] `GET /api/quiz/{quizId}/choices` エンドポイント実装
- [ ] フロントエンドの関連hooksを生成クライアントに置き換え

**受け入れ条件**:

- 各エンドポイントが正しいデータを返す
- 未回答クイズのフィルタリングが機能する

---

## Issue 5: ランキング・プロフィールAPI実装

**タイトル**: feat: ランキング・プロフィールAPIエンドポイント実装

**説明**:
ランキングとプロフィール関連のAPIを実装する。

**タスク**:

- [ ] `GET /api/ranking/total` エンドポイント実装
- [ ] `GET /api/ranking/group/{groupId}` エンドポイント実装
- [ ] `GET /api/user/{userId}/profile` エンドポイント実装
- [ ] `GET /api/user/{userId}/groups` エンドポイント実装
- [ ] フロントエンドの関連repositoryを生成クライアントに置き換え

**受け入れ条件**:

- 各エンドポイントが正しいデータを返す
- フロントエンドのランキング・プロフィール画面が正常動作

---

## 参考リンク

- [Hono Zod OpenAPI](https://hono.dev/examples/zod-openapi)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Orval Documentation](https://orval.dev/)
- [Supabase + Hono Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/hono)
