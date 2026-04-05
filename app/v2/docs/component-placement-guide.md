# レイヤー別コンポーネント配置ガイドライン

## 概要

各ドメインモジュール内部のレイヤーへのコンポーネント配置を一貫して判断するためのガイドライン。

## レイヤー配置の判断フロー

1. **ビジネスロジックチェック** — 純粋なビジネスルール・ドメインロジックか？ → YES なら `domains/`
2. **HTTP 処理チェック** — HTTP リクエスト・レスポンス処理か？ → YES なら `handlers/`
3. **データアクセスチェック** — データの読み取り専用処理か？ → YES なら `queries/`
4. **永続化処理チェック** — データの永続化・整合性管理か？ → YES なら `repositories/`
5. **バリデーションチェック** — データ検証・型定義か？ → YES なら `schemas/`
6. **上記いずれにも当てはまらない** → `services/`（ユースケース実装）

## レイヤー別配置基準

### domains/ — ドメインモデル

**配置すべき機能**:
- エンティティの状態変更ロジック
- 値オブジェクトの生成・検証
- 業務ルールの判定処理
- ドメイン不変条件の検証

**配置すべきでない機能**:
- データベースアクセス
- HTTP 通信処理
- 外部ライブラリへの依存

**実装パターン**:

```ts
// domains/quiz/quiz.entity.ts
const QuizEntity = z.object({
  quizId: z.string().brand('QuizId'),
  idolGroupId: z.string(),
  difficulty: z.enum(['easy', 'normal', 'hard']),
  status: z.enum(['draft', 'published', 'archived']),
  prompt: z.string(),
  explanation: z.string(),
  choices: z.array(QuizChoiceEntity),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
}).brand('Quiz')

export type Quiz = z.infer<typeof QuizEntity>

export const initializeQuiz = (input: { ... }): Quiz =>
  QuizEntity.parse({ quizId: ulid(), status: 'draft', ...input })

export const reconstructQuiz = (raw: { ... }): Quiz =>
  QuizEntity.parse(raw)

export const publishQuiz = (quiz: Quiz): Quiz =>
  QuizEntity.parse({ ...quiz, status: 'published', publishedAt: new Date().toISOString() })
```

### handlers/ — HTTP リクエストハンドラ

**配置すべき機能**:
- リクエストの受信・解析
- 認証・認可チェック
- 入力データバリデーション
- レスポンス形式の決定
- HTTP ステータスコードの設定

**配置すべきでない機能**:
- 複雑なビジネスロジック
- データベース直接アクセス

**実装パターン**:

```ts
// handlers/quiz.handler.ts
type Deps = { db: D1Database; listPublishedQuizzes: ListPublishedQuizzes }

export const quizzesListHandler = ({ db, listPublishedQuizzes }: Deps) => {
  return new Hono().get('/', async (c) => {
    const result = await listPublishedQuizzes(db, { ... })
    return c.json({ data: result })
  })
}
```

### queries/ — 読み取り専用クエリ

**配置すべき機能**:
- 検索・フィルタリング処理
- 集計データ取得
- 複雑な JOIN 操作
- 読み取り最適化されたクエリ

**配置すべきでない機能**:
- データの変更・更新処理
- トランザクション管理

**実装パターン**:

```ts
// queries/quiz.query.ts
export const listPublishedQuizzes = async (
  db: D1Database,
  args: { idolGroupId: string; limit: number },
) => { ... }

export type ListPublishedQuizzes = typeof listPublishedQuizzes
```

### repositories/ — 集約の永続化

**配置すべき機能**:
- 集約の保存・取得・削除
- データ整合性の保証
- トランザクション管理
- ドメインオブジェクトとデータの変換

**配置すべきでない機能**:
- 複雑な検索・集計処理（→ queries へ）
- 複数集約の調整（→ services へ）

**実装パターン**:

```ts
// repositories/quiz.repository.ts
export const quizRepository = (db: D1Database) => ({
  findById: async (quizId: string) => { ... },
  save: async (quiz: Quiz) => { ... },
})

export type QuizRepository = ReturnType<typeof quizRepository>
```

### services/ — アプリケーションサービス

**配置すべき機能**:
- 複数リポジトリの調整
- 外部システムとの連携
- ユースケース全体のオーケストレーション
- トランザクション境界の制御

**配置すべきでない機能**:
- HTTP 固有の処理（→ handlers へ）
- 純粋なビジネスロジック（→ domains へ）

### schemas/ — Zod スキーマ定義

**配置すべき機能**:
- リクエストボディの検証
- レスポンス型の定義
- バリデーションルールの定義

**配置すべきでない機能**:
- ビジネスルールを含む複雑な検証（→ domains へ）

## レイヤー間の依存関係ルール

### 許可される依存方向

```
handlers → services → repositories → domains
handlers → queries
services → queries
schemas → (独立)
```

### 禁止される依存

```
domains → 他の全レイヤー
repositories → handlers/services
queries → handlers/services/repositories
```

## 関数引数の規約

| 引数の数 | スタイル | 例 |
|---|---|---|
| 1 つ | positional | `findById(id: string)` |
| 2 つ以上 | named (オブジェクト) | `list({ idolGroupId, limit }: { ... })` |

## フロントエンド配置規約

- ルートファイル（`src/routes/*.tsx`）はルーティング関心に集中させ、独立した UI セクションは `src/components/` 以下に抽出する。目安として 150 行を超えたら抽出を検討
- 詳細ページ: `components/<entity>-detail/` にサブコンポーネントを配置
- レイアウト: `components/layout/` にヘッダー・フッター等の共有 UI 部品を配置
- カスタムフックは意味や目的ごとに適切な粒度で分割する。1 つのコンポーネントが複数のフックを使い分けるのが自然な設計
- `server/modules/*/schemas/` に定義された Zod スキーマと同じ型をフロント側で手書きしない。`z.infer<typeof Schema>` や `Pick`/`Omit` で導出する

### 関連ドキュメント

- モジュール構造の判断ルール: `docs/project-structure.md`
- コアモジュールへの配置方針: `docs/core-module-organization.md`
