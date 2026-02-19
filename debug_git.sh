#!/bin/bash
echo "Starting debug"
git --version
git config --get pull.rebase
git status
git pull --tags --no-edit origin main
echo "Exit code: $?"
