# Docker Hub secrets for GitHub Actions

The workflow **Build & push Docker image** runs only on `main` and pushes the image to `erickuiper/vriendenvan` on Docker Hub. It needs two repository secrets.

## 1. Create a Docker Hub access token (recommended)

1. Log in at [hub.docker.com](https://hub.docker.com).
2. **Account Settings** → **Security** → **New Access Token**.
3. Name it (e.g. `github-vriendenvan`) and set permissions to **Read, Write, Delete** (or **Read & Write**).
4. Copy the token; you won’t see it again.

## 2. Add secrets in GitHub

1. Open the repo: **https://github.com/erickuiper/vriendenvan**
2. **Settings** → **Secrets and variables** → **Actions**.
3. **New repository secret** for each:

| Secret name       | Value                                      |
|-------------------|--------------------------------------------|
| `DOCKER_USERNAME` | Your Docker Hub username (e.g. `erickuiper`) |
| `DOCKER_PASSWORD` | Your Docker Hub password or **access token** (prefer token) |

Use the access token as `DOCKER_PASSWORD` if you created one.

## 3. Check that it works

After saving the secrets, push to `main`. The **Build & push Docker image** job should run after **Test** and push `erickuiper/vriendenvan:latest` to Docker Hub.

## Optional: use a GitHub Personal Access Token

You can use a GitHub PAT for other automation; for Docker Hub push you only need the two secrets above.
