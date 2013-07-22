#!/bin/sh

VERTX_VERSION="vert.x-2.0.0-final"

if [ "$1" == "stop" ]; then
    echo "Server stopped!"
    for i in `ps -ef | grep -i vertx | awk '{print $2}'`
    do
      kill -9 $i 2> /dev/null
    done
    exit 0
fi

if [ -d "$VERTX_VERSION" ]; then
  rm -rf $VERTX_VERSION/
fi

if [ -f "$VERTX_VERSION.tar.gz" ]; then
  tar xzvf $VERTX_VERSION.tar.gz
else
  echo "The path does not contain a vertx distribution"
fi

echo "Server started!"

nohup $VERTX_VERSION/bin/vertx run diy/server.js -conf conf/config.json &
