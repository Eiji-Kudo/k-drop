# infra

GitHub リポジトリ設定を Terraform で管理する。

## 前提条件

- Terraform >= 1.5
- GitHub CLI (`gh`) で認証済み

## セットアップ

```bash
cd infra
export GITHUB_TOKEN=$(gh auth token)
terraform init
```

## 使い方

```bash
# 差分確認
terraform plan

# 適用
terraform apply
```

## 管理リソース

| リソース | 内容 |
|---|---|
| `protect_main` | main ブランチ保護（PR必須・削除禁止・force push禁止・署名必須） |
| `block_branch_creation` | Admin 以外のブランチ作成を禁止 |
