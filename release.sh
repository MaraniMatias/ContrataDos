#!/bin/bash -
#===============================================================================
#
#          FILE: release.sh
#
#         USAGE: ./release.sh --release
#
#   DESCRIPTION:
#                Git commit and merge
#                Compressed file
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Marnai Matias Ezequiel,
#  ORGANIZATION:
#       CREATED: 29/04/20 19:28
#      REVISION:  v0.0.1
#===============================================================================

set -o nounset                              # Treat unset variables as an error

version=$(cat package.json | grep -oP "\"version\"\s*:\s*\"+(.+)\"+" | grep -oP "\d+\.\d+\.\d+")

gitTag() {
  git checkout .
  git pull origin master
  yarn version --patch
  git push origin master
  git checkout release
  git pull origin release
  git merge --no-ff --no-edit master
  git push origin release
  git checkout master
  git push --follow-tags
}

main() {
  rm ContrataDos_*.zip
  # Build paths
  rm -drf release
  mkdir -p release
  # Copy base docs
  cp .env ./release/.env.production
  cp package.json ./release
  cp README.md ./release
  # Copy server
  cp -R ./server/* ./release/
  # Build and copy client
  npm run build:client
  mkdir -p ./release/public
  cp -R ./dist/* ./release/public
  rm -drf ./dist
  # Build and copy docs
  npm run build:docs
  mkdir -p ./release/public/docs
  cp -R ./docs/dist/* ./release/public/docs
  # Set assert paths on server
  cd ./release/public/docs
  find . -name "*.html" -exec sed -ie "s/\/assets/\/docs\/assets/g" index.html {} +
  cd -
  rm -drf ./docs/dist

  # Make ZIP
  cd ./release && zip -r -du "ContrataDos_${version}.zip" .
  cd -
  cp "./release/ContrataDos_${version}.zip" .
  # rm -drf ./release ## Ahora mantengo en release
}

if [ $# -gt 0 ]; then
  if [ "$1" == "--release" ]; then
    gitTag
    git checkout release
    main
  fi
else
  printf "%srelease\t Increase package version and make a tag on release git branch\n" '--'
  main
fi

exit 1
