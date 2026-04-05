# v2 CD 計画

## デプロイ

### 本番デプロイ（main マージ時）
- Cloudflare Pages の Git 連携 or GitHub Actions + `wrangler pages deploy`
- D1 マイグレーション自動適用

### プレビューデプロイ（PR 時）
- PR ごとにプレビュー URL 自動生成
- Cloudflare Pages のプレビュー機能を利用

### 検討事項

- [ ] Cloudflare Pages Git 連携 vs GitHub Actions のどちらを使うか
- [ ] D1 マイグレーションの自動適用タイミング
- [ ] 環境変数・シークレットの管理方法
- [ ] ステージング環境の要否
