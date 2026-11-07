#!/bin/sh
#
# Put the repository back together after a workspace restore.
#
# The platform that runs this workspace saves files between sessions, but it
# deliberately leaves three things out, and all three are parts of a working
# git directory:
#
#   .git/config      kept out as a credential path
#   .git/refs/       empty, because every ref is packed - and an empty
#                    directory is not a file, so there is nothing to save
#   file modes       restored as 0644, which ssh refuses to use for a key
#
# The result is a repository that looks complete and isn't: git will not
# recognise it, and the push that should just work fails with "Permission
# denied (publickey)" that has nothing to do with the key. Rather than
# discover that again mid-session, run this once at the start of a turn.
#
# It is safe to run more than once, and safe to run on a healthy repo: it
# only fills in what is missing and never rewrites a config that exists.
#
# Usage:  sh scripts/restore-git.sh

set -e

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

if [ ! -d .git ]; then
  echo "no .git directory here - this does not look like the repository" >&2
  exit 1
fi

# 1. The refs directories. Packed refs live in .git/packed-refs, so these
#    can be legitimately empty - git still insists they exist.
mkdir -p .git/refs/heads .git/refs/tags
mkdir -p .git/objects/info .git/objects/pack

# 2. The config. Never clobber one that is already there; a real config may
#    carry remotes this script does not know about.
if [ ! -f .git/config ]; then
  cat > .git/config <<'CFG'
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = git@github.com:Ceoslugpk/Deen.git
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/main
CFG
  echo "wrote .git/config"
fi

# 3. The deploy key. ssh will not read a private key that group or other can
#    read, and a restore hands every file back as 0644.
if [ -f "$HOME/.ssh/deen_ed25519" ]; then
  chmod 700 "$HOME/.ssh"
  chmod 600 "$HOME/.ssh/deen_ed25519"
  echo "fixed ssh key permissions"
fi

echo
echo "repository: $(git rev-parse --abbrev-ref HEAD 2>&1) at $(git rev-parse --short HEAD 2>&1)"
echo "changes:    $(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
