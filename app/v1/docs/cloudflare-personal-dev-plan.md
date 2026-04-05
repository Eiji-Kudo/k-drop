# Cloudflare 個人開発 技術選定プラン

## 技術スタック

| レイヤー | 技術 | 備考 |
|---|---|---|
| フロントエンド | React + Vite + TanStack Router | SPA |
| バックエンド | Hono (Pages Functions) | `functions/` ディレクトリに配置 |
| ホスティング | Cloudflare Pages | Git連携で自動デプロイ + PRプレビュー |
| DB | Cloudflare D1 (SQLite) | 無料枠: 5GB、500万行読み/日 |
| 認証 | Better Auth | ソーシャルログイン (Google, LINE) |
| 型安全API | Hono RPC | クライアント-サーバー間の型共有 |

## プロジェクト構成

```
my-app/
├── src/                    → React + TanStack Router (SPA)
│   ├── routes/
│   ├── components/
│   └── lib/
├── functions/              → Pages Functions (Hono API)
│   └── api/
│       └── [[route]].ts    → Hono で全APIルートをハンドル
├── package.json
├── vite.config.ts
└── wrangler.toml           → D1 バインディング等の設定
```

## デプロイ構成

```
https://my-app.pages.dev
├── /              → React SPA (静的ファイル)
├── /api/*         → Hono API (Pages Functions = Workers)
```

- 同一オリジンのためCORS設定不要
- GitHub連携でpush時に自動デプロイ
- PRごとにプレビューURL自動生成 (月500ビルドまで無料)

## 認証

- Better Auth + D1 をセッションストアとして使用
- 初期はソーシャルログインのみ (Google, LINE)
- メール認証は後回し (Resend + 独自ドメインが必要になるため)

## コスト見積もり

| サービス | 無料枠 | 想定コスト |
|---|---|---|
| Cloudflare Pages | 無制限サイト、500ビルド/月 | $0 |
| Cloudflare Workers (Pages Functions) | 10万リクエスト/日 | $0 |
| Cloudflare D1 | 5GB、500万行読み/日 | $0 |
| Better Auth | セルフホスト | $0 |
| 独自ドメイン (将来) | - | 年$10程度 |

**合計: $0/月** (個人開発規模)

## 将来の拡張

- メール認証追加 → Resend + 独自ドメイン取得
- 画像アップロード → Cloudflare R2
- キャッシュ → Cloudflare KV
- リアルタイム機能 → Durable Objects
