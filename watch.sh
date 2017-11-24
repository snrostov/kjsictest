#!/usr/bin/env bash

set -e
set -x

cd "$( dirname "${BASH_SOURCE[0]}" )"

echo "Initial build..."
yarn
gradle clean build -x test

echo "Starting watch"

gradle build -x test --continuous &
GRADLE_PID=$!
trap "kill ${GRADLE_PID}" SIGINT SIGTERM EXIT

yarn watch
wait