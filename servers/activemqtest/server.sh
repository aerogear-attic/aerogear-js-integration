#!/bin/sh

BASE_DIR=`pwd`/$(dirname $0)
ACTIVEMQ_VERSION='apache-activemq-5.8.0'
DOWNLOAD_URL="http://www.us.apache.org/dist/activemq/apache-activemq/5.8.0/$ACTIVEMQ_VERSION-bin.tar.gz"
ACTIVEMQ_PATH="$BASE_DIR/$ACTIVEMQ_VERSION"
export ACTIVEMQ_DATA="$ACTIVEMQ_VERSION/data"

if [ "$1" == "stop" ]; then
    echo "Server stopped!"
    for i in `ps -ef | grep -i activemq | awk '{print $2}'`
    do
      kill -9 $i 2> /dev/null
    done
    exit 0
fi

if [ -d "$ACTIVEMQ_PATH" ]; then
    rm -rf $ACTIVEMQ_PATH/
fi

if [ ! -f "$ACTIVEMQ_PATH-bin.tar.gz" ]; then
    wget -c $DOWNLOAD_URL -P $BASE_DIR/
fi

if [ -f "$ACTIVEMQ_PATH-bin.tar.gz" ]; then
    tar xzvf $ACTIVEMQ_PATH-bin.tar.gz 
    tar xzvf $BASE_DIR/conf.tar.gz -C $ACTIVEMQ_VERSION/
else
    echo "The path does not contain a activemq distribution"
fi

echo "Server started!"

nohup $ACTIVEMQ_VERSION/bin/activemq start &
