#!/bin/sh

BASE_DIR=`pwd`/$(dirname $0)

export ACTIVEMQ_DATA="activemq/data"
ACTIVEMQ_VERSION="$BASE_DIR/activemq"

if [ "$1" == "stop" ]; then
    echo "Server stopped!"
    for i in `ps -ef | grep -i activemq | awk '{print $2}'`
    do
      kill -9 $i 2> /dev/null
    done
    exit 0
fi

if [ -d "$ACTIVEMQ_VERSION" ]; then
  rm -rf $ACTIVEMQ_VERSION/
fi

if [ -f "$ACTIVEMQ_VERSION.tar.gz" ]; then
  tar xzvf $ACTIVEMQ_VERSION.tar.gz 
else
  echo "The path does not contain a activemq distribution"
fi

echo "Server started!"

nohup activemq/bin/activemq start &
