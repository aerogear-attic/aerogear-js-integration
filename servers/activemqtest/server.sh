#!/bin/sh

BASE_DIR=`pwd`/$(dirname $0)
ACTIVEMQ_VERSION='5.8.0'
DOWNLOAD_URL="http://www.poolsaboveground.com/apache/activemq/apache-activemq/$ACTIVEMQ_VERSION/apache-activemq-$ACTIVEMQ_VERSION-bin.tar.gz"
ACTIVEMQ_PATH="$BASE_DIR/apache-activemq-$ACTIVEMQ_VERSION"
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
    echo $DOWNLOAD_URL
    wget -c $DOWNLOAD_URL -P $BASE_DIR/
fi

if [ -f "$ACTIVEMQ_PATH-bin.tar.gz" ]; then
    tar xzvf $ACTIVEMQ_PATH-bin.tar.gz
    tar xzvf $BASE_DIR/conf.tar.gz -C apache-activemq-$ACTIVEMQ_VERSION/
else
    echo "The path does not contain a activemq distribution"
    exit 3
fi

nohup apache-activemq-$ACTIVEMQ_VERSION/bin/activemq start &
sleep 10
echo "Server started!"
