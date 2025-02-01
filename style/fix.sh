#!/bin/bash

status=0

commands=(
    "prettier --write '**/*.{css,html,js,json,md,mjs,ts,yml}'"
    "eslint --fix"
    "stylelint --fix **/*.css --ignore-path .gitignore"
)

for command in "${commands[@]}"; do
    eval "$command" || status=1
done

exit $status
