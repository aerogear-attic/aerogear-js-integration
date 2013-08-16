#!/bin/bash

BASE_DIR=`pwd`/$(dirname $0)
NETTY_PATH="$BASE_DIR/netty"
SPS_PATH="$BASE_DIR/SPS"

if [ "$1" == "stop" ]; then
    echo "Server stopped!"
    for i in `ps -ef | grep -E 'SimplePushTest|pushRelayServer' | awk '{print $2}'`
    do
      kill -9 $i 2> /dev/null
    done
    exit 0
fi

node servers/simplepush/pushRelayServer.js &

if [ -d "$NETTY_PATH" ]; then
    rm -rf $NETTY_PATH/
fi

git clone https://github.com/danbev/netty.git
cd netty
git checkout tags/ci
mvn install -DskipTests=true

if [ -d "$SPS_PATH" ]; then
    rm -rf $SPS_PATH/
fi

cd $BASE_DIR
git clone https://github.com/aerogear/aerogear-simplepush-server.git SPS
cp -rf ../../aerogear-simplepush-server/ SPS
cd SPS
mvn install -DskipTests=true
cd server-netty

mvn exec:java -Dexec.args="-host=localhost -port=7777 -tls=false -ack_interval=10000 -useragent_reaper_timeout=60000 -token_key=SimplePushTest" &
sleep 5
echo "Server started!"
