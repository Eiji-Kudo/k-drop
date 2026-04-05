# PR #79 チームレビュー懸念点

## 概要

- **PR**: v2: Cloudflare Pages Functions 向け Hono API 基盤を追加
- **URL**: https://github.com/Eiji-Kudo/k-drop/pull/79
- **調査日**: 2026-04-05
- **レビュー回数**: 1回目
- **レビュー方式**: 並列レビュー + 相互検証

## レビュワー構成

| レビュワー | 専門領域 | 選定理由 |
|------------|----------|----------|
| `architecture-reviewer` | アーキテクチャ・設計 | Hono構成、TypeScript設定、モジュール設計、型共有パターンの妥当性評価 |
| `security-reviewer` | セキュリティ | APIエンドポイントのセキュリティ基盤、CORS、ヘッダー、エラーハンドリング |
| `infra-reviewer` | インフラ・設定 | Cloudflare Pages Functions設定、wrangler、ビルドパイプライン、開発体験 |

## サマリー

| 重要度 | 件数 | 対応済み |
|--------|------|----------|
| CRITICAL | 0 | 0 |
| HIGH | 3 | 3 |
| MEDIUM | 8 | 8 |

## 参照したガイドライン

- `CLAUDE.md` (root)

## 未対応の懸念点

（なし）

---

## 対応不要の懸念点

<details>
<summary>3. CORS設定の不在（HIGH / 対応不要）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/src/lib/api/app.ts` |
| 検出者 | security-reviewer |

**対応不要の理由**: 同一オリジン配信のPWAで本番ではCORS不要。ローカル開発は懸念点10で追加した `dev:full` スクリプト（`wrangler pages dev -- pnpm run dev`）でwranglerがプロキシを担うため、CORSミドルウェアも不要。

**問題点**:

HonoアプリにCORSミドルウェアが設定されていない。本番環境では同一オリジン配信のため問題ないが、ローカル開発環境では Vite dev server（`localhost:5173`）と wrangler（`localhost:8788`）が別ポートで起動するため、フロントエンドからAPIを呼び出す際にCORSエラーが発生する。

**推奨対応**:

2つのアプローチがある。どちらか一方を選択する:

**アプローチA: Hono CORSミドルウェア**
```ts
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono()
	.basePath("/api")
	.use(cors({
		origin: "http://localhost:5173",
	}))
	.get("/health", (context) => {
		return context.json({
			status: "ok",
		});
	});
```

**アプローチB: Vite proxy設定（CORSミドルウェア不要）**
```ts
// vite.config.ts
export default defineConfig({
	server: {
		proxy: {
			"/api": "http://localhost:8788",
		},
	},
});
```

**チーム内議論**:
同一オリジン配信のPWAなので、Vite proxyアプローチ（B）がシンプル。CORSミドルウェアを本番に含める必要がなくなる。ただし、懸念点10（dev:fullスクリプト）で `wrangler pages dev -- pnpm run dev` を採用する場合は、wrangler がプロキシを担うためどちらも不要になる可能性がある。

</details>

<details>
<summary>11. pages_build_output_dir の相対パスの注意（MEDIUM / 対応不要）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/wrangler.toml` 3行目 |
| 検出者 | infra-reviewer |

**対応不要の理由**: 設定自体は正しい。CI/CDワークフロー作成時に `working-directory: app/v2` を設定すればよく、現時点では対応不要（YAGNI）。

**問題点**:

`pages_build_output_dir = "./dist"` は `wrangler.toml` が存在するディレクトリからの相対パス。monorepo構成で `app/v2/` を作業ディレクトリとする前提が暗黙的になっている。

**推奨対応**:

Cloudflare Pages ダッシュボードで Root directory を `app/v2` に設定する。CI/CDワークフロー作成時に `working-directory: app/v2` を明示する。

</details>

## 対応済みの懸念点

<details>
<summary>1. AppType がルートの型情報を持たない（HIGH / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/src/lib/api/app.ts` |
| 検出者 | architecture-reviewer |

**問題点**:

現在のコードでは、`app.get(...)` の戻り値が変数に代入されず捨てられている。

```ts
const app = new Hono().basePath("/api");

app.get("/health", (context) => {          // 戻り値を捨てている
	return context.json({
		status: "ok",
	});
});

