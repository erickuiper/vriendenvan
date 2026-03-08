# Docker build, test & push

**One-time:** log in to Docker (needed on this machine before any `docker` command):

```bash
docker login
```

**Build image, run container, run integration tests:**

```bash
./scripts/docker-build-and-test.sh
```

Default image: `erickuiper/vriendenvan`. Override: `./scripts/docker-build-and-test.sh your-registry/your-image`.

**Push image:**

```bash
docker push erickuiper/vriendenvan
```

**Manual flow** (if you prefer):

```bash
docker build -t erickuiper/vriendenvan .
docker run -d -p 8080:80 --name vriendenvan-test erickuiper/vriendenvan
npm run test:e2e:docker
docker stop vriendenvan-test && docker rm vriendenvan-test
docker push erickuiper/vriendenvan
```
