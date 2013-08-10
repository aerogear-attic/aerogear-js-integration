#!/bin/bash

BASE_DIR=`pwd`/$(dirname $0)
VERTX_VERSION='vert.x-2.0.0-final'
DOWNLOAD_URL="http://dl.bintray.com/vertx/downloads/$VERTX_VERSION.tar.gz"
VERTX_PATH="$BASE_DIR/$VERTX_VERSION"

if [ "$1" == "stop" ]; then
    echo "Server stopped!"
    for i in `ps -ef | grep -i vertx | awk '{print $2}'`
    do
      kill -9 $i 2> /dev/null
    done
    exit 0
fi

if [ -d "$VERTX_PATH" ]; then
    rm -rf $VERTX_PATH/
fi

if [ ! -f "$VERTX_PATH.tar.gz" ]; then
    wget -c $DOWNLOAD_URL -P $BASE_DIR/
fi

if [ -f "$VERTX_PATH.tar.gz" ]; then
    tar xzvf $VERTX_PATH.tar.gz
else
    echo "The path does not contain a vertx distribution"
fi

nohup $VERTX_VERSION/bin/vertx run $BASE_DIR/server.js -conf $BASE_DIR/conf/config.json &
sleep 10
echo "Server started!"
