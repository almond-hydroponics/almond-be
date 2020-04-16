#!/bin/bash

set -ex
set -o pipefail

echo "Clean the images root dir"

cleanup() {
  echo "Clean up begins"
  echo " "
  echo "Begin images removal"
  docker rmi -f "$(docker images -a | awk '{print $3}')"
}

main() {
  cleanup
}

main
