#!/bin/bash

BASE_DIR=`pwd`/$(dirname $0)
AG_REST_SERVICE_REPO="$BASE_DIR/aerogear-js-itests-rest-service"

if [ ! -d "$AG_REST_SERVICE_REPO" ]; then
    git clone https://github.com/tolis-e/aerogear-js-itests-rest-service.git $AG_REST_SERVICE_REPO
fi

exit 0
