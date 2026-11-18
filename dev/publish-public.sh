#!/usr/bin/env bash
# Publish the current commit to the PUBLIC repo without the personal study plan and without the private history:
# one new commit on top of the public main, whose tree is HEAD's tree with js/data/plan.js replaced by
# dev/public/plan.js (PLAN_DEFAULT = null). Old private commits are never pushed, so the plan never leaves.
# Usage: dev/publish-public.sh "<commit message>"   (remote: $PUBLIC_REMOTE, default "public"; added if missing)
set -euo pipefail
msg=${1:?usage: dev/publish-public.sh "<commit message>"}
remote=${PUBLIC_REMOTE:-public}
url=https://github.com/MedardWork/ExtMatMat_Tracker.git
git diff --quiet HEAD || { echo "Commit first: the working tree has changes." >&2; exit 1; }
git remote get-url "$remote" >/dev/null 2>&1 || git remote add "$remote" "$url"
git fetch -q "$remote" main
idx="$(git rev-parse --git-dir)/public-index"
GIT_INDEX_FILE="$idx" git read-tree HEAD
blob=$(git hash-object -w dev/public/plan.js)
GIT_INDEX_FILE="$idx" git update-index --cacheinfo 100644,"$blob",js/data/plan.js
tree=$(GIT_INDEX_FILE="$idx" git write-tree)
git cat-file -p "$tree:js/data/plan.js" | grep -q "^const PLAN_DEFAULT = null;" || { echo "The public tree still has a plan." >&2; exit 1; }
parent=$(git rev-parse "$remote/main")
if [ "$(git rev-parse "$parent^{tree}")" = "$tree" ]; then echo "The public main already has this tree."; exit 0; fi
commit=$(git commit-tree "$tree" -p "$parent" -m "$msg")
git push "$remote" "$commit:refs/heads/main"
echo "Published $commit on $remote/main."
