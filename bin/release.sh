#!/bin/bash

## Login to the NPM registry.
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc

### @exteranto/core ###
cd lib/core

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm run build
npm publish --access public

sleep 5
### @exteranto/api ###
cd ../api

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm i @exteranto/core@${TRAVIS_TAG/v/} || exit 1
npm run build
npm publish --access public

sleep 5
### @exteranto/utils ###
cd ../utils

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm i @exteranto/core@${TRAVIS_TAG/v/} @exteranto/api@${TRAVIS_TAG/v/} || exit 1
npm run build
npm publish --access public

# Push back to the repository

cd ../..

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git remote add token-remote https://${GITHUB_TOKEN}@github.com/exteranto/framework.git
git add lib/**/*.json
git commit -m "$TRAVIS_TAG"
git push token-remote HEAD:master