export type AppType = typeof app;          // ルート定義を含まない型になる
```

Honoのルーティングメソッド（`.get()`, `.post()` 等）は **新しい型情報を持ったインスタンスを返す** 設計になっている。元の `app` 変数は `Hono` 型のままで、`.get("/health", ...)` で追加されたルートの型情報（パス文字列リテラル、レスポンスのJSONスキーマ等）はその戻り値にしか存在しない。

**推奨対応**:

ルート定義をメソッドチェーンで記述し、最終的な型を持つインスタンスから `AppType` を取得する。

```ts
import { Hono } from "hono";

const app = new Hono()
	.basePath("/api")
	.get("/health", (context) => {
		return context.json({
			status: "ok",
		});
	});

export type AppType = typeof app;

export { app };
```

</details>

<details>
<summary>2. .wrangler/ が .gitignore に含まれていない（HIGH / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **HIGH** |
| ファイル | `app/v2/.gitignore` |
| 検出者 | infra-reviewer |

**問題点**:

現在の `.gitignore` には `.wrangler` ディレクトリが含まれていない。wrangler実行時に生成される `.wrangler/` にはキャッシュや認証トークンが含まれる。

**推奨対応**:

`app/v2/.gitignore` に `.wrangler` を追加する。

</details>

<details>
<summary>4. tsconfig の二重コンパイル問題（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/tsconfig.functions.json` 25行目, `app/v2/tsconfig.app.json` |
| 検出者 | architecture-reviewer, infra-reviewer |

**問題点**:

`src/lib/api/app.ts` が2つの異なるtsconfigで同時にコンパイル対象になっている。

**推奨対応**:

`tsconfig.app.json` から `src/lib/api` を除外する:

```json
{
	"include": ["src"],
	"exclude": ["src/lib/api"]
}
```

</details>

<details>
<summary>5. セキュリティヘッダーの不在（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/lib/api/app.ts` |
| 検出者 | security-reviewer |

**問題点**:

APIレスポンスにセキュリティ関連のHTTPヘッダーが設定されていない。

**推奨対応**:

```ts
import { secureHeaders } from "hono/secure-headers";
app.use(secureHeaders());
```

</details>

<details>
<summary>6. 未定義ルートとエラーハンドリング（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/lib/api/app.ts` |
| 検出者 | security-reviewer |

**問題点**:

Honoのデフォルト404はプレーンテキスト。デフォルトonErrorはエラーメッセージをレスポンスに含め情報漏洩リスクがある。

**推奨対応**:

```ts
app.notFound((context) => {
	return context.json({ error: "Not Found" }, 404);
});

app.onError((err, context) => {
	console.error(err);
	return context.json({ error: "Internal Server Error" }, 500);
});
```

</details>

<details>
<summary>7. ESLint が functions にブラウザ向け設定で適用（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/eslint.config.js` 14行目, 27行目 |
| 検出者 | infra-reviewer |

**問題点**:

ESLint設定の `globals.browser` が functions ファイルにも適用され、`window` 等のブラウザグローバルがlintで検出されない。

**推奨対応**:

functions用のESLint overrideを追加し、`globals.worker` を適用する。

</details>

<details>
<summary>8. テストが jsdom 環境で実行（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/src/__tests__/api.test.ts`, `app/v2/vite.config.ts` 13行目 |
| 検出者 | architecture-reviewer |

**問題点**:

APIテストがjsdom環境で実行され、ブラウザグローバルの存在によりテストの偽陽性リスクがある。

**推奨対応**:

テストファイルの先頭に `// @vitest-environment node` ディレクティブを追加。

</details>

<details>
<summary>9. tsconfig.functions.json にパスエイリアス未設定（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/tsconfig.functions.json`, `app/v2/functions/api/[[route]].ts` 2行目 |
| 検出者 | architecture-reviewer, security-reviewer |

**問題点**:

`tsconfig.app.json` には `@/*` パスエイリアスがあるが、`tsconfig.functions.json` にはない。

**推奨対応**:

`tsconfig.functions.json` に `baseUrl` と `paths` を追加。

</details>

<details>
<summary>10. ローカル開発用 dev スクリプト未整備（MEDIUM / 修正済み）</summary>

| 項目 | 内容 |
|------|------|
| 重要度 | **MEDIUM** |
| ファイル | `app/v2/package.json` 9行目 |
| 検出者 | infra-reviewer |

**問題点**:

`"dev": "vite"` のみで Pages Functions がローカルで動作しない。

**推奨対応**:

```json
"dev:full": "wrangler pages dev --compatibility-date=2026-04-05 -- pnpm run dev"
```

</details>
