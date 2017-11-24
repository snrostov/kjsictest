#!/usr/bin/env bash

set -e
set -x

cd "$( dirname "${BASH_SOURCE[0]}" )"

gradle clean build -x test
yarn
yarn bundle
