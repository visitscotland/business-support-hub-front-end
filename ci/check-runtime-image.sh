#!/bin/sh
set -eu

image=${1:?Pass the deployment image name}
expected=$(tr -d '\r\n' < .nvmrc)
actual=$(docker run --rm --entrypoint node "$image" --version)
if [ "$actual" != "v$expected" ]; then
    printf 'Runtime image %s has Node %s; .nvmrc requires %s. Rebuild the image before deployment.\n' "$image" "$actual" "$expected" >&2
    exit 1
fi
