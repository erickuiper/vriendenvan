#!/usr/bin/env bash
# Poll PR #2 until ready to merge (mergeable_state=clean) or failure/blocked.
# Usage: ./scripts/watch-pr.sh

set -e
REPO="erickuiper/vriendenvan"
PR=2
INTERVAL=45

echo "Watching PR #$PR — https://github.com/$REPO/pull/$PR"
echo "Ready to merge when mergeable_state=clean (CI passing, no blocking reviews)."
echo ""

last_comment_count=-1
max_loops=20
loop=0
while [ "$loop" -lt "$max_loops" ]; do
  loop=$((loop + 1))
  PR_JSON=$(curl -sS -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$REPO/pulls/$PR")
  STATE=$(echo "$PR_JSON" | jq -r '.state')
  MERGEABLE=$(echo "$PR_JSON" | jq -r '.mergeable')
  MERGEABLE_STATE=$(echo "$PR_JSON" | jq -r '.mergeable_state')
  TITLE=$(echo "$PR_JSON" | jq -r '.title')
  COMMENTS=$(curl -sS -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$REPO/issues/$PR/comments")
  COMMENT_COUNT=$(echo "$COMMENTS" | jq 'length')
  COMMIT_SHA=$(echo "$PR_JSON" | jq -r '.head.sha')
  STATUS_JSON=$(curl -sS -H "Accept: application/vnd.github+json" "https://api.github.com/repos/$REPO/commits/$COMMIT_SHA/status")
  COMMIT_STATE=$(echo "$STATUS_JSON" | jq -r '.state')

  echo "--- $(date -Iseconds) ---"
  echo "  state=$STATE mergeable=$MERGEABLE mergeable_state=$MERGEABLE_STATE commit_status=$COMMIT_STATE"
  echo "  title: $TITLE"
  echo "  issue comments: $COMMENT_COUNT"

  if [ "$COMMENT_COUNT" != "$last_comment_count" ] && [ "$last_comment_count" -ge 0 ]; then
    echo "  New comment(s):"
    echo "$COMMENTS" | jq -r '.[] | "    \(.user.login): \(.body | split("\n")[0])"' 2>/dev/null || true
  fi
  last_comment_count=$COMMENT_COUNT

  if [ "$STATE" != "open" ]; then
    echo "PR is no longer open (state=$STATE). Stopping."
    exit 0
  fi

  if [ "$MERGEABLE_STATE" = "clean" ]; then
    echo ""
    echo "PR is ready to merge (mergeable_state=clean)."
    exit 0
  fi

  if [ "$MERGEABLE_STATE" = "dirty" ] || [ "$MERGEABLE" = "false" ]; then
    echo "PR has merge conflicts or is not mergeable. Stopping."
    exit 1
  fi

  if [ "$COMMIT_STATE" = "failure" ] || [ "$COMMIT_STATE" = "error" ]; then
    echo "Commit status: $COMMIT_STATE — CI failing. Will keep polling until fixed."
  fi

  echo "  Next check in ${INTERVAL}s... (loop $loop/$max_loops)"
  echo ""
  sleep "$INTERVAL"
done
echo "Reached max loops. Re-run script to continue watching."
exit 2
