#!/usr/bin/env bash
set -e
IMAGE="${1:-erickuiper/vriendenvan}"
CONTAINER_NAME="vriendenvan-test"
PORT=8080

echo "Building Docker image: $IMAGE"
docker build -t "$IMAGE" .

echo "Starting container on port $PORT..."
docker run -d -p $PORT:80 --name "$CONTAINER_NAME" "$IMAGE"

echo "Waiting for app to respond..."
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" | grep -q 200; then
    echo "App is up."
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Timeout waiting for app"
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

echo "Running integration tests against container..."
DOCKER_BASE_URL="http://localhost:$PORT" npm run test:e2e:docker
RESULT=$?

echo "Stopping container..."
docker stop "$CONTAINER_NAME"
docker rm "$CONTAINER_NAME"

if [ $RESULT -eq 0 ]; then
  echo "Build and tests OK. Push with: docker push $IMAGE"
fi
exit $RESULT
