#!/bin/zsh
echo "--- GIT STATUS ---"
git status
echo "\n--- GIT RECENT COMMITS ---"
git log -n 5
echo "\n--- GH RUN LIST ---"
gh run list --limit 5
echo "\n--- GH RECENT RUN LOGS ---"
# Get the latest run ID and show logs for frontend
LATEST_RUN_ID=$(gh run list --limit 1 --json databaseId --jq '.[0].databaseId')
if [ ! -z "$LATEST_RUN_ID" ]; then
  echo "Fetching logs for run $LATEST_RUN_ID..."
  gh run view $LATEST_RUN_ID --log
fi
