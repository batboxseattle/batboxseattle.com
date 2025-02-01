#!/bin/bash

APP_NAME=$(uuidgen)
SERVER_TIMEOUT=30

start_server() {
    pm2 start --name "$APP_NAME" npm -- run start > /dev/null 2>&1
    local remaining_timeout=SERVER_TIMEOUT

    while ! curl -sSf http://localhost:8080 > /dev/null 2>&1; do
        sleep 1
        remaining_timeout=$((remaining_timeout - 1))
        if [ $remaining_timeout -le 0 ]; then
            echo "Error: could not connect to server in time."
            stop_server
            exit 1
        fi
    done
}

stop_server() {
  pm2 delete "$APP_NAME" > /dev/null 2>&1
}

run_webhint_check() {
  start_server
  hint $(node --no-warnings --loader ts-node/esm get-urls.ts)
  hint_status_code=$?
  stop_server
  return $hint_status_code
}

commands=(
    "prettier --check '**/*.{css,html,js,json,md,mjs,ts,yml}'"
    "eslint"
    "htmlhint --config .htmlhintrc.json"
    "stylelint **/*.css --ignore-path .gitignore"
    "run_webhint_check"
)

status=0

for command in "${commands[@]}"; do
    eval "$command" || status=1
done

exit $status
