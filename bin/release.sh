#!/bin/bash

cd lib

for lib in support ioc aop events exceptions core storage messaging tabs cache compatibility management
do
  cd ${lib}
  # Start commands, use ${lib} to refer to the current package.

  # sed -i -e 's/file:\.\.[^"]*/\^1.0.10/g' package.json package-lock.json

  # End commands.
  cd ..
done