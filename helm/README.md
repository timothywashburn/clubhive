# Helm Chart Deployment

## Prerequisites

### Deploy Token

1. Go to your GitLab project → Settings → Repository → Deploy tokens
2. Create a new token with:
    - "Scopes": **read_registry**
3. Use the username and token/password in the next step

### Create GitLab Registry Secret

```bash
# For dev environment
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<your-deploy-token-username> \
  --docker-password=<your-deploy-token-password> \
  --namespace=clubhive-dev

# For prod environment
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<your-deploy-token-username> \
  --docker-password=<your-deploy-token-password> \
  --namespace=clubhive
```

## Deployment

```bash
# Deploy to dev
helm upgrade --install clubhive-dev ./helm -f helm/values-dev.yaml --namespace clubhive-dev --create-namespace

# Deploy to prod
helm upgrade --install clubhive ./helm -f helm/values-prod.yaml --namespace clubhive --create-namespace
```
